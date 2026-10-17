
import { NextResponse } from "next/server";
import { shipments } from "./data";

export async function GET(request: Request) {
  const delay = Math.floor(Math.random() * 1351) + 150;
  await new Promise((resolve) => setTimeout(resolve, delay));

  // Simulate a 3% read failure
  if (Math.random() < 0.03) {
    return NextResponse.json(
      { error: "Failed to fetch shipments" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const cursor = Math.max(
    0,
    Number(searchParams.get("cursor") ?? 0) || 0
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
