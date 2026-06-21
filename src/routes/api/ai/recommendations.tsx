/**
 * AI Concierge Recommendation Endpoint
 * POST /api/ai/recommendations
 * Gets AI recommendations from Gemini and recommends vendors
 */

import { json } from "@tanstack/react-start";
import { triggerN8NWorkflow } from "~/lib/n8n";

export async function POST({ request }: { request: Request }) {
  try {
    const payload = await request.json();

    // Validate required fields
    const required = ["userId", "requirements", "userEmail"];
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

    // Trigger AI recommendation workflow
    const result = await triggerN8NWorkflow({
      type: "inquiry",
      data: {
        event: "ai_recommendation_requested",
        userId: payload.userId,
        requirements: payload.requirements,
        eventType: payload.eventType || "wedding",
        eventDate: payload.eventDate,
        budget: {
          min: payload.budgetMin,
          max: payload.budgetMax,
        },
        preferences: payload.preferences || [],
        location: payload.location,
        userEmail: payload.userEmail,
      },
    });

    if (!result.success) {
      throw new Error(result.error || "Failed to get recommendations");
    }

    return json(
      {
        success: true,
        message: "Recommendations generated",
        data: result.data,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("AI recommendation error:", errorMessage);

    return json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
