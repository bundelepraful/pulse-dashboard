
export type Shipment = {
  id: string;
  destination: string;
  status: string;
  region: string;
  shipmentDate: string;
  exceptionStatus?: "open" | "resolved" | "escalated";
};

export const shipments: Shipment[] = Array.from(
  { length: 1200 },
  (_, i) => {
    const date = new Date("2026-01-01T00:00:00Z");
    date.setUTCDate(date.getUTCDate() + (i % 290));

    return {
      id: `SHP-${1000 + i}`,
      destination: [
        "Pune",
        "Mumbai",
        "Delhi",
        "Chennai",
        "Bengaluru",
      ][i % 5],
      status: ["In Transit", "Delivered", "Delayed"][i % 3],
      region: ["West", "North", "South", "East"][i % 4],
      shipmentDate: date.toISOString().slice(0, 10),
    };
  }
);
