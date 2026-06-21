/**
 * Notification Service
 * Handles email, WhatsApp, SMS, and in-app notifications
 */

import { N8N_WEBHOOK_URL } from "./n8n";

export interface NotificationPayload {
  type: "email" | "whatsapp" | "sms" | "in_app";
  recipient: string; // email, phone, or user_id
  subject?: string;
  message: string;
  templateName?: string;
  templateData?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

/**
 * Send notification via n8n workflow
 */
export async function sendNotification(
  payload: NotificationPayload
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const response = await fetch(`${N8N_WEBHOOK_URL}/notifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Notification failed: ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, messageId: data.messageId };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Notification error:", errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Send email notification
 */
export async function sendEmail(
  to: string,
  subject: string,
  message: string,
  htmlContent?: string
) {
  return sendNotification({
    type: "email",
    recipient: to,
    subject,
    message,
    templateData: { htmlContent },
  });
}

/**
 * Send WhatsApp notification
 */
export async function sendWhatsApp(
  phoneNumber: string,
  message: string,
  templateName?: string
) {
  return sendNotification({
    type: "whatsapp",
    recipient: phoneNumber,
    message,
    templateName,
  });
}

/**
 * Send SMS notification
 */
export async function sendSMS(phoneNumber: string, message: string) {
  return sendNotification({
    type: "sms",
    recipient: phoneNumber,
    message,
  });
}

/**
 * Send in-app notification
 */
export async function sendInAppNotification(
  userId: string,
  title: string,
  message: string,
  metadata?: Record<string, unknown>
) {
  return sendNotification({
    type: "in_app",
    recipient: userId,
    subject: title,
    message,
    metadata,
  });
}

/**
 * Email Templates
 */
export const emailTemplates = {
  vendorApproved: (vendorName: string) => ({
    subject: "Your Brideora Vendor Account Approved!",
    message: `Hi ${vendorName}, your vendor account has been approved. You can now accept bookings on Brideora!`,
  }),

  vendorRejected: (vendorName: string, reason?: string) => ({
    subject: "Brideora Vendor Account Status",
    message: `Hi ${vendorName}, unfortunately your vendor account was not approved. ${reason ? `Reason: ${reason}` : ""}`,
  }),

  bookingConfirmed: (
    vendorName: string,
    bookingDate: string,
    amount: number
  ) => ({
    subject: "New Booking Confirmed on Brideora",
    message: `Hi ${vendorName}, you have a new booking on ${bookingDate} for ₹${amount}. Please log in to view details.`,
  }),

  bookingRequest: (
    vendorName: string,
    customerName: string,
    bookingDate: string
  ) => ({
    subject: "New Booking Request from Brideora",
    message: `Hi ${vendorName}, ${customerName} has requested your services for ${bookingDate}. Please respond within 24 hours.`,
  }),

  paymentReceived: (vendorName: string, amount: number) => ({
    subject: "Payment Received - Brideora",
    message: `Hi ${vendorName}, we received a payment of ₹${amount}. Vendor payout will be processed within 5 business days.`,
  }),

  reviewRequest: (vendorName: string, customerName: string) => ({
    subject: "Please Review Your Recent Service - Brideora",
    message: `Hi ${customerName}, thank you for booking ${vendorName}! Could you please leave a review of your experience?`,
  }),

  payoutApproved: (vendorName: string, amount: number) => ({
    subject: "Your Payout is Being Processed - Brideora",
    message: `Hi ${vendorName}, your payout of ₹${amount} has been approved and will be transferred within 2 business days.`,
  }),

  subscriptionRenewal: (vendorName: string, plan: string, amount: number) => ({
    subject: `Your ${plan} Plan Renewal - Brideora`,
    message: `Hi ${vendorName}, your ${plan} subscription (₹${amount}) will renew in 3 days. You can manage it in your dashboard.`,
  }),

  featuredListingActive: (vendorName: string, expiryDate: string) => ({
    subject: "Your Featured Listing is Active - Brideora",
    message: `Hi ${vendorName}, congratulations! Your featured listing is now active and visible to more customers. It expires on ${expiryDate}.`,
  }),
};

/**
 * WhatsApp Templates
 */
export const whatsappTemplates = {
  bookingConfirmed: (vendorName: string, bookingDate: string) =>
    `Hi ${vendorName}, you have a new booking on ${bookingDate}! Check your Brideora dashboard for details.`,

  bookingReminder: (vendorName: string, bookingDate: string) =>
    `Reminder: You have a booking tomorrow (${bookingDate}). Please confirm if you'll be available.`,

  reviewRequest: (customerName: string, vendorName: string) =>
    `Hi ${customerName}, thank you for booking ${vendorName}! Please share your experience: https://brideora.com/review`,

  payoutReady: (vendorName: string, amount: number) =>
    `Hi ${vendorName}, your payout of ₹${amount} is ready for withdrawal. Check your dashboard to claim it!`,
};
