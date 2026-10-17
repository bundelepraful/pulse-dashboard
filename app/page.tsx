"use client";


import {useState} from "react";

export default function Home(){
//state for search input commit 1
  const[search, setSearch]=useState("");
//state for status filter commit 2
  const[status,setStatus]= useState("All");
//commit 3 
  const[sortBy, setSortby] = useState("id");

  //shipments data
  const shipments = [
    {
      id: "S101",
      destination: "Pune",
      status: "In Transit",
    },
    {
      id: "S102",
      destination: "Jalgaon",
      status: "delivered",
    },
    {
      id: "S103",
      destination: "Mumbai",
      status: "delay",
    },
    {
      id: "S104",
      destination: "Delhi",
      status: "In Transit"
    }
];

  //filtering the shipment data based on search input
  const filtered = shipments.filter((s) =>{
    
    const matchesSearch =
      s.destination.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      status === "All" || s.status === status;
    return matchesSearch && matchesStatus;

})
  .sort ((a, b) => a[sortBy as keyof typeof a].localeCompare(b[sortBy as keyof typeof b])
);

;
//returning the filtered data
  return(
    <main>
      <aside>
        <h2>Pulse</h2>
        <p>dashboard</p>
        <p>Shipments</p>
        <p>Exceptions</p>
      </aside>

     
      <section>
        <h1> Operations Dashboard</h1>
        <p> Monitor Your Shipments in one place</p>

        <div className="cards">
          <div>
            <h3>1,248</h3>
            <p> total shipments </p>
          </div>

           <div>
            <h3>486</h3>
            <p> In Transit </p>
          </div>

           <div>
            <h3>692</h3>
            <p> delivered </p>
          </div>

          <div>
            <h3>24</h3>
            <p> exceptions </p>
          </div>
        </div>

        
        <h2> Shipments  </h2>
        <input
          placeholder="Search by destination or ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
            <option value="Delayed">Delayed</option>
          </select>

        <select value={sortBy}
            onChange={(e) => setSortby(e.target.value)}
          >
            <option value="id">sort by id</option>
            <option value="destination">sort by destination</option>
            <option value="status">sort by status</option>
          </select>
        
        <table>
          <thead>
            <tr>
              <th>ID</th>
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
          </tbody>
        </table>
      </section>
    </main>
  );
}