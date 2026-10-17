import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Random delay: 150–1500 ms
  const delay = Math.floor(Math.random() * 1351) + 150;
  await new Promise((resolve) => setTimeout(resolve, delay));

  // 8% chance of a write error
  if (Math.random() < 0.08) {
    return NextResponse.json(
      { error: "Failed to update shipment. Please try again." },
      { status: 500 }
    );
  }

  const { id } = await params;
  const body = await request.json();

  return NextResponse.json({
    message: "Shipment updated successfully",
    id,
    status: body.status,
  });
}