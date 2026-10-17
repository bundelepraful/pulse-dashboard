
import { NextResponse } from "next/server";
import { shipments } from "../data";

type ExceptionAction = "resolve" | "escalate";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Simulate real-world API latency: 150–1500 ms
  const delay = Math.floor(Math.random() * 1351) + 150;
  await new Promise((resolve) => setTimeout(resolve, delay));

  // Simulate an 8% write failure rate
  if (Math.random() < 0.08) {
    return NextResponse.json(
      { error: "Update failed. Please try again." },
      { status: 500 }
    );
  }

  const { id } = await params;
  const shipment = shipments.find((item) => item.id === id);

  if (!shipment) {
    return NextResponse.json(
      { error: "Shipment not found" },
      { status: 404 }
    );
  }

  let body: {
    status?: string;
    exceptionAction?: ExceptionAction;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  if (body.exceptionAction === "resolve") {
    shipment.exceptionStatus = "resolved";

    return NextResponse.json({
      message: "Exception resolved successfully",
      data: shipment,
    });
  }

  if (body.exceptionAction === "escalate") {
    shipment.exceptionStatus = "escalated";

    return NextResponse.json({
      message: "Exception escalated successfully",
      data: shipment,
    });
  }

  if (body.status) {
    shipment.status = body.status;

    return NextResponse.json({
      message: "Shipment updated successfully",
      data: shipment,
    });
  }

  return NextResponse.json(
    { error: "Provide a status or valid exception action" },
    { status: 400 }
  );
}
