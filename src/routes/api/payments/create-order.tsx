import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/payments/create-order")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const payload = await request.json();
          const { amount, currency = "INR", receipt } = payload;

          if (!amount) {
            return new Response(
              JSON.stringify({ success: false, error: "Amount is required" }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          const keyId = process.env.RAZORPAY_KEY_ID;
          const keySecret = process.env.RAZORPAY_KEY_SECRET;

          if (!keyId || !keySecret) {
            console.error("Razorpay credentials not configured");
            return new Response(
              JSON.stringify({ success: false, error: "Server credentials missing" }),
              { status: 500, headers: { "Content-Type": "application/json" } }
            );
          }

          // Connect to Razorpay API directly using native fetch and basic authentication
          const auth = btoa(`${keyId}:${keySecret}`);

          const orderBody: any = {
            amount: Math.round(amount * 100), // Convert rupees to paise (sub-units)
            currency,
            receipt: receipt || `receipt_${Date.now()}`,
          };

          if (payload.bookingData) {
            orderBody.notes = {
              userName: payload.bookingData.userName || "",
              userEmail: payload.bookingData.userEmail || "",
              vendorName: payload.bookingData.vendorName || "",
              serviceName: payload.bookingData.serviceName || "",
              bookingDate: payload.bookingData.bookingDate || "",
              amount: String(payload.bookingData.amount || amount),
              notes: payload.bookingData.notes || "",
            };
          }

          const response = await fetch("https://api.razorpay.com/v1/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${auth}`,
            },
            body: JSON.stringify(orderBody),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Razorpay API error: ${errorText}`);
          }

          const order = await response.json();

          return new Response(
            JSON.stringify({
              success: true,
              orderId: order.id,
              amount: order.amount,
              currency: order.currency,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error("Order creation error:", errorMessage);
          return new Response(
            JSON.stringify({ success: false, error: errorMessage }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});
