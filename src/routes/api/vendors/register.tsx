/**
 * Vendor Registration Endpoint
 * POST /api/vendors/register
 * Triggers vendor approval workflow in n8n
 */

import { json } from "@tanstack/react-start";
import { triggerN8NWorkflow } from "~/lib/n8n";

export async function POST({ request }: { request: Request }) {
  try {
    const payload = await request.json();

    // Validate required fields
    const required = [
      "name",
      "email",
      "phone",
      "category",
      "location",
      "panNumber",
      "bankAccount",
    ];
    const missing = required.filter((field) => !payload[field]);

    if (missing.length > 0) {
      return json(
        {
          success: false,
          error: `Missing required fields: ${missing.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Trigger n8n vendor registration workflow
    const result = await triggerN8NWorkflow({
      type: "vendor",
      data: {
        event: "vendor_registration",
        vendorData: {
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          category: payload.category,
          location: payload.location,
          bio: payload.bio,
          yearsExperience: payload.yearsExperience,
          panNumber: payload.panNumber,
          gstNumber: payload.gstNumber,
          bankAccount: payload.bankAccount,
          upiId: payload.upiId,
          serviceArea: payload.serviceArea,
        },
      },
    });

    if (!result.success) {
      throw new Error(result.error || "Failed to register vendor");
    }

    return json(
      {
        success: true,
        message: "Vendor registration submitted. Awaiting admin approval.",
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Vendor registration error:", errorMessage);

    return json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
