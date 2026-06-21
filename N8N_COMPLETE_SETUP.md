# N8N Complete Backend Automation Setup for Brideora

## Overview
This document provides comprehensive instructions for setting up all 12 backend automation workflows in n8n for the Brideora platform.

**n8n Instance:** https://aaadyasingh1.app.n8n.cloud/

---

## Table of Contents
1. [Database Setup](#database-setup)
2. [Environment Variables](#environment-variables)
3. [Workflow Templates](#workflow-templates)
4. [Webhook Configuration](#webhook-configuration)
5. [Database Triggers](#database-triggers)
6. [Monitoring & Debugging](#monitoring--debugging)

---

## Database Setup

### 1. Create Supabase Tables
Run the SQL in `DATABASE_SCHEMA.sql` in your Supabase dashboard:
- Go to **SQL Editor** → **New Query**
- Copy and paste the entire `DATABASE_SCHEMA.sql` content
- Execute

This creates all 13 tables with proper indexing and triggers.

### 2. Configure Supabase Connection in n8n
1. In n8n, add a new **Supabase** node
2. Create credentials:
   - **Supabase URL:** Your Supabase project URL
   - **Supabase API Key:** Your service_role key (from Settings → API)
3. Save and test connection

---

## Environment Variables

### Required Variables
Create `.env.local` in your project root:

```env
# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_role_key

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Email (Gmail/SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# WhatsApp Business API
WHATSAPP_API_URL=your_whatsapp_api_url
WHATSAPP_API_TOKEN=your_whatsapp_api_token
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_FROM_NUMBER=your_twilio_number

# N8N
N8N_WEBHOOK_BASE_URL=https://aaadyasingh1.app.n8n.cloud/webhook
N8N_WORKFLOW_ID=your_workflow_id
```

---

## Workflow Templates

### Workflow 1: Vendor Registration & Approval

**Trigger:** HTTP POST to `/api/vendors/register`

**Steps:**
1. **Webhook Trigger** - Receives vendor registration data
2. **Extract Data** - Parse vendor information
3. **Validate** - Check required fields
4. **Store in Supabase** - Create vendor record with status: "pending"
5. **Send Admin Email** - Notify admin for approval
   - Template: `emailTemplates.vendorSubmitted`
   - To: admin@brideora.com
   - Contains: Vendor name, category, experience, location
6. **Send Vendor Email** - Confirm receipt
   - Template: "We received your application. Approval within 24 hours"
7. **Log Event** - Store workflow execution log

**Return:** Success message with vendor ID

**Error Handling:**
- Catch duplicate emails → Return error
- Catch validation errors → Return specific field errors
- Log all errors to Supabase logs table

---

### Workflow 2: Vendor Approval (Admin Action)

**Trigger:** HTTP POST or Supabase admin action

**Steps:**
1. **Update Vendor Status** - Set status to "approved" in Supabase
2. **Generate Credentials** - Create dashboard login credentials
3. **Send Approval Email**
   - Template: `emailTemplates.vendorApproved`
   - Include: Login link, welcome guide, next steps
4. **Send WhatsApp** - Quick confirmation message
   - Template: `whatsappTemplates.vendorApproved`
5. **Create Vendor Profile** - Initialize dashboard data
6. **Trigger Welcome Series** - Queue onboarding emails

**Return:** Confirmation that vendor is now active

---

### Workflow 3: Booking Management

**Trigger:** HTTP POST to `/api/bookings/create`

**Steps:**

#### 3a. Check Vendor Availability
1. **Query Bookings** - Get all bookings for vendor on booking date
2. **Check Conflicts** - Ensure no overlapping bookings
3. **If Conflict** → Return error, suggest alternative dates
4. **If Available** → Continue to 3b

#### 3b. Create Booking
1. **Store Booking** - Create record in `bookings` table with status: "pending"
2. **Hold Booking** - Lock vendor slot for 10 minutes
3. **Send Booking Confirmation Email**
   - To: Customer
   - Include: Vendor details, booking date, amount, payment link
4. **Send Booking Notification Email**
   - To: Vendor
   - Include: Customer name, date, service type, approval request

#### 3c. Handle Vendor Response
1. **Webhook for Vendor Action** - Accept/Reject/Negotiate
2. **If Rejected:**
   - Update booking status to "cancelled"
   - Notify customer
   - Release slot
3. **If Accepted:**
   - Update booking status to "confirmed"
   - Send payment link
   - Trigger payment workflow

#### 3d. Handle Reschedules & Cancellations
1. **On Reschedule Request:**
   - Check new date availability
   - Update booking record
   - Notify both parties
   - Adjust payment if needed
2. **On Cancellation:**
   - If before payment: Delete booking
   - If after payment: Initiate refund workflow
   - Notify vendor
   - Release slot

**Return:** Booking confirmation or error

---

### Workflow 4: Razorpay Payment Processing

**Trigger:** Razorpay Webhook (payment.captured event)

**Endpoint:** `/api/webhooks/razorpay`

**Steps:**
1. **Verify Signature** - HMAC SHA256 verification
2. **Extract Payment Data**
   - Razorpay Payment ID
   - Order ID
   - Amount
   - Status
3. **Calculate Amounts**
   - Total: Payment amount
   - Brideora Commission: 10%
   - Vendor Payout: 90%
4. **Update Booking** - Set payment_status: "completed"
5. **Store Payment** - Create record in `payments` table
6. **Send Payment Confirmation**
   - To: Customer - Receipt & booking confirmation
   - To: Vendor - Payment notification, payout scheduled in 5 days
7. **Trigger Invoice Generation** - Generate and send PDF invoice
8. **Log Transaction** - Store in analytics
9. **Update GMV** - Update daily analytics

**Error Handling:**
- Invalid signature → Log and ignore
- Duplicate payment → Check DB, prevent double processing
- Missing order → Log error, manual review

**Return:** Success to Razorpay

---

### Workflow 5: Featured Listing Activation

**Trigger:** HTTP POST to `/api/featured-listings/purchase`

**Steps:**
1. **Verify Payment** - Check razorpay_payment_id is verified
2. **Get Plan Details** - Duration and AI weight boost
3. **Activate Listing**
   - Update vendor: `featured_listing_active: true`
   - Set `featured_until: now + duration_days`
   - Apply `ai_ranking_weight` multiplier (1.2 - 2.0x)
   - Enable homepage placement
4. **Store Featured Record** - Create entry in `featured_listings` table
5. **Send Confirmation Email**
   - Template: `emailTemplates.featuredListingActive`
   - Include: Duration, visibility boost, expiry date
6. **Send WhatsApp Alert**
   - Quick message about increased visibility
7. **Update Homepage Cache** - Trigger featured vendors refresh
8. **Log Event** - Store purchase in analytics

**Return:** Confirmation with visibility details

---

### Workflow 6: Premium Subscription Management

**Trigger:** Manual purchase or automated renewal

**Plans:**
- **Premium:** ₹499/month - Basic features
- **Pro:** ₹999/month - Advanced features + support

**Steps:**

#### 6a. Subscription Activation
1. **Create Subscription** - Record in `subscriptions` table
2. **Set Expiry** - `expires_at: now + 30 days`
3. **Apply Benefits**
   - Vendor profile badge
   - Priority support
   - Analytics dashboard
   - Pro: Monthly reports + dedicated manager
4. **Send Welcome Email**
   - Template: Plan-specific features
   - Include: Renewal date, cancellation info

#### 6b. Daily Expiry Check (Scheduled Task)
1. **Query Subscriptions** - Find expiring soon (7 days, 1 day, today)
2. **For Each Expiring:**
   - Send reminder email
   - 1 day before: Final reminder + renewal link
   - On expiry: Deactivate benefits, send notice
3. **For Auto-Renewal:**
   - Attempt payment with stored card
   - On success: Extend expiry, send confirmation
   - On failure: Send retry instructions

#### 6c. Subscription Cancellation
1. **Manual Cancellation:**
   - Update status to "cancelled"
   - Set cancelled_at timestamp
   - Stop charging
   - Send farewell email
2. **Failed Renewal:**
   - Notify vendor
   - Offer payment retry
   - Option to downgrade

**Return:** Subscription status

---

### Workflow 7: Vendor Payout Workflow

**Trigger:** HTTP POST to `/api/payouts/calculate` or Scheduled (Weekly/Monthly)

**Steps:**

#### 7a. Calculate Payouts
1. **Query Completed Bookings**
   - Filter: vendor_id, status: "completed", payment_status: "completed"
   - Within period: Last 7/30 days
2. **Sum Vendor Amounts** - Total from all completed bookings
3. **Deduct Credits** - If vendor used credits/balance
4. **Create Payout Record**
   - Status: "pending"
   - Store booking IDs included
   - Amount ready for withdrawal

#### 7b. Approve & Process
1. **Admin Review** - Display pending payouts
2. **On Approval:**
   - Update status: "approved"
   - Store approval timestamp
   - Send vendor notification
3. **Process Payout:**
   - Via bank transfer or UPI
   - Track transaction ID
   - Update status: "completed"
   - Send receipt to vendor

#### 7c. Generate Reports
1. **Payout Report:**
   - Vendor name, amount, period, method
   - Transaction ID, completion date
2. **Send Email:**
   - To: Vendor - Payout receipt
   - To: Admin - Daily/Weekly summary
   - To: Founder - GMV report

**Return:** Payout calculation summary

---

### Workflow 8: AI Concierge Recommendations

**Trigger:** HTTP POST to `/api/ai/recommendations`

**Steps:**
1. **Receive Requirements**
   - Event type, date, location, budget, preferences
2. **Query Gemini AI**
   - Prompt: "Based on [requirements], recommend the top 5 vendors"
   - Include: Vendor ratings, reviews, prices
3. **Format Response**
   - List top vendors with match percentages
   - Include: Vendor photos, reviews, pricing
4. **Store Conversation** - Save in `ai_conversations` table
5. **Send Recommendations Email**
   - Template: Rich HTML with vendor cards
   - Include: Direct inquiry links
6. **Track Usage** - Log for analytics

**Gemini API Integration:**
```json
{
  "prompt": "I'm looking for [service_type] for my [event_type] on [date]. Budget: ₹[budget]. Requirements: [requirements]. Recommend vendors. Consider ratings, reviews, and availability.",
  "model": "gemini-pro",
  "max_tokens": 1000
}
```

**Return:** List of recommended vendors with details

---

### Workflow 9: Review Collection & Management

**Trigger:** 24 hours after booking completion

**Steps:**

#### 9a. Trigger Review Request
1. **Query Completed Bookings** - Status: "completed", from 24-25 hours ago
2. **Send Review Request Email**
   - Template: `emailTemplates.reviewRequest`
   - Include: Service details, direct review link
   - CTA: "Share your experience"
3. **Send WhatsApp Reminder** (24 hours later)
   - Template: `whatsappTemplates.reviewRequest`
   - Include: 1-tap review link

#### 9b. Process Submitted Review
1. **Receive Review** - Via `/api/reviews/submit`
2. **Moderate**
   - Check for profanity
   - Detect fake reviews (AI analysis)
   - Verify customer legitimacy
3. **Approve/Reject**
   - If approved: Publish and update vendor rating
   - If rejected: Notify customer, offer feedback
4. **Update Vendor Rating**
   - Recalculate average from all reviews
   - Update in vendor profile
   - Boost visibility if highly rated

#### 9c. Fraud Detection
1. **Analyze Review**
   - Check language patterns
   - Compare to other reviews from customer
   - Check timestamp patterns
2. **If Suspicious:**
   - Flag for manual review
   - Don't publish immediately
   - Notify moderator

**Return:** Review confirmation

---

### Workflow 10: Notifications System

**Trigger:** Various events (bookings, payments, reminders, etc.)

**Channels:** Email, WhatsApp, SMS, In-App

**Steps:**

#### 10a. Email Notifications
1. **Receive Notification Request**
2. **Select Template** - Based on event type
3. **Render HTML** - Personalize with data
4. **Send via SMTP**
   - Host: smtp.gmail.com
   - Auth: App password
   - Track delivery
5. **Log Event** - Store in notifications table

#### 10b. WhatsApp Notifications
1. **Verify Phone** - Valid format
2. **Select Template** - WhatsApp Business template
3. **Send via API**
   - Use WhatsApp Business API
   - Include: Message, buttons (if needed)
4. **Track Delivery** - Webhook callback
5. **Log Event**

#### 10c. SMS Notifications
1. **Verify Phone** - Valid Indian number
2. **Send via Twilio**
   - Content: Short, actionable
3. **Track Delivery**
4. **Log Event**

#### 10d. In-App Notifications
1. **Create Notification** - Store in database
2. **Trigger Real-time Update** - Via WebSocket/Polling
3. **Mark Read** - When user views
4. **Track Engagement**

**Notification Types Configured:**
- Booking created/confirmed/cancelled
- Payment received/failed/refunded
- Review request
- Subscription reminder
- Payout ready
- Featured listing expiry
- Admin alerts

**Return:** Notification ID and delivery status

---

### Workflow 11: Founder Analytics Dashboard

**Trigger:** Scheduled Daily at 11:59 PM IST

**Steps:**
1. **Calculate Daily Metrics**
   - GMV: Sum of all payments captured today
   - Commission Revenue: 10% of GMV
   - Subscription Revenue: Sum of active subscriptions
   - Featured Listing Revenue: Revenue from featured purchases
   - Transactions: Count of completed payments

2. **User Metrics**
   - Active Vendors: Count with bookings today
   - Active Users: Count with bookings today
   - New Vendors: Approved today
   - New Users: Registered today

3. **Conversion Metrics**
   - Bookings Completed: Total completed
   - Conversion Rate: Completed / Inquiries * 100

4. **Store in Analytics Table**
   - Date-wise records for trending

5. **Generate Report**
   - Format: JSON + PDF
   - Send to founder email
   - Store in analytics dashboard

6. **Weekly/Monthly Reports**
   - Every Monday at 6 AM: Weekly summary
   - 1st of month at 6 AM: Monthly detailed report

**Report Includes:**
```
Daily Metrics:
- GMV: ₹X
- Commission Revenue: ₹Y
- Bookings: N
- Active Users: M
- Conversion Rate: P%

Trends:
- GMV Growth: +/- %
- Booking Growth: +/- %
- Revenue Growth: +/- %
```

**Return:** Report stored and sent

---

### Workflow 12: Fraud Detection & Prevention

**Trigger:** Continuous monitoring

**Components:**

#### 12a. Fake Review Detection
1. **On Review Submission:**
   - Language analysis
   - Sentiment consistency
   - Compare to user's other reviews
   - Check review timing (too quick?)
2. **If Suspicious:**
   - Flag in database
   - Require manual approval
   - Notify admin

#### 12b. Duplicate Account Detection
1. **On New Vendor Signup:**
   - Check email variations
   - Check phone number
   - Check bank account
   - Check PAN number
2. **If Match Found:**
   - Flag account
   - Require verification
   - Merge if duplicate

#### 12c. Refund Abuse Monitoring
1. **Track Refund Patterns:**
   - Refund rate per user
   - Frequency of refunds
   - High-value refunds
2. **If Suspicious:**
   - Require admin approval
   - Hold payout
   - Investigate customer

#### 12d. Suspicious Booking Monitoring
1. **Detect Patterns:**
   - Multiple bookings with no completion
   - Bookings then immediate cancellation
   - Multiple vendors in short timeframe
2. **Actions:**
   - Flag account
   - Require verification
   - Limit activity

**Return:** Fraud flags logged in database

---

## Workflow 13 (Bonus): Demand Capture / Waitlist

**Trigger:** Search with no vendors found

**Steps:**
1. **Detect Demand Gap** - Category/Location with no vendors
2. **Store Search** - Create waitlist record
3. **Notify User**
   - Email: "We're bringing vendors to your area soon"
   - Include: Interest form
4. **Notify Admin**
   - Alert: High-demand area identified
   - Data: Category, location, number of requests
5. **Follow-up Workflow**
   - 7 days later: "Still looking for [service]?"
   - 14 days later: "We found vendors in [nearby location]"

---

## Webhook Configuration

### Setting Up Webhooks in n8n

1. **For Each Workflow:**
   - Add "Webhook" trigger node
   - Set method: POST (usually)
   - Copy webhook URL
   - Note the path (e.g., `/vendor-registration`)

2. **Full Webhook URLs:**
   ```
   https://aaadyasingh1.app.n8n.cloud/webhook/vendor-registration
   https://aaadyasingh1.app.n8n.cloud/webhook/booking-create
   https://aaadyasingh1.app.n8n.cloud/webhook/payment-webhook
   https://aaadyasingh1.app.n8n.cloud/webhook/reviews
   ...
   ```

3. **Update API Routes:**
   - Update `triggerN8NWorkflow` calls in API routes
   - Map workflow names to webhook URLs

4. **Error Handling:**
   - Retry failed webhooks 3 times
   - Implement exponential backoff
   - Log all failures for debugging

---

## Database Triggers

### Automatic Workflows via Database Changes

Supabase supports PgTrigger extensions:

1. **Vendor Status Change:**
   ```sql
   CREATE TRIGGER vendor_status_changed
   AFTER UPDATE OF status ON vendors
   FOR EACH ROW EXECUTE FUNCTION notify_n8n_webhook();
   ```

2. **Booking Completion:**
   ```sql
   CREATE TRIGGER booking_completed
   AFTER UPDATE OF status ON bookings
   WHERE NEW.status = 'completed'
   FOR EACH ROW EXECUTE FUNCTION trigger_review_workflow();
   ```

---

## Monitoring & Debugging

### 1. View Execution Logs
- **n8n Dashboard** → Click workflow → Executions
- Filter by status: Failed, Success, Running
- Click execution to see full logs

### 2. Test Webhooks
- Use Postman or curl to send test requests
- Example:
  ```bash
  curl -X POST https://aaadyasingh1.app.n8n.cloud/webhook/test \
    -H "Content-Type: application/json" \
    -d '{"test": "data"}'
  ```

### 3. Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Webhook not triggering | Wrong URL | Copy exact URL from n8n |
| Authentication failed | Invalid credentials | Verify Supabase/SMTP keys |
| Email not sending | SMTP config wrong | Check Gmail app password |
| WhatsApp rate limit | Too many messages | Implement queue, batch send |
| Signature verification failed | Wrong webhook secret | Use exact secret from Razorpay |

### 4. Health Checks
- Daily: Verify all webhooks respond
- Weekly: Check error rates
- Monthly: Review performance metrics

---

## Implementation Checklist

- [ ] Create Supabase tables (run DATABASE_SCHEMA.sql)
- [ ] Set all environment variables
- [ ] Create workflow 1: Vendor Registration
- [ ] Create workflow 2: Vendor Approval
- [ ] Create workflow 3: Booking Management
- [ ] Configure Razorpay webhook (workflow 4)
- [ ] Create workflow 5: Featured Listings
- [ ] Create workflow 6: Subscriptions
- [ ] Create workflow 7: Payouts
- [ ] Create workflow 8: AI Recommendations
- [ ] Create workflow 9: Reviews
- [ ] Create workflow 10: Notifications
- [ ] Create workflow 11: Analytics
- [ ] Create workflow 12: Fraud Detection
- [ ] Test all API endpoints
- [ ] Monitor logs for 48 hours
- [ ] Set up monitoring alerts

---

## Support & Questions

For n8n issues:
- **Documentation:** https://docs.n8n.io/
- **Community:** https://community.n8n.io/
- **Support:** https://support.n8n.io/

For Brideora integration help, check the individual API endpoint documentation in the code comments.
