
import { Suspense } from "react";

type Props = {
  params: Promise<{ id: string }>;
};

async function CarrierHistory({ id }: { id: string }) {
  // Simulate a slow carrier-history API
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return (
    <section>
      <h2>Carrier History</h2>
      <ul>
        <li>Shipment created — {id}</li>
        <li>Package picked up by carrier</li>
        <li>Shipment is being processed</li>
      </ul>
    </section>
  );
}

export default async function ShipmentDetails({ params }: Props) {
  const { id } = await params;
  const number = Number(id.replace("SHP-", ""));
  const validId = Number.isFinite(number) && number >= 1000 && number < 2200;

  if (!validId) {
    return (
      <main style={{ padding: "30px" }}>
        <a href="/">← Back to Shipments</a>
        <h1>Shipment not found</h1>
        <p>Please check the shipment ID.</p>
      </main>
    );
  }

  const shipment = {
    id,
    destination: ["Pune", "Mumbai", "Delhi", "Chennai", "Bengaluru"][
      (number - 1000) % 5
    ],
    status: ["In Transit", "Delivered", "Delayed"][
      (number - 1000) % 3
    ],
  };

  return (
    <main style={{ padding: "30px" }}>
      <a href="/">← Back to Shipments</a>

      <h1>Shipment Details</h1>

      <div className="cards">
        <div>
          <h3>{shipment.id}</h3>
          <p>Shipment ID</p>
        </div>

        <div>
          <h3>{shipment.destination}</h3>
          <p>Destination</p>
        </div>

        <div>
          <h3>{shipment.status}</h3>
          <p>Current Status</p>
        </div>
      </div>

      <Suspense
        fallback={<p role="status">Loading carrier history...</p>}
      >
        <CarrierHistory id={id} />
      </Suspense>
    </main>
  );
}
