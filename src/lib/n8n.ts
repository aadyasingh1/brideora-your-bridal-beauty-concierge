/**
 * N8N Integration
 * Connects Brideora to n8n workflows for automation
 */

export const N8N_WEBHOOK_URL = "https://aaadyasingh1.app.n8n.cloud/webhook";
export const N8N_WORKFLOW_ID = "QKrKA8oXiY06dYBT";

export interface N8NWebhookPayload {
  type: "vendor" | "booking" | "notification" | "inquiry";
  data: Record<string, unknown>;
  timestamp?: string;
}

export interface N8NResponse {
  success: boolean;
  message?: string;
  data?: unknown;
  error?: string;
}

/**
 * Trigger an n8n workflow via webhook
 */
export async function triggerN8NWorkflow(
  payload: N8NWebhookPayload
): Promise<N8NResponse> {
  try {
    const webhookUrl = `${N8N_WEBHOOK_URL}/${N8N_WORKFLOW_ID}`;

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        timestamp: payload.timestamp || new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`N8N webhook failed with status ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("N8N workflow trigger error:", errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Send vendor inquiry to n8n
 */
export async function sendVendorInquiry(vendorData: {
  vendorId: string;
  vendorName: string;
  category: string;
  inquiryMessage: string;
  userEmail: string;
  userName: string;
}): Promise<N8NResponse> {
  return triggerN8NWorkflow({
    type: "vendor",
    data: vendorData,
  });
}

/**
 * Send booking confirmation to n8n
 */
export async function sendBookingNotification(bookingData: {
  bookingId: string;
  vendorId: string;
  vendorName: string;
  serviceName: string;
  bookingDate: string;
  userEmail: string;
  userName: string;
  amount?: number;
}): Promise<N8NResponse> {
  return triggerN8NWorkflow({
    type: "booking",
    data: bookingData,
  });
}

/**
 * Send notification via n8n
 */
export async function sendNotification(notificationData: {
  recipient: string;
  subject: string;
  message: string;
  notificationType: "email" | "sms" | "push";
}): Promise<N8NResponse> {
  return triggerN8NWorkflow({
    type: "notification",
    data: notificationData,
  });
}
