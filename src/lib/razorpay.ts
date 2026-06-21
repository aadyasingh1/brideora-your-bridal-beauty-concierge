/**
 * Razorpay Payment Verification & Webhook Handler
 * Verifies HMAC SHA256 signatures for Razorpay payments
 */

import crypto from "crypto";

export interface RazorpayWebhookEvent {
  id: string;
  entity: string;
  event: string;
  created_at: number;
  payload: {
    payment?: {
      entity: {
        id: string;
        order_id: string;
        amount: number;
        currency: string;
        status: string;
        [key: string]: unknown;
      };
    };
    order?: {
      entity: {
        id: string;
        amount: number;
        currency: string;
        [key: string]: unknown;
      };
    };
    [key: string]: unknown;
  };
}

/**
 * Verify Razorpay webhook signature using HMAC SHA256
 * @param webhookBody Raw request body as string
 * @param webhookSignature X-Razorpay-Signature header
 * @param webhookSecret Razorpay webhook secret from dashboard
 * @returns true if signature is valid
 */
export function verifyRazorpaySignature(
  webhookBody: string,
  webhookSignature: string,
  webhookSecret: string
): boolean {
  try {
    const hash = crypto
      .createHmac("sha256", webhookSecret)
      .update(webhookBody)
      .digest("hex");

    return hash === webhookSignature;
  } catch (error) {
    console.error("Razorpay signature verification failed:", error);
    return false;
  }
}

/**
 * Extract payment details from Razorpay webhook
 */
export function extractPaymentDetails(event: RazorpayWebhookEvent) {
  const payment = event.payload.payment?.entity;

  if (!payment) {
    throw new Error("Invalid Razorpay webhook: missing payment entity");
  }

  return {
    razorpayPaymentId: payment.id,
    razorpayOrderId: payment.order_id,
    amount: payment.amount / 100, // Convert paise to rupees
    currency: payment.currency,
    status: payment.status,
    timestamp: event.created_at,
    event: event.event,
  };
}

/**
 * Calculate commission and payout from payment amount
 * Brideora takes 10% commission
 */
export function calculateCommission(
  amount: number,
  commissionPercentage: number = 10
) {
  const commission = (amount * commissionPercentage) / 100;
  const payout = amount - commission;

  return {
    totalAmount: amount,
    commission,
    payout,
    commissionPercentage,
  };
}

/**
 * Format payment object for database storage
 */
export function formatPaymentForDB(event: RazorpayWebhookEvent) {
  const details = extractPaymentDetails(event);
  const commission = calculateCommission(details.amount);

  return {
    razorpay_order_id: details.razorpayOrderId,
    razorpay_payment_id: details.razorpayPaymentId,
    amount: details.amount,
    currency: details.currency,
    status: details.status === "captured" ? "captured" : "failed",
    vendor_amount: commission.payout,
    brideora_commission: commission.commission,
  };
}
