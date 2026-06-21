import { json } from "@tanstack/react-start";
import { sendVendorInquiry } from "~/lib/n8n";

/**
 * POST /api/n8n/vendor-inquiry
 * Send a vendor inquiry to n8n workflow
 */
export async function POST({ request }: { request: Request }) {
  try {
    const payload = await request.json();

    // Validate required fields
    const required = [
      "vendorId",
      "vendorName",
      "category",
      "inquiryMessage",
      "userEmail",
      "userName",
    ];
    const missing = required.filter((field) => !payload[field]);

    if (missing.length > 0) {
      return json(
        { success: false, error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    const result = await sendVendorInquiry(payload);

    return json(result, {
      status: result.success ? 200 : 500,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Vendor inquiry error:", errorMessage);

    return json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
