/**
 * Razorpay Webhook Handler
 * POST /api/webhooks/razorpay
 * 
 * Handles payment confirmation, updates bookings, and triggers n8n workflows
 */

import { json } from "@tanstack/react-start";
import {
  verifyRazorpaySignature,
  extractPaymentDetails,
  calculateCommission,
} from "~/lib/razorpay";
import { triggerN8NWorkflow } from "~/lib/n8n";

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-razorpay-signature") || "";

    // Get webhook secret from environment
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("RAZORPAY_WEBHOOK_SECRET not configured");
      return json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Verify signature
    if (!verifyRazorpaySignature(body, signature, webhookSecret)) {
      console.warn("Invalid Razorpay signature");
      return json(
        { success: false, error: "Invalid signature" },
        { status: 403 }
      );
    }

    const event = JSON.parse(body);
    console.log("Razorpay webhook event:", event.event);

    // Handle different event types
    switch (event.event) {
      case "payment.authorized":
      case "payment.captured":
        return handlePaymentCaptured(event);

      case "payment.failed":
        return handlePaymentFailed(event);

      case "payment.refunded":
        return handlePaymentRefunded(event);

      default:
        return json(
          { success: true, message: "Event processed" },
          { status: 200 }
        );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Razorpay webhook error:", errorMessage);

    return json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

/**
 * Handle successful payment capture
 */
async function handlePaymentCaptured(event: any) {
  try {
    const details = extractPaymentDetails(event);
    const commission = calculateCommission(details.amount);

    // Trigger n8n workflow for payment processing
    await triggerN8NWorkflow({
      type: "booking",
      data: {
        event: "payment_captured",
        razorpayPaymentId: details.razorpayPaymentId,
        razorpayOrderId: details.razorpayOrderId,
        amount: details.amount,
        commission: commission.commission,
        vendorPayout: commission.payout,
        status: "completed",
      },
    });

    return json(
      { success: true, message: "Payment captured and processed" },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Payment capture error:", errorMessage);

    return json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * Handle payment failure
 */
async function handlePaymentFailed(event: any) {
  try {
    const details = extractPaymentDetails(event);

    // Trigger n8n workflow for payment failure
    await triggerN8NWorkflow({
      type: "booking",
      data: {
        event: "payment_failed",
        razorpayPaymentId: details.razorpayPaymentId,
        razorpayOrderId: details.razorpayOrderId,
        amount: details.amount,
        status: "failed",
      },
    });

    return json(
      { success: true, message: "Payment failure processed" },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Payment failure error:", errorMessage);

    return json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * Handle payment refund
 */
async function handlePaymentRefunded(event: any) {
  try {
    const details = extractPaymentDetails(event);

    // Trigger n8n workflow for refund
    await triggerN8NWorkflow({
      type: "booking",
      data: {
        event: "payment_refunded",
        razorpayPaymentId: details.razorpayPaymentId,
        razorpayOrderId: details.razorpayOrderId,
        amount: details.amount,
        status: "refunded",
      },
    });

    return json(
      { success: true, message: "Refund processed" },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Refund error:", errorMessage);

    return json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
