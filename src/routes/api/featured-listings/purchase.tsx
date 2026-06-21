/**
 * Featured Listing Purchase Endpoint
 * POST /api/featured-listings/purchase
 * Activates featured listing after payment
 */

import { json } from "@tanstack/react-start";
import { triggerN8NWorkflow } from "~/lib/n8n";

export async function POST({ request }: { request: Request }) {
  try {
    const payload = await request.json();

    // Validate required fields
    const required = ["vendorId", "razorpayPaymentId", "plan", "amount"];
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

    // Validate plan
    const validPlans = {
      standard: { duration: 30, weight_boost: 1.2 },
      premium: { duration: 60, weight_boost: 1.5 },
      elite: { duration: 90, weight_boost: 2.0 },
    };

    if (!validPlans[payload.plan as keyof typeof validPlans]) {
      return json(
        {
          success: false,
          error: "Invalid plan. Must be: standard, premium, or elite",
        },
        { status: 400 }
      );
    }

    // Trigger featured listing activation workflow
    const result = await triggerN8NWorkflow({
      type: "vendor",
      path: "featured-listing-purchase",
      data: {
        event: "featured_listing_activated",
        vendorId: payload.vendorId,
        plan: payload.plan,
        amount: payload.amount,
        razorpayPaymentId: payload.razorpayPaymentId,
        durationDays: validPlans[payload.plan as keyof typeof validPlans].duration,
        aiWeightBoost:
          validPlans[payload.plan as keyof typeof validPlans].weight_boost,
        homepagePlacement: true,
      },
    });

    if (!result.success) {
      throw new Error(result.error || "Failed to activate featured listing");
    }

    return json(
      {
        success: true,
        message: "Featured listing activated! You're now more visible to customers.",
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Featured listing error:", errorMessage);

    return json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
