import { json } from "@tanstack/react-start";
import { triggerN8NWorkflow } from "~/lib/n8n";

/**
 * POST /api/n8n/trigger
 * Trigger an n8n workflow with custom payload
 */
export async function POST({ request }: { request: Request }) {
  try {
    if (request.method !== "POST") {
      return json(
        { success: false, error: "Method not allowed" },
        { status: 405 }
      );
    }

    const payload = await request.json();

    // Validate required fields
    if (!payload.type || !payload.data) {
      return json(
        { success: false, error: "Missing required fields: type, data" },
        { status: 400 }
      );
    }

    const result = await triggerN8NWorkflow(payload);

    return json(result, {
      status: result.success ? 200 : 500,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("API route error:", errorMessage);

    return json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
