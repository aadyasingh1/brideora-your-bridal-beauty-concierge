import { json } from "@tanstack/react-start";
import { sendNotification } from "~/lib/n8n";

/**
 * POST /api/n8n/notification
 * Send a notification via n8n workflow
 */
export async function POST({ request }: { request: Request }) {
  try {
    const payload = await request.json();

    // Validate required fields
    const required = ["recipient", "subject", "message", "notificationType"];
    const missing = required.filter((field) => !payload[field]);

    if (missing.length > 0) {
      return json(
        { success: false, error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate notification type
    const validTypes = ["email", "sms", "push"];
    if (!validTypes.includes(payload.notificationType)) {
      return json(
        {
          success: false,
          error: `Invalid notificationType. Must be one of: ${validTypes.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const result = await sendNotification(payload);

    return json(result, {
      status: result.success ? 200 : 500,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Notification error:", errorMessage);

    return json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
