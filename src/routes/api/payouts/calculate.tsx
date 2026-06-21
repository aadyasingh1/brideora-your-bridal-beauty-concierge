/**
 * Payout Calculation Endpoint
 * POST /api/payouts/calculate
 * Calculates vendor payouts from completed bookings
 */

import { json } from "@tanstack/react-start";
import { triggerN8NWorkflow } from "~/lib/n8n";

export async function POST({ request }: { request: Request }) {
  try {
    const payload = await request.json();

    // Validate required fields
    const required = ["vendorId"];
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

    // Trigger payout calculation workflow
    const result = await triggerN8NWorkflow({
      type: "vendor",
      data: {
        event: "payout_calculation_requested",
        vendorId: payload.vendorId,
        periodStart: payload.periodStart || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
        periodEnd: payload.periodEnd || new Date().toISOString(),
      },
    });

    if (!result.success) {
      throw new Error(result.error || "Failed to calculate payout");
    }

    return json(
      {
        success: true,
        message: "Payout calculation initiated",
        data: result.data,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Payout calculation error:", errorMessage);

    return json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * GET /api/payouts/pending
 * Get all pending payouts for a vendor
 */
export async function GET({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);
    const vendorId = url.searchParams.get("vendorId");

    if (!vendorId) {
      return json(
        { success: false, error: "vendorId is required" },
        { status: 400 }
      );
    }

    // Trigger payout status check workflow
    const result = await triggerN8NWorkflow({
      type: "vendor",
      data: {
        event: "payout_status_check",
        vendorId,
      },
    });

    return json(
      {
        success: true,
        data: result.data,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Payout status error:", errorMessage);

    return json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
