import { createFileRoute } from "@tanstack/react-router";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { triggerN8NWorkflow } from "@/lib/n8n";
import { supabase } from "@/lib/supabase-utils";

export const Route = createFileRoute("/api/payments/verify-redirect")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          // 1. Read payment params submitted by Razorpay as x-www-form-urlencoded
          const formData = await request.formData();
          const razorpayPaymentId = formData.get("razorpay_payment_id") as string;
          const razorpayOrderId = formData.get("razorpay_order_id") as string;
          const razorpaySignature = formData.get("razorpay_signature") as string;

          console.log("Hosted Redirect callback received details:", {
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature: razorpaySignature ? "present" : "missing",
          });

          if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
            console.error("Missing verification credentials in redirect callback");
            return new Response(null, {
              status: 303,
              headers: { Location: "/?payment=error&reason=MissingCredentials" },
            });
          }

          // 2. Fetch API configuration keys
          const keySecret = process.env.RAZORPAY_KEY_SECRET;
          const keyId = process.env.RAZORPAY_KEY_ID;
          if (!keySecret || !keyId) {
            console.error("Razorpay keys not configured on server");
            return new Response(null, {
              status: 303,
              headers: { Location: "/?payment=error&reason=ServerConfigError" },
            });
          }

          // 3. Verify Razorpay digital signature
          const verificationBody = `${razorpayOrderId}|${razorpayPaymentId}`;
          const isValid = verifyRazorpaySignature(
            verificationBody,
            razorpaySignature,
            keySecret
          );

          if (!isValid) {
            console.error("Invalid payment signature in redirect callback");
            return new Response(null, {
              status: 303,
              headers: { Location: "/?payment=error&reason=InvalidSignature" },
            });
          }

          // 4. Retrieve the order from Razorpay's API to extract booking metadata stored in 'notes'
          let notes: Record<string, string> = {};
          try {
            const auth = btoa(`${keyId}:${keySecret}`);
            const orderRes = await fetch(`https://api.razorpay.com/v1/orders/${razorpayOrderId}`, {
              headers: {
                Authorization: `Basic ${auth}`,
              },
            });

            if (orderRes.ok) {
              const orderData = await orderRes.json();
              notes = orderData.notes || {};
              console.log("Retrieved booking notes from Razorpay order:", notes);
            } else {
              console.error(`Failed to fetch order details from Razorpay: ${orderRes.statusText}`);
            }
          } catch (e) {
            console.error("Failed to query order notes from Razorpay:", e);
          }

          const userName = notes.userName || "Client";
          const userEmail = notes.userEmail || "";
          const vendorName = notes.vendorName || "Aanya Kapoor";
          const serviceName = notes.serviceName || "Bridal Makeup Package";
          const bookingDate = notes.bookingDate || new Date().toISOString();
          const amount = parseInt(notes.amount, 10) || 15000;

          // 5. Populate Supabase tables directly for payment success transparency
          let userRecordId = "";
          let vendorRecordId = "";
          let bookingRecordId = "";

          try {
            if (supabase) {
              // A. Ensure user exists
              if (userEmail) {
                const { data: existingUser } = await supabase
                  .from("users")
                  .select("id")
                  .eq("email", userEmail)
                  .maybeSingle();

                if (existingUser) {
                  userRecordId = existingUser.id;
                } else {
                  const { data: newUser, error: userError } = await supabase
                    .from("users")
                    .insert({
                      name: userName,
                      email: userEmail,
                      phone: "9999999999",
                    })
                    .select("id")
                    .single();
                  
                  if (!userError && newUser) {
                    userRecordId = newUser.id;
                  }
                }
              }

              // B. Ensure vendor exists
              const { data: existingVendor } = await supabase
                .from("vendors")
                .select("id")
                .eq("name", vendorName)
                .maybeSingle();

              if (existingVendor) {
                vendorRecordId = existingVendor.id;
              } else {
                const { data: newVendor, error: vendorError } = await supabase
                  .from("vendors")
                  .insert({
                    name: vendorName,
                    email: `${vendorName.toLowerCase().replace(/\s+/g, "")}@brideora.com`,
                    phone: "9999988888",
                    category: "makeup",
                    location: "Delhi",
                    status: "approved",
                  })
                  .select("id")
                  .single();

                if (!vendorError && newVendor) {
                  vendorRecordId = newVendor.id;
                }
              }

              // C. Insert booking
              const commissionAmount = amount * 0.1;
              const vendorPayout = amount * 0.9;

              const { data: newBooking, error: bookingError } = await supabase
                .from("bookings")
                .insert({
                  vendor_id: vendorRecordId || null,
                  user_id: userRecordId || null,
                  service_name: serviceName,
                  booking_date: new Date(bookingDate).toISOString(),
                  amount,
                  commission_amount: commissionAmount,
                  vendor_payout: vendorPayout,
                  razorpay_order_id: razorpayOrderId,
                  razorpay_payment_id: razorpayPaymentId,
                  razorpay_signature: razorpaySignature,
                  payment_status: "completed",
                  status: "confirmed",
                  payment_date: new Date().toISOString(),
                })
                .select("id")
                .single();

              if (bookingError) {
                throw bookingError;
              }

              if (newBooking) {
                bookingRecordId = newBooking.id;

                // D. Insert payment confirmation
                const { error: paymentError } = await supabase
                  .from("payments")
                  .insert({
                    booking_id: newBooking.id,
                    razorpay_order_id: razorpayOrderId,
                    razorpay_payment_id: razorpayPaymentId,
                    amount,
                    status: "captured",
                    vendor_amount: vendorPayout,
                    brideora_commission: commissionAmount,
                    captured_at: new Date().toISOString(),
                  });

                if (paymentError) {
                  console.error("Supabase payment log error:", paymentError);
                }
              }

              console.log("Successfully logged transaction records directly to Supabase.");
            }
          } catch (dbError) {
            console.error("Direct Supabase Logging Error in Redirect:", dbError);
          }

          // 6. Trigger n8n webhook workflow
          try {
            await triggerN8NWorkflow({
              type: "booking",
              data: {
                event: "payment_captured",
                razorpayPaymentId,
                razorpayOrderId,
                amount,
                serviceName,
                bookingDate,
                userEmail,
                userName,
                notes: notes.notes || "",
                status: "completed",
              },
            });
            console.log("Triggered n8n webhook workflow successfully.");
          } catch (n8nError) {
            console.error("Failed to trigger n8n callback webhook:", n8nError);
          }

          // 7. Redirect user back to home page with all receipt data for the checkout success view
          const successParams = new URLSearchParams({
            payment: "success",
            payment_id: razorpayPaymentId,
            order_id: razorpayOrderId,
            vendor_name: vendorName,
            service_name: serviceName,
            date: bookingDate,
            user_name: userName,
            amount: String(amount),
          });

          return new Response(null, {
            status: 303,
            headers: { Location: `/?${successParams.toString()}` },
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error("Callback redirect handler error:", errorMessage);
          return new Response(null, {
            status: 303,
            headers: { Location: `/?payment=error&reason=${encodeURIComponent(errorMessage)}` },
          });
        }
      },
    },
  },
});
