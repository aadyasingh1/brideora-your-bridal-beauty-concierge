import { createFileRoute } from "@tanstack/react-router";
import {
  verifyRazorpaySignature,
  extractPaymentDetails,
  calculateCommission,
} from "@/lib/razorpay";
import { triggerN8NWorkflow } from "@/lib/n8n";

export const Route = createFileRoute("/api/webhooks/razorpay")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.text();
          const signature = request.headers.get("x-razorpay-signature") || "";

          // Get webhook secret from environment
          const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

          // Verify signature
          if (webhookSecret && signature) {
            if (!verifyRazorpaySignature(body, signature, webhookSecret)) {
              console.warn("Invalid Razorpay signature");
              return new Response(
                JSON.stringify({ success: false, error: "Invalid signature" }),
                { status: 403, headers: { "Content-Type": "application/json" } }
              );
            }
          } else if (process.env.NODE_ENV !== "development") {
            console.error("RAZORPAY_WEBHOOK_SECRET or x-razorpay-signature header missing");
            return new Response(
              JSON.stringify({ success: false, error: "Server configuration error" }),
              { status: 500, headers: { "Content-Type": "application/json" } }
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
              return new Response(
                JSON.stringify({ success: true, message: "Event processed" }),
                { status: 200, headers: { "Content-Type": "application/json" } }
              );
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error("Razorpay webhook error:", errorMessage);

          return new Response(
            JSON.stringify({ success: false, error: errorMessage }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});

async function handlePaymentCaptured(event: any) {
  try {
    const details = extractPaymentDetails(event);
    const commission = calculateCommission(details.amount);

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

    return new Response(
      JSON.stringify({ success: true, message: "Payment captured and processed" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Payment capture error:", errorMessage);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

async function handlePaymentFailed(event: any) {
  try {
    const details = extractPaymentDetails(event);

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

    return new Response(
      JSON.stringify({ success: true, message: "Payment failure processed" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Payment failure error:", errorMessage);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

async function handlePaymentRefunded(event: any) {
  try {
    const details = extractPaymentDetails(event);

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

    return new Response(
      JSON.stringify({ success: true, message: "Refund processed" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Refund error:", errorMessage);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
