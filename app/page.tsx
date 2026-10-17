
"use client";

import { useEffect, useState } from "react";

type Shipment = {
  id: string;
  destination: string;
  status: string;
  region: string;
  shipmentDate: string;
};

type ShipmentsResponse = {
  total: number;
  data: Shipment[];
  nextCursor: number | null;
};

export default function Home() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [sortBy, setSortBy] = useState("id");
  const [region, setRegion] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [cursor, setCursor] = useState<number | null>(0);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [total, setTotal] = useState(1200);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  function updateUrl(key: string, value: string) {
    const params = new URLSearchParams(window.location.search);

    if (!value || value === "All" || (key === "sortBy" && value === "id")) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const query = params.toString();
    const newUrl = query ? `/?${query}` : "/";

    window.history.replaceState(null, "", newUrl);
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    setSearch(params.get("search") || "");
    setStatus(params.get("status") || "All");
    setRegion(params.get("region") || "All");
    setStartDate(params.get("startDate") || "");
    setEndDate(params.get("endDate") || "");
    setSortBy(params.get("sortBy") || "id");
  }, []);

  async function loadShipments(pageCursor: number) {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/shipments?cursor=${pageCursor}`);

      if (!response.ok) {
        throw new Error("Unable to load shipments.");
      }

      const result: ShipmentsResponse = await response.json();

      setShipments(result.data);
      setNextCursor(result.nextCursor);
      setCursor(pageCursor);
      setTotal(result.total);
    } catch {
      setError("Failed to load shipments. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, newStatus: string) {
    const previousShipments = [...shipments];

    setShipments((current) =>
      current.map((shipment) =>
        shipment.id === id
          ? { ...shipment, status: newStatus }
          : shipment
      )
    );

    setUpdatingId(id);
    setUpdateError("");

    try {
      const response = await fetch(`/api/shipments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Update failed");
      }
    } catch {
      setShipments(previousShipments);
      setUpdateError(
        `Could not update ${id}. Its previous status has been restored.`
      );
    } finally {
      setUpdatingId(null);
    }
  }

  useEffect(() => {
    loadShipments(0);
  }, []);

  const filtered = shipments
    .filter((shipment) => {
      const matchesSearch =
        shipment.id.toLowerCase().includes(search.toLowerCase()) ||
        shipment.destination.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        status === "All" || shipment.status === status;

      const matchesRegion =
        region === "All" || shipment.region === region;

      const matchesStartDate =
        !startDate || shipment.shipmentDate >= startDate;

      const matchesEndDate =
        !endDate || shipment.shipmentDate <= endDate;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesRegion &&
        matchesStartDate &&
        matchesEndDate
      );
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

  const inTransitCount = shipments.filter(
    (shipment) => shipment.status === "In Transit"
  ).length;

  const deliveredCount = shipments.filter(
    (shipment) => shipment.status === "Delivered"
  ).length;

  const delayedCount = shipments.filter(
    (shipment) => shipment.status === "Delayed"
  ).length;

  return (
    <main>
      <aside>
        <h2>Pulse.</h2>
        <p>Dashboard</p>
        <p>Shipments</p>
        <p><a href="#exceptions">Exceptions</a></p>
      </aside>

      <section>
        <h1>Operations Dashboard</h1>
        <p>Monitor your shipments in one place.</p>

        <div className="cards">
          <div><h3>{total.toLocaleString()}</h3><p>Total Shipments</p></div>
          <div><h3>{inTransitCount}</h3><p>In Transit (current page)</p></div>
          <div><h3>{deliveredCount}</h3><p>Delivered (current page)</p></div>
          <div><h3>{delayedCount}</h3><p>Delayed (current page)</p></div>
        </div>

        <h2>Shipments</h2>

        <div className="controls">
          <input
            aria-label="Search shipments"
            placeholder="Search ID or destination"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              updateUrl("search", e.target.value);
            }}
          />

          <select
            aria-label="Filter by status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              updateUrl("status", e.target.value);
            }}
          >
            <option value="All">All Statuses</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
            <option value="Delayed">Delayed</option>
          </select>

          <select
            aria-label="Filter by region"
            value={region}
            onChange={(e) => {
              setRegion(e.target.value);
              updateUrl("region", e.target.value);
            }}
          >
            <option value="All">All Regions</option>
            <option value="West">West</option>
            <option value="North">North</option>
            <option value="South">South</option>
            <option value="East">East</option>
          </select>

          <label>
            Start date
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                updateUrl("startDate", e.target.value);
              }}
            />
          </label>

          <label>
            End date
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                updateUrl("endDate", e.target.value);
              }}
            />
          </label>

          <select
            aria-label="Sort shipments"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              updateUrl("sortBy", e.target.value);
            }}
          >
            <option value="id">Sort by ID</option>
            <option value="destination">Sort by Destination</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>

        {startDate && endDate && startDate > endDate && (
          <p role="alert">Start date must be before or equal to end date.</p>
        )}

        {updateError && <p role="alert">{updateError}</p>}

        {loading && <p role="status">Loading shipments...</p>}

        {error && (
          <div>
            <p role="alert">{error}</p>
            <button onClick={() => loadShipments(cursor ?? 0)}>Retry</button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div style={{ overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th>Shipment ID</th>
                    <th>Destination</th>
                    <th>Region</th>
                    <th>Shipment Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((shipment) => (
                    <tr key={shipment.id}>
                      <td><a href={`/shipments/${shipment.id}`}>{shipment.id}</a></td>
                      <td>{shipment.destination}</td>
                      <td>{shipment.region}</td>
                      <td>{shipment.shipmentDate}</td>
                      <td>{shipment.status}</td>
                      <td>
                        <select
                          aria-label={`Update status for ${shipment.id}`}
                          value={shipment.status}
                          disabled={updatingId === shipment.id}
                          onChange={(e) => updateStatus(shipment.id, e.target.value)}
                        >
                          <option value="In Transit">In Transit</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Delayed">Delayed</option>
                        </select>
                        {updatingId === shipment.id && <span role="status"> Saving...</span>}
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr><td colSpan={6}>No shipments found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <section id="exceptions">
              <h2>Exceptions</h2>
              {shipments.filter((shipment) => shipment.status === "Delayed").length === 0 ? (
                <p>No delayed shipments on this page.</p>
              ) : (
                <ul>
                  {shipments
                    .filter((shipment) => shipment.status === "Delayed")
                    .map((shipment) => (
                      <li key={shipment.id}>
                        <a href={`/shipments/${shipment.id}`}>{shipment.id}</a>
                        {" — "}{shipment.destination} — {shipment.status}
                      </li>
                    ))}
                </ul>
              )}
            </section>

            <p>
              Showing records {(cursor ?? 0) + 1}–
              {Math.min((cursor ?? 0) + shipments.length, total)} of {total}
            </p>

            <button
              disabled={cursor === 0 || loading}
              onClick={() => loadShipments(Math.max(0, (cursor ?? 0) - 20))}
            >
              Previous Page
            </button>

            <button
              disabled={nextCursor === null || loading}
              onClick={() => {
                if (nextCursor !== null) loadShipments(nextCursor);
              }}
            >
              Next Page
            </button>
          </>
        )}
      </section>
    </main>
  );
}
