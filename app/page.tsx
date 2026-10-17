
"use client";

import { useEffect, useState } from "react";

type Shipment = {
  id: string;
  destination: string;
  status: string;
};

export default function Home() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [sortBy, setSortBy] = useState("id");
  const [cursor, setCursor] = useState<number | null>(0);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadShipments(pageCursor: number) {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/shipments?cursor=${pageCursor}`
      );

      if (!response.ok) {
        throw new Error("Unable to load shipments. Please try again.");
      }

      const result = await response.json();

      setShipments(result.data);
      setNextCursor(result.nextCursor);
      setCursor(pageCursor);
    } catch {
      setError("Failed to load shipments. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadShipments(0);
  }, []);

  const filtered = shipments
    .filter((s) => {
      const matchesSearch =
        s.id.toLowerCase().includes(search.toLowerCase()) ||
        s.destination.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        status === "All" || s.status === status;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "destination") {
        return a.destination.localeCompare(b.destination);
      }

      if (sortBy === "status") {
        return a.status.localeCompare(b.status);
      }

      return a.id.localeCompare(b.id);
    });

  return (
    <main>
      <aside>
        <h2>Pulse.</h2>
        <p>Dashboard</p>
        <p>Shipments</p>
        <p>Exceptions</p>
      </aside>

      <section>
        <h1>Operations Dashboard</h1>
        <p>Monitor your shipments in one place.</p>

        <div className="cards">
          <div><h3>1,200</h3><p>Total Shipments</p></div>
          <div><h3>400</h3><p>In Transit</p></div>
          <div><h3>400</h3><p>Delivered</p></div>
          <div><h3>400</h3><p>Delayed</p></div>
        </div>

        <h2>Shipments</h2>

        <div className="controls">
          <input
            placeholder="Search ID or destination"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
            <option value="Delayed">Delayed</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="id">Sort by ID</option>
            <option value="destination">Sort by Destination</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>

        {loading && <p>Loading shipments...</p>}

        {error && (
          <div>
            <p role="alert">{error}</p>
            <button onClick={() => loadShipments(cursor ?? 0)}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <table>
              <thead>
                <tr>
                  <th>Shipment ID</th>
                  <th>Destination</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.destination}</td>
                    <td>{s.status}</td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={3}>No shipments found.</td>
                  </tr>
                )}
              </tbody>
            </table>

            <p>Page starts at record {cursor! + 1} of 1,200</p>

            <button
              disabled={cursor === 0 || loading}
              onClick={() => loadShipments(Math.max(0, (cursor ?? 0) - 20))}
            >
              Previous Page
            </button>

            <button
              disabled={nextCursor === null || loading}
              onClick={() => loadShipments(nextCursor!)}
            >
              Next Page
            </button>
          </>
        )}
      </section>
    </main>
  );
}
