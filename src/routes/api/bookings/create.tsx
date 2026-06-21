/**
 * Create Booking Endpoint
 * POST /api/bookings/create
 * Creates booking and triggers payment workflow
 */

import { json } from "@tanstack/react-start";
import { triggerN8NWorkflow } from "~/lib/n8n";

export async function POST({ request }: { request: Request }) {
  try {
    const payload = await request.json();

    // Validate required fields
    const required = [
      "vendorId",
      "userId",
      "serviceName",
      "bookingDate",
      "amount",
      "userEmail",
      "userName",
    ];
    const missing = required.filter((field) => !payload[field]);

    if (missing.length > 0) {
      return json(
        {
          success: false,
          error: `Missing required fields: ${missing.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Check vendor availability
    const availabilityCheck = await triggerN8NWorkflow({
      type: "booking",
      data: {
        event: "check_availability",
        vendorId: payload.vendorId,
        bookingDate: payload.bookingDate,
        durationHours: payload.durationHours || 2,
      },
    });

    // Trigger booking creation workflow
    const result = await triggerN8NWorkflow({
      type: "booking",
      data: {
        event: "booking_created",
        vendorId: payload.vendorId,
        userId: payload.userId,
        serviceName: payload.serviceName,
        bookingDate: payload.bookingDate,
        endDate: payload.endDate,
        durationHours: payload.durationHours || 2,
        amount: payload.amount,
        userEmail: payload.userEmail,
        userName: payload.userName,
        notes: payload.notes,
      },
    });

    if (!result.success) {
      throw new Error(result.error || "Failed to create booking");
    }

    return json(
      {
        success: true,
        message: "Booking created. Vendor confirmation pending.",
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Booking creation error:", errorMessage);

    return json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
