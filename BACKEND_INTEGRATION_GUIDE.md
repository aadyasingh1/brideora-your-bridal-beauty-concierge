# Brideora Backend Integration Documentation

## Overview

This document provides a complete overview of all backend integrations and automation workflows for the Brideora platform.

**Key Technologies:**
- **n8n** - Workflow automation
- **Supabase** - PostgreSQL database & authentication
- **Razorpay** - Payment processing
- **Google Gemini AI** - AI recommendations
- **Gmail/SMTP** - Email notifications
- **WhatsApp Business API** - WhatsApp messaging
- **Twilio** (optional) - SMS notifications

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Brideora Frontend (React)                 │
└────────────────┬────────────────────────────────────────┘
                 │ HTTP Requests
┌────────────────▼────────────────────────────────────────┐
│         Backend API Routes (/api/*)                   │
│  - /vendors/register                                   │
│  - /bookings/create                                    │
│  - /featured-listings/purchase                         │
│  - /ai/recommendations                                 │
│  - /reviews/submit                                     │
│  - /payouts/calculate                                  │
│  - /webhooks/razorpay                                  │
└────────────────┬────────────────────────────────────────┘
                 │ HTTP Webhooks
┌────────────────▼────────────────────────────────────────┐
│              N8N Workflows                             │
│  Automate business logic and integrations              │
└────────────────┬────────────────────────────────────────┘
                 │ API Calls
    ┌────────────┼────────────┬────────────────┐
    │            │            │                │
    ▼            ▼            ▼                ▼
 Supabase    Razorpay      Gmail          WhatsApp
 Database    Payments      Emails         Messages
```

---

## 1. Database Setup

### Tables Created
Run `DATABASE_SCHEMA.sql` to create these tables:

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| vendors | Vendor profiles | id, name, category, rating, status |
| users | Customer profiles | id, name, email, event_date, budget |
| bookings | Service bookings | id, vendor_id, user_id, amount, status |
| payments | Payment records | id, razorpay_payment_id, amount, status |
| featured_listings | Featured vendor placements | id, vendor_id, duration_days, status |
| subscriptions | Premium subscriptions | id, vendor_id, plan, expires_at |
| payouts | Vendor payouts | id, vendor_id, amount, status |
| reviews | Customer reviews | id, vendor_id, user_id, rating, text |
| ai_conversations | AI recommendations | id, user_id, requirements, recommendations |
| notifications | Notification logs | id, user_id, type, channel, status |
| demand_capture | Market demand gaps | id, category, location, status |
| analytics | Daily metrics | date, gmv, transactions, revenue |
| fraud_flags | Fraud detection | id, type, target_type, severity |

### Key Indexes
- Vendors by category, status, featured status
- Bookings by date, status, vendor
- Reviews by vendor, status
- Notifications by user, status
- Analytics by date

---

## 2. API Endpoints

### Authentication
All endpoints require no authentication (open for now, add auth as needed)

### Vendor Management

#### Register Vendor
```http
POST /api/vendors/register
Content-Type: application/json

{
  "name": "Makeup Artist Sarah",
  "email": "sarah@example.com",
  "phone": "91xxxxxxxxxx",
  "category": "makeup",
  "location": "Delhi",
  "panNumber": "XXXXX1234Z",
  "bankAccount": "1234567890",
  "upiId": "sarah@upi",
  "bio": "5+ years experience",
  "yearsExperience": 5,
  "gstNumber": "27XXXXX1234XXXXXX"
}

Response:
{
  "success": true,
  "message": "Vendor registration submitted. Awaiting admin approval."
}
```

### Booking Management

#### Create Booking
```http
POST /api/bookings/create
Content-Type: application/json

{
  "vendorId": "uuid",
  "userId": "uuid",
  "serviceName": "Bridal Makeup",
  "bookingDate": "2026-07-15T09:00:00Z",
  "endDate": "2026-07-15T15:00:00Z",
  "durationHours": 6,
  "amount": 25000,
  "userEmail": "customer@example.com",
  "userName": "Jane Doe",
  "notes": "Additional notes"
}

Response:
{
  "success": true,
  "message": "Booking created. Vendor confirmation pending."
}
```

### Featured Listings

#### Purchase Featured Listing
```http
POST /api/featured-listings/purchase
Content-Type: application/json

{
  "vendorId": "uuid",
  "razorpayPaymentId": "pay_xxxxx",
  "plan": "premium",
  "amount": 5000
}

Response:
{
  "success": true,
  "message": "Featured listing activated! You're now more visible to customers."
}
```

### AI Recommendations

#### Get Recommendations
```http
POST /api/ai/recommendations
Content-Type: application/json

{
  "userId": "uuid",
  "requirements": "Looking for makeup artist for wedding",
  "eventType": "wedding",
  "eventDate": "2026-07-15",
  "budgetMin": 10000,
  "budgetMax": 50000,
  "location": "Delhi",
  "preferences": ["experienced", "highly-rated"],
  "userEmail": "customer@example.com"
}

Response:
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "vendorId": "uuid",
        "name": "Vendor Name",
        "rating": 4.8,
        "matchPercentage": 95,
        "price": 25000
      }
    ]
  }
}
```

### Reviews

#### Submit Review
```http
POST /api/reviews/submit
Content-Type: application/json

{
  "bookingId": "uuid",
  "vendorId": "uuid",
  "userId": "uuid",
  "rating": 5,
  "text": "Excellent service! Highly recommended.",
  "photoUrls": ["https://..."],
  "userEmail": "customer@example.com",
  "vendorEmail": "vendor@example.com"
}

Response:
{
  "success": true,
  "message": "Review submitted and awaiting moderation"
}
```

### Payouts

#### Calculate Payout
```http
POST /api/payouts/calculate
Content-Type: application/json

{
  "vendorId": "uuid",
  "periodStart": "2026-06-01",
  "periodEnd": "2026-06-30"
}

Response:
{
  "success": true,
  "data": {
    "vendorId": "uuid",
    "amount": 45000,
    "bookingCount": 3,
    "periodStart": "2026-06-01",
    "periodEnd": "2026-06-30"
  }
}
```

#### Get Pending Payouts
```http
GET /api/payouts/calculate?vendorId=uuid

Response:
{
  "success": true,
  "data": {
    "pending": 45000,
    "approved": 30000,
    "processing": 0
  }
}
```

### Razorpay Webhook

#### Payment Webhook
```http
POST /api/webhooks/razorpay
X-Razorpay-Signature: signature

{
  "id": "evt_xxxxx",
  "entity": "event",
  "event": "payment.captured",
  "created_at": 1234567890,
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_xxxxx",
        "order_id": "order_xxxxx",
        "amount": 2500000,
        "currency": "INR",
        "status": "captured"
      }
    }
  }
}

Response:
{
  "success": true,
  "message": "Payment captured and processed"
}
```

---

## 3. N8N Workflows

### Setting Up Workflows

See `N8N_COMPLETE_SETUP.md` for detailed instructions on creating all 12 workflows:

1. **Vendor Registration & Approval** - Admin approval process
2. **Booking Management** - Check availability, confirm, reschedule
3. **Razorpay Payment Processing** - Verify signatures, calculate payouts
4. **Featured Listing Activation** - Boost vendor visibility
5. **Subscription Management** - Premium/Pro plans, auto-renewal
6. **Vendor Payouts** - Calculate, approve, transfer funds
7. **AI Recommendations** - Gemini-powered vendor matching
8. **Review Collection** - Post-booking feedback requests
9. **Notifications** - Email, WhatsApp, SMS, in-app
10. **Founder Analytics** - Daily GMV & revenue reporting
11. **Fraud Detection** - Fake reviews, suspicious activities
12. **Demand Capture** - Market gap identification

### Webhook URLs

All workflows receive webhooks at:
```
https://aaadyasingh1.app.n8n.cloud/webhook/{workflow_name}
```

Workflow names:
- `vendor-registration`
- `booking-management`
- `payment-processing`
- `featured-listings`
- `subscriptions`
- `payouts`
- `ai-recommendations`
- `reviews`
- `notifications`
- `analytics`
- `fraud-detection`
- `demand-capture`

---

## 4. Environment Variables

Create `.env.local`:

```env
# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_role_key

# Payments
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your_secret
RAZORPAY_WEBHOOK_SECRET=webhook_secret

# AI
GEMINI_API_KEY=your_gemini_api_key

# Email (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# WhatsApp
WHATSAPP_API_URL=https://api.whatsapp.com/v1
WHATSAPP_API_TOKEN=your_token
WHATSAPP_BUSINESS_ACCOUNT_ID=account_id

# SMS (optional)
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_FROM_NUMBER=+1xxxxxxx

# N8N
N8N_WEBHOOK_BASE_URL=https://aaadyasingh1.app.n8n.cloud/webhook
```

---

## 5. Utility Functions

### Razorpay Utilities (`src/lib/razorpay.ts`)

```typescript
// Verify webhook signature
verifyRazorpaySignature(body, signature, secret): boolean

// Extract payment details
extractPaymentDetails(event): PaymentDetails

// Calculate commission (10% to Brideora, 90% to vendor)
calculateCommission(amount): CommissionBreakdown

// Format for database
formatPaymentForDB(event): PaymentRecord
```

### Notifications (`src/lib/notifications.ts`)

```typescript
// Send email
sendEmail(to, subject, message)

// Send WhatsApp
sendWhatsApp(phoneNumber, message)

// Send SMS
sendSMS(phoneNumber, message)

// Send in-app notification
sendInAppNotification(userId, title, message)
```

### Supabase Utils (`src/lib/supabase-utils.ts`)

```typescript
// Track analytics
trackAnalytics(metrics)

// Calculate daily metrics
calculateDailyMetrics(date)

// Get vendor payout
calculateVendorPayout(vendorId, startDate, endDate)

// Flag fraud
flagFraud(type, targetType, targetId, severity)

// Update vendor rating
updateVendorRating(vendorId)

// Capture market demand
captureDemand(userId, category, location, eventDate, budget, details)
```

### N8N Integration (`src/lib/n8n.ts`)

```typescript
// Trigger any workflow
triggerN8NWorkflow(payload): Promise<N8NResponse>

// Send vendor inquiry
sendVendorInquiry(vendorData): Promise<N8NResponse>

// Send booking notification
sendBookingNotification(bookingData): Promise<N8NResponse>

// Send notification
sendNotification(notificationData): Promise<N8NResponse>
```

### React Hooks (`src/hooks/use-n8n.ts`)

```typescript
// Generic workflow trigger
useN8NWorkflow()

// Vendor inquiry
useVendorInquiry()

// Booking notification
useBookingNotification()

// Send notification
useSendNotification()
```

---

## 6. Business Logic Flows

### Customer Booking Flow
```
1. Customer browses vendors
2. Customer sends inquiry / requests booking
3. Vendor receives notification (email + WhatsApp)
4. Vendor confirms/rejects
5. If confirmed → Create booking, send payment link
6. Customer pays via Razorpay
7. Payment verified, booking confirmed
8. 24 hours after completion → Request review
9. Vendor receives payout (5 business days)
```

### Vendor Onboarding Flow
```
1. Vendor registers on platform
2. Documents sent to admin approval
3. Admin verifies, approves
4. Vendor receives approval email + login credentials
5. Vendor completes profile
6. Vendor can now receive bookings
```

### Premium Subscription Flow
```
1. Vendor purchases premium (₹499/month)
2. Payment processed via Razorpay
3. Subscription activated, benefits applied
4. Monthly reminder 7 days before expiry
5. Auto-renew payment attempt
6. On success → Extend subscription
7. On failure → Send payment link
```

---

## 7. Commission & Payout Model

**Commission Breakdown:**
- Brideora Commission: **10%** (per transaction)
- Vendor Payout: **90%**

**Example:**
- Booking amount: ₹10,000
- Brideora commission: ₹1,000 (10%)
- Vendor payout: ₹9,000 (90%)

**Payout Schedule:**
- Weekly: Calculate payouts from completed bookings
- Status: Pending → Approved → Processing → Completed
- Timing: 5 business days for bank transfer

**Revenue Streams:**
1. **Booking Commissions** - 10% of each booking
2. **Premium Subscriptions** - ₹499/month per vendor
3. **Pro Subscriptions** - ₹999/month per vendor
4. **Featured Listings** - ₹5,000-15,000 per 30-90 days

---

## 8. Analytics & Reporting

### Daily Analytics
Calculated at 11:59 PM IST via n8n scheduled workflow:

```json
{
  "date": "2026-06-21",
  "total_gmv": 150000,
  "commission_revenue": 15000,
  "subscription_revenue": 5000,
  "featured_revenue": 10000,
  "total_transactions": 6,
  "active_vendors": 12,
  "active_users": 18,
  "new_vendors": 1,
  "new_users": 5,
  "bookings_completed": 5,
  "conversion_rate": 45.5
}
```

### Key Metrics

| Metric | Formula | Purpose |
|--------|---------|---------|
| GMV | Total payment amount | Revenue |
| Commission | GMV × 10% | Brideora revenue |
| Conversion Rate | Completed / Inquiries × 100 | User satisfaction |
| Active Vendors | Vendors with bookings today | Platform health |
| Booking Rate | Bookings / Vendor count | Demand |

---

## 9. Security

### Payment Verification
- All Razorpay webhooks verified using HMAC SHA256
- Signature validated before processing
- Failed signatures logged and ignored

### Fraud Detection
- Review content analysis for fake reviews
- Duplicate account detection (email, phone, PAN)
- Refund abuse monitoring
- Suspicious booking patterns

### Data Protection
- All sensitive data encrypted in transit (HTTPS)
- Supabase Row Level Security (RLS) configured
- PII data handled per compliance
- Regular backups configured

---

## 10. Troubleshooting

### Common Issues

**Webhook not triggering?**
- Verify webhook URL in n8n matches API route
- Check n8n workflow is active (toggle on)
- Test webhook using curl command
- Check n8n execution logs

**Email not sending?**
- Verify SMTP credentials in .env
- Enable "Less secure app access" for Gmail (or use app password)
- Check spam folder
- Verify email template exists

**Payment verification failed?**
- Check webhook secret matches Razorpay dashboard
- Verify request body is not modified
- Check signature format

**Database connection error?**
- Verify Supabase URL and API key
- Check IP whitelist in Supabase settings
- Verify tables exist and are accessible

---

## 11. Testing Endpoints

### Using cURL

```bash
# Register vendor
curl -X POST http://localhost:8080/api/vendors/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Vendor",
    "email": "vendor@test.com",
    "phone": "9191111111",
    "category": "makeup",
    "location": "Delhi",
    "panNumber": "XXXXX1234Z",
    "bankAccount": "1234567890"
  }'

# Create booking
curl -X POST http://localhost:8080/api/bookings/create \
  -H "Content-Type: application/json" \
  -d '{
    "vendorId": "uuid",
    "userId": "uuid",
    "serviceName": "Makeup",
    "bookingDate": "2026-07-15T09:00:00Z",
    "amount": 25000,
    "userEmail": "customer@test.com",
    "userName": "Jane Doe"
  }'

# Get AI recommendations
curl -X POST http://localhost:8080/api/ai/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "uuid",
    "requirements": "Wedding makeup",
    "userEmail": "customer@test.com"
  }'
```

---

## 12. Monitoring

### Health Checks
- Daily: Verify all webhooks respond (< 200ms)
- Weekly: Check error rates (< 1%)
- Monthly: Review performance metrics

### Logs Location
- **n8n:** Dashboard → Workflows → Executions
- **Supabase:** Logs tab in dashboard
- **API:** Check server console logs

### Alerts to Configure
- Payment verification failure
- Email sending failure
- Webhook timeout (>5s)
- Database connection error
- Fraud flag detected

---

## Next Steps

1. ✅ Run `DATABASE_SCHEMA.sql` to create tables
2. ✅ Set all environment variables
3. ✅ Create n8n workflows (see `N8N_COMPLETE_SETUP.md`)
4. ✅ Configure Razorpay webhook
5. ✅ Test all API endpoints
6. ✅ Monitor logs for 48 hours
7. ✅ Go live!

---

## Support

For questions about specific integrations:
- **N8N:** See `N8N_COMPLETE_SETUP.md`
- **Razorpay:** https://razorpay.com/docs/
- **Supabase:** https://supabase.com/docs
- **Gemini API:** https://ai.google.dev/docs
- **WhatsApp API:** https://www.whatsapp.com/business/api

Good luck! 🚀
