import { createFileRoute } from "@tanstack/react-router";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { triggerN8NWorkflow } from "@/lib/n8n";

export const Route = createFileRoute("/api/payments/verify")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const payload = await request.json();
          const {
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
            bookingData,
            featuredData,
          } = payload;

          if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
            return new Response(
              JSON.stringify({ success: false, error: "Missing verification credentials" }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          const keySecret = process.env.RAZORPAY_KEY_SECRET;
          if (!keySecret) {
            console.error("RAZORPAY_KEY_SECRET not configured");
            return new Response(
              JSON.stringify({ success: false, error: "Server credentials missing" }),
              { status: 500, headers: { "Content-Type": "application/json" } }
            );
          }

          // Verify Razorpay Web Checkout signature (order_id + "|" + payment_id encrypted with key_secret)
          const verificationBody = `${razorpayOrderId}|${razorpayPaymentId}`;
          const isValid = verifyRazorpaySignature(
            verificationBody,
            razorpaySignature,
            keySecret
          );

          if (!isValid) {
            return new Response(
              JSON.stringify({ success: false, error: "Invalid payment signature verification" }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          // If verification is successful, trigger relevant n8n flow
          if (bookingData) {
            await triggerN8NWorkflow({
              type: "booking",
              data: {
                event: "payment_captured",
                razorpayPaymentId,
                razorpayOrderId,
                amount: bookingData.amount,
                vendorId: bookingData.vendorId,
                serviceName: bookingData.serviceName,
                bookingDate: bookingData.bookingDate,
                userEmail: bookingData.userEmail,
                userName: bookingData.userName,
                notes: bookingData.notes || "",
                status: "completed",
              },
            });
          } else if (featuredData) {
            await triggerN8NWorkflow({
              type: "vendor",
              path: "featured-listing-purchase",
              data: {
                event: "featured_listing_activated",
                vendorId: featuredData.vendorId,
                plan: featuredData.plan,
                amount: featuredData.amount,
                razorpayPaymentId,
                durationDays: featuredData.durationDays || 30,
                aiWeightBoost: featuredData.aiWeightBoost || 1.2,
                homepagePlacement: true,
              },
            });
          }

          return new Response(
            JSON.stringify({
              success: true,
              message: "Payment successfully verified and logged.",
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error("Verification error:", errorMessage);
          return new Response(
            JSON.stringify({ success: false, error: errorMessage }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});
