/**
 * Booking Management - Reschedule & Cancel
 * POST /api/bookings/reschedule
 * POST /api/bookings/cancel
 */

import { json } from "@tanstack/react-start";
import { triggerN8NWorkflow } from "~/lib/n8n";

/**
 * Reschedule a booking
 */
export async function POST_reschedule({ request }: { request: Request }) {
  try {
    const payload = await request.json();

    // Validate required fields
    const required = [
      "bookingId",
      "newBookingDate",
      "vendorId",
      "userEmail",
      "vendorEmail",
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

    // Trigger rescheduling workflow
    const result = await triggerN8NWorkflow({
      type: "booking",
      data: {
        event: "booking_rescheduled",
        bookingId: payload.bookingId,
        vendorId: payload.vendorId,
        newBookingDate: payload.newBookingDate,
        reason: payload.reason || "No reason provided",
        userEmail: payload.userEmail,
        vendorEmail: payload.vendorEmail,
      },
    });

    if (!result.success) {
      throw new Error(result.error || "Failed to reschedule booking");
    }

    return json(
      {
        success: true,
        message: "Booking rescheduled. Vendor confirmation pending.",
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Booking reschedule error:", errorMessage);

    return json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * Cancel a booking
 */
export async function POST_cancel({ request }: { request: Request }) {
  try {
    const payload = await request.json();

    // Validate required fields
    const required = ["bookingId", "reason", "userEmail", "vendorEmail"];
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

    // Determine if refund is needed
    const refundNeeded = payload.refundNeeded !== false; // Default true

    // Trigger cancellation workflow
    const result = await triggerN8NWorkflow({
      type: "booking",
      data: {
        event: "booking_cancelled",
        bookingId: payload.bookingId,
        reason: payload.reason,
        refundNeeded,
        cancellationFee: payload.cancellationFee || 0, // Deductible fee if any
        userEmail: payload.userEmail,
        vendorEmail: payload.vendorEmail,
      },
    });

    if (!result.success) {
      throw new Error(result.error || "Failed to cancel booking");
    }

    return json(
      {
        success: true,
        message: refundNeeded
          ? "Booking cancelled. Refund will be processed within 5 business days."
          : "Booking cancelled. No refund applicable.",
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Booking cancellation error:", errorMessage);

    return json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
