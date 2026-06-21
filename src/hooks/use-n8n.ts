import { useMutation } from "@tanstack/react-query";
import type { N8NWebhookPayload, N8NResponse } from "~/lib/n8n";

/**
 * Hook for triggering n8n workflows from React components
 */
export function useN8NWorkflow() {
  return useMutation<N8NResponse, Error, N8NWebhookPayload>({
    mutationFn: async (payload: N8NWebhookPayload) => {
      const response = await fetch("/api/n8n/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to trigger workflow: ${response.statusText}`);
      }

      return response.json();
    },
  });
}

/**
 * Hook for sending vendor inquiries
 */
export function useVendorInquiry() {
  return useMutation<
    N8NResponse,
    Error,
    {
      vendorId: string;
      vendorName: string;
      category: string;
      inquiryMessage: string;
      userEmail: string;
      userName: string;
    }
  >({
    mutationFn: async (data) => {
      const response = await fetch("/api/n8n/vendor-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to send inquiry: ${response.statusText}`);
      }

      return response.json();
    },
  });
}

/**
 * Hook for sending booking notifications
 */
export function useBookingNotification() {
  return useMutation<
    N8NResponse,
    Error,
    {
      bookingId: string;
      vendorId: string;
      vendorName: string;
      serviceName: string;
      bookingDate: string;
      userEmail: string;
      userName: string;
      amount?: number;
    }
  >({
    mutationFn: async (data) => {
      const response = await fetch("/api/n8n/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to send booking notification: ${response.statusText}`);
      }

      return response.json();
    },
  });
}

/**
 * Hook for sending notifications
 */
export function useSendNotification() {
  return useMutation<
    N8NResponse,
    Error,
    {
      recipient: string;
      subject: string;
      message: string;
      notificationType: "email" | "sms" | "push";
    }
  >({
    mutationFn: async (data) => {
      const response = await fetch("/api/n8n/notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to send notification: ${response.statusText}`);
      }

      return response.json();
    },
  });
}
