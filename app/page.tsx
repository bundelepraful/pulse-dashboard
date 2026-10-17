
import { shipments } from "./api/shipments/data";
import ShipmentsDashboard from "./ShipmentsDashboard";

export default function Home() {
  const initialShipments = shipments.slice(0, 20);

  return (
    <ShipmentsDashboard
      initialShipments={initialShipments}
      initialTotal={shipments.length}
      initialNextCursor={
        shipments.length > 20 ? 20 : null
      }
    />
  );
}
