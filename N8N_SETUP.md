# N8N Integration Guide for Brideora

## Overview
Brideora is now connected to your n8n cloud instance at `https://aaadyasingh1.app.n8n.cloud/`. This integration enables workflow automation for vendors, bookings, and notifications.

## Setup Complete ✓

The following components have been set up:

1. **N8N Library** (`src/lib/n8n.ts`)
   - Direct webhook integration with your n8n instance
   - Utility functions for common workflows

2. **API Routes**
   - `/api/n8n/trigger` - Generic workflow trigger
   - `/api/n8n/vendor-inquiry` - Send vendor inquiries
   - `/api/n8n/booking` - Send booking notifications
   - `/api/n8n/notification` - Send notifications (email, SMS, push)

3. **React Hooks** (`src/hooks/use-n8n.ts`)
   - `useN8NWorkflow()` - Generic workflow hook
   - `useVendorInquiry()` - Vendor inquiry hook
   - `useBookingNotification()` - Booking notification hook
   - `useSendNotification()` - Notification hook

## Usage Examples

### Example 1: Send Vendor Inquiry

```tsx
import { useVendorInquiry } from '~/hooks/use-n8n';

export function VendorContactForm({ vendor }) {
  const { mutate: sendInquiry, isPending } = useVendorInquiry();

  const handleSubmit = (formData) => {
    sendInquiry({
      vendorId: vendor.id,
      vendorName: vendor.name,
      category: vendor.category,
      inquiryMessage: formData.message,
      userEmail: 'customer@example.com',
      userName: 'John Doe',
    }, {
      onSuccess: (data) => {
        console.log('Inquiry sent!', data);
        // Show success message
      },
      onError: (error) => {
        console.error('Failed to send inquiry', error);
        // Show error message
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields */}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Sending...' : 'Contact Vendor'}
      </button>
    </form>
  );
}
```

### Example 2: Send Booking Notification

```tsx
import { useBookingNotification } from '~/hooks/use-n8n';

export function BookingConfirmation({ booking }) {
  const { mutate: sendBooking } = useBookingNotification();

  // Trigger after successful booking
  React.useEffect(() => {
    sendBooking({
      bookingId: booking.id,
      vendorId: booking.vendorId,
      vendorName: booking.vendor.name,
      serviceName: booking.service.name,
      bookingDate: booking.date.toISOString(),
      userEmail: booking.customer.email,
      userName: booking.customer.name,
      amount: booking.amount,
    });
  }, [booking.id]);

  return (
    <div>
      <h2>Booking Confirmed!</h2>
      <p>Details: {booking.service.name} on {booking.date.toLocaleDateString()}</p>
    </div>
  );
}
```

### Example 3: Send Notification

```tsx
import { useSendNotification } from '~/hooks/use-n8n';

export function NotificationButton() {
  const { mutate: sendNotification } = useSendNotification();

  const handleNotify = () => {
    sendNotification({
      recipient: 'user@example.com',
      subject: 'Your Brideora Booking',
      message: 'Your booking has been confirmed!',
      notificationType: 'email', // or 'sms', 'push'
    });
  };

  return <button onClick={handleNotify}>Send Notification</button>;
}
```

### Example 4: Generic Workflow Trigger

```tsx
import { useN8NWorkflow } from '~/hooks/use-n8n';

export function CustomWorkflow() {
  const { mutate: triggerWorkflow } = useN8NWorkflow();

  const handleTrigger = () => {
    triggerWorkflow({
      type: 'vendor', // or 'booking', 'notification', 'inquiry'
      data: {
        customField1: 'value1',
        customField2: 'value2',
        // Any data your n8n workflow expects
      },
    });
  };

  return <button onClick={handleTrigger}>Trigger Workflow</button>;
}
```

## API Reference

### POST /api/n8n/vendor-inquiry

Send a vendor inquiry to n8n.

**Request Body:**
```json
{
  "vendorId": "string (required)",
  "vendorName": "string (required)",
  "category": "string (required)",
  "inquiryMessage": "string (required)",
  "userEmail": "string (required)",
  "userName": "string (required)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {}
}
```

### POST /api/n8n/booking

Send a booking notification to n8n.

**Request Body:**
```json
{
  "bookingId": "string (required)",
  "vendorId": "string (required)",
  "vendorName": "string (required)",
  "serviceName": "string (required)",
  "bookingDate": "string ISO date (required)",
  "userEmail": "string (required)",
  "userName": "string (required)",
  "amount": "number (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {}
}
```

### POST /api/n8n/notification

Send a notification via n8n.

**Request Body:**
```json
{
  "recipient": "string (required)",
  "subject": "string (required)",
  "message": "string (required)",
  "notificationType": "email|sms|push (required)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {}
}
```

### POST /api/n8n/trigger

Generic workflow trigger.

**Request Body:**
```json
{
  "type": "vendor|booking|notification|inquiry (required)",
  "data": "object (required)",
  "timestamp": "string ISO date (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {}
}
```

## N8N Webhook Configuration

Your n8n workflow is triggered by webhook at:
```
https://aaadyasingh1.app.n8n.cloud/webhook/QKrKA8oXiY06dYBT
```

The webhook payload will include:
- `type`: The type of workflow (vendor, booking, notification, inquiry)
- `data`: The workflow-specific data
- `timestamp`: ISO 8601 timestamp of when the workflow was triggered

## Environment Variables (Optional)

If you want to change the n8n webhook URL or workflow ID in the future, you can update them in `src/lib/n8n.ts`:

```typescript
export const N8N_WEBHOOK_URL = "https://your-n8n-instance.com/webhook";
export const N8N_WORKFLOW_ID = "your-workflow-id";
```

## Next Steps

1. **Configure your n8n workflow** to handle the incoming webhook payloads
2. **Test the integration** by using the example components above
3. **Add error handling** as needed for your use case
4. **Monitor n8n logs** to ensure workflows are executing properly

## Troubleshooting

### Webhook not triggering?
- Check that your n8n instance is running and accessible
- Verify the workflow ID in `src/lib/n8n.ts` matches your actual workflow
- Check n8n logs for webhook activity

### CORS errors?
- N8N webhooks typically don't have CORS restrictions, but if issues occur, check your n8n settings

### Failed requests?
- Check the browser console and server logs for error details
- Verify that required fields are being sent with the request
- Check n8n workflow configuration to ensure it's expecting the correct payload structure
