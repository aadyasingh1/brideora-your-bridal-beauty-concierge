# N8N Razorpay Payment Integration Guide

We have successfully integrated Razorpay checkout into the Brideora codebase. To handle post-payment processing (updating databases, sending emails/WhatsApp, and calculated commission splits), you must configure your n8n workflow at:
`https://aaadyasingh1.app.n8n.cloud/`

---

## 1. N8N Webhook Endpoint

Your Brideora application calls your n8n instance whenever a payment is initialized, verified, or received via webhook.

**N8N Trigger Node Configuration:**
*   **Node Type:** Webhook
*   **HTTP Method:** POST
*   **Path:** `QKrKA8oXiY06dYBT`
*   **Response Mode:** On Received (respond immediately with `200 OK`)

---

## 2. Webhook Event Payloads

Your n8n workflow receives JSON payloads in the following format:

### Event: `payment_captured` (Successful Payment)
Sent immediately after a successful checkout verification or Razorpay captured webhook.
```json
{
  "type": "booking",
  "timestamp": "2026-06-21T21:00:00.000Z",
  "data": {
    "event": "payment_captured",
    "razorpayPaymentId": "pay_P1gH8dJ109sLp2",
    "razorpayOrderId": "order_OkD1J9s20hSla9",
    "amount": 18000,
    "vendorId": "00000000-0000-0000-0000-000000000000",
    "serviceName": "Bridal Makeup Package",
    "bookingDate": "2026-12-12T10:00:00.000Z",
    "userEmail": "bride@test.com",
    "userName": "Test Bride",
    "notes": "No preferences",
    "status": "completed"
  }
}
```

### Event: `payment_failed`
Sent if a payment transaction fails during checkout.
```json
{
  "type": "booking",
  "timestamp": "2026-06-21T21:00:00.000Z",
  "data": {
    "event": "payment_failed",
    "razorpayPaymentId": "pay_failed_xxxxx",
    "razorpayOrderId": "order_OkD1J9s20hSla9",
    "amount": 1800,
    "status": "failed"
  }
}
```

---

## 3. Recommended N8N Workflow Nodes

To automate the business logic for payments, we recommend setting up the following nodes in your `QKrKA8oXiY06dYBT` workflow:

### Step 3a: Router / Switch Node
Filter the incoming events based on `{{ $json.data.event }}`.
*   Route 1: `payment_captured`
*   Route 2: `payment_failed`

### Step 3b: Database Sync (Supabase Node)
For `payment_captured` events:
1.  **Insert Payment Record**:
    *   **Table:** `payments`
    *   **Fields to Write:**
        *   `razorpay_order_id`: `{{ $json.data.razorpayOrderId }}`
        *   `razorpay_payment_id`: `{{ $json.data.razorpayPaymentId }}`
        *   `amount`: `{{ $json.data.amount }}`
        *   `status`: `"captured"`
        *   `vendor_amount`: `{{ $json.data.amount * 0.9 }}` (90% Vendor payout)
        *   `brideora_commission`: `{{ $json.data.amount * 0.1 }}` (10% Brideora Commission)
2.  **Create / Update Booking**:
    *   **Table:** `bookings`
    *   **Action:** Upsert / Update
    *   **Fields to Write:**
        *   `status`: `"confirmed"`
        *   `payment_status`: `"completed"`
        *   `razorpay_order_id`: `{{ $json.data.razorpayOrderId }}`
        *   `razorpay_payment_id`: `{{ $json.data.razorpayPaymentId }}`

### Step 3c: Communications (Gmail / SMTP Node)
*   **Send email to customer (`{{ $json.data.userEmail }}`)**:
    *   **Subject:** "Your Brideora Booking is Confirmed! 💖"
    *   **Body:** "Hi {{ $json.data.userName }}, your payment of ₹{{ $json.data.amount }} has been verified. Artist: {{ $json.data.serviceName }}. Thank you for booking with Brideora!"
*   **Send WhatsApp message (via WhatsApp node)**:
    *   Notify the artist that a new booking has been confirmed for their calendar on `{{ $json.data.bookingDate }}`.
