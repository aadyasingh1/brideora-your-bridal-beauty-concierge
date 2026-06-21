/**
 * Review Submission Endpoint
 * POST /api/reviews/submit
 * Submits a review and updates vendor rating
 */

import { json } from "@tanstack/react-start";
import { triggerN8NWorkflow } from "~/lib/n8n";

export async function POST({ request }: { request: Request }) {
  try {
    const payload = await request.json();

    // Validate required fields
    const required = ["bookingId", "vendorId", "userId", "rating", "text"];
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

    // Validate rating
    if (payload.rating < 1 || payload.rating > 5) {
      return json(
        {
          success: false,
          error: "Rating must be between 1 and 5",
        },
        { status: 400 }
      );
    }

    // Trigger review processing workflow
    const result = await triggerN8NWorkflow({
      type: "notification",
      data: {
        event: "review_submitted",
        bookingId: payload.bookingId,
        vendorId: payload.vendorId,
        userId: payload.userId,
        rating: payload.rating,
        reviewText: payload.text,
        photoUrls: payload.photoUrls || [],
        userEmail: payload.userEmail,
        vendorEmail: payload.vendorEmail,
      },
    });

    if (!result.success) {
      throw new Error(result.error || "Failed to submit review");
    }

    return json(
      {
        success: true,
        message: "Review submitted and awaiting moderation",
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Review submission error:", errorMessage);

    return json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
