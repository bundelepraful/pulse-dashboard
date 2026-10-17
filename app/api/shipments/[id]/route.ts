
import { NextResponse } from "next/server";
import { shipments } from "../data";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const delay = Math.floor(Math.random() * 1351) + 150;
  await new Promise((resolve) => setTimeout(resolve, delay));

  if (Math.random() < 0.08) {
    return NextResponse.json(
      { error: "Failed to update shipment. Please try again." },
      { status: 500 }
    );
  }

  const { id } = await params;
  const body = await request.json();

  const shipment = shipments.find((s) => s.id === id);

  if (!shipment) {
    return NextResponse.json(
      { error: "Shipment not found" },
      { status: 404 }
    );
  }

  shipment.status = body.status;

  return NextResponse.json({
    message: "Shipment updated successfully",
    data: shipment,
  });
}
