
export type Shipment = {
  id: string;
  destination: string;
  status: string;
};

export const shipments: Shipment[] = Array.from(
  { length: 1200 },
  (_, i) => ({
    id: `SHP-${1000 + i}`,
    destination: ["Pune", "Mumbai", "Delhi", "Chennai", "Bengaluru"][i % 5],
    status: ["In Transit", "Delivered", "Delayed"][i % 3],
  })
);
