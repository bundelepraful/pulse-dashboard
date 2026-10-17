
import { NextResponse } from "next/server";

const shipments = Array.from({ length: 1200 }, (_, i) => ({
  id: `SHP-${1000 + i}`,
  destination: ["Pune", "Mumbai", "Delhi", "Chennai", "Bengaluru"][i % 5],
  status: ["In Transit", "Delivered", "Delayed"][i % 3],
}));

export async function GET(request: Request) {
  // Random delay between 150ms and 1500ms
  const delay = Math.floor(Math.random() * 1351) + 1500; //delay between 1500ms and 2850ms

  await new Promise((resolve) => setTimeout(resolve, delay));

  // 3% chance of a read error
  if (Math.random() < 0.03) {
    return NextResponse.json(
      { error: "Failed to load shipments. Please try again." },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const cursor = Math.max(
    0,
    Number(searchParams.get("cursor") || 0)
  );
  const limit = 20;

  const data = shipments.slice(cursor, cursor + limit);
  const nextCursor =
    cursor + limit < shipments.length ? cursor + limit : null;

  return NextResponse.json({
    total: shipments.length,
    data,
    nextCursor,
  });
}
