"use client";


import {useState} from "react";

export default function Home(){
  const[search, setSearch]=useState("");


  //shipments data
  const shipment = [
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
  const filtered = shipment.filter((s) => 
    s.destination.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toLowerCase().includes(search.toLowerCase())
  );

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