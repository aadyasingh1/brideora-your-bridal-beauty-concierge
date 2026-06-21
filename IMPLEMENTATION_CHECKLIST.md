# 🚀 Brideora Backend Setup - Implementation Checklist

## Phase 1: Environment Setup ✅ (5 minutes)

- [ ] **1.1** Copy `.env.local.example` to `.env.local`
  ```bash
  cp .env.local.example .env.local
  ```

- [ ] **1.2** Sign up for services (if not already done):
  - [ ] Supabase: https://supabase.com → Create project
  - [ ] Razorpay: https://razorpay.com → Get API keys
  - [ ] Gemini API: https://ai.google.dev → Create API key
  - [ ] Gmail: Generate app password at myaccount.google.com/apppasswords
  - [ ] WhatsApp Business: https://business.facebook.com
  - [ ] (Optional) Twilio: https://twilio.com

- [ ] **1.3** Fill in `.env.local` with your actual credentials

- [ ] **1.4** Verify file is NOT in git
  ```bash
  # Should be in .gitignore
  cat .gitignore | grep env.local
  ```

---

## Phase 2: Database Setup ✅ (10 minutes)

- [ ] **2.1** Open Supabase Dashboard
  ```
  Go to: https://supabase.com/dashboard
  ```

- [ ] **2.2** Select your project

- [ ] **2.3** Go to SQL Editor → New Query

- [ ] **2.4** Copy entire `DATABASE_SCHEMA.sql` and paste

- [ ] **2.5** Execute (click Run button)
  - Wait for completion (should complete in 10 seconds)
  - Verify all 13 tables created:
    ```sql
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' ORDER BY table_name;
    ```

- [ ] **2.6** Verify indexes created
  ```sql
  SELECT indexname FROM pg_indexes 
  WHERE schemaname = 'public' ORDER BY indexname;
  ```

---

## Phase 3: Supabase Configuration ✅ (5 minutes)

- [ ] **3.1** Get Supabase credentials:
  - Go to Settings → API
  - Copy your Project URL → `.env.local` SUPABASE_URL
  - Copy Anon Key → `.env.local` SUPABASE_ANON_KEY
  - Copy Service Role Key → `.env.local` SUPABASE_SERVICE_KEY

- [ ] **3.2** Configure Supabase connection in code
  - Already configured in `src/lib/supabase-utils.ts`
  - Test connection: Run dev server and check console

- [ ] **3.3** Enable Row Level Security (optional but recommended)
  ```sql
  -- Enable RLS on all tables for security
  ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
  ALTER TABLE users ENABLE ROW LEVEL SECURITY;
  ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
  -- ... repeat for all tables
  ```

---

## Phase 4: Razorpay Setup ✅ (5 minutes)

- [ ] **4.1** Get Razorpay credentials:
  - Go to https://dashboard.razorpay.com/app/settings/api-keys
  - Copy Key ID → `.env.local` RAZORPAY_KEY_ID
  - Copy Key Secret → `.env.local` RAZORPAY_KEY_SECRET

- [ ] **4.2** Create Razorpay Webhook:
  - Go to Settings → Webhooks
  - Add New Webhook
  - Webhook URL: `https://your-domain.com/api/webhooks/razorpay`
  - Select events:
    - `payment.authorized`
    - `payment.captured`
    - `payment.failed`
    - `payment.refunded`
  - Copy Webhook Secret → `.env.local` RAZORPAY_WEBHOOK_SECRET

- [ ] **4.3** Test Razorpay connection (Phase 5)

---

## Phase 5: API Testing ✅ (15 minutes)

- [ ] **5.1** Start development server
  ```bash
  npm run dev
  ```
  Should see: `VITE v8.0.16 ready in 1265 ms`

- [ ] **5.2** Test vendor registration endpoint
  ```bash
  curl -X POST http://localhost:8080/api/vendors/register \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Test Makeup Artist",
      "email": "test.vendor@example.com",
      "phone": "919876543210",
      "category": "makeup",
      "location": "Delhi",
      "panNumber": "ABCDE1234F",
      "bankAccount": "1234567890123456",
      "yearsExperience": 5
    }'
  ```
  Expected response: `{"success": true, "message": "Vendor registration submitted..."}`

- [ ] **5.3** Test AI recommendations endpoint
  ```bash
  curl -X POST http://localhost:8080/api/ai/recommendations \
    -H "Content-Type: application/json" \
    -d '{
      "userId": "test-user-1",
      "requirements": "Looking for professional makeup artist for wedding",
      "eventType": "wedding",
      "eventDate": "2026-07-15",
      "budgetMin": 20000,
      "budgetMax": 50000,
      "location": "Delhi",
      "userEmail": "customer@example.com"
    }'
  ```

- [ ] **5.4** Test booking creation
  ```bash
  curl -X POST http://localhost:8080/api/bookings/create \
    -H "Content-Type: application/json" \
    -d '{
      "vendorId": "vendor-uuid",
      "userId": "user-uuid",
      "serviceName": "Bridal Makeup",
      "bookingDate": "2026-07-15T09:00:00Z",
      "amount": 25000,
      "userEmail": "customer@example.com",
      "userName": "Jane Doe"
    }'
  ```

- [ ] **5.5** Test review submission
  ```bash
  curl -X POST http://localhost:8080/api/reviews/submit \
    -H "Content-Type: application/json" \
    -d '{
      "bookingId": "booking-uuid",
      "vendorId": "vendor-uuid",
      "userId": "user-uuid",
      "rating": 5,
      "text": "Excellent service!",
      "userEmail": "customer@example.com",
      "vendorEmail": "vendor@example.com"
    }'
  ```

---

## Phase 6: N8N Workflow Setup ✅ (2-3 hours)

Follow `N8N_COMPLETE_SETUP.md` to create 12 workflows:

- [ ] **6.1** Workflow 1: Vendor Registration & Approval
- [ ] **6.2** Workflow 2: Booking Management
- [ ] **6.3** Workflow 3: Payment Processing (Razorpay)
- [ ] **6.4** Workflow 4: Featured Listings
- [ ] **6.5** Workflow 5: Premium Subscriptions
- [ ] **6.6** Workflow 6: Vendor Payouts
- [ ] **6.7** Workflow 7: AI Recommendations
- [ ] **6.8** Workflow 8: Review Collection
- [ ] **6.9** Workflow 9: Notifications
- [ ] **6.10** Workflow 10: Analytics
- [ ] **6.11** Workflow 11: Fraud Detection
- [ ] **6.12** Workflow 12: Demand Capture

For each workflow:
- [ ] Read detailed instructions in `N8N_COMPLETE_SETUP.md`
- [ ] Create new workflow in n8n
- [ ] Add webhook trigger node
- [ ] Configure nodes (Supabase, SMTP, WhatsApp, etc.)
- [ ] Set up error handling
- [ ] Save and activate
- [ ] Test with sample data

---

## Phase 7: Integration Testing ✅ (30 minutes)

- [ ] **7.1** Test complete vendor flow:
  - Register vendor
  - Admin approves
  - Vendor receives approval email
  - Verify in Supabase vendors table

- [ ] **7.2** Test booking flow:
  - Customer creates booking
  - Check availability logic
  - Vendor receives notification
  - Vendor confirms
  - Booking confirmed status

- [ ] **7.3** Test payment flow:
  - Create booking with payment
  - Simulate Razorpay webhook
  - Verify payment recorded
  - Check vendor payout calculated

- [ ] **7.4** Test AI recommendations:
  - Send requirements via API
  - Verify Gemini API called
  - Check vendors recommended
  - Verify stored in database

- [ ] **7.5** Check all logs:
  - Server console for errors
  - N8N execution logs
  - Supabase logs

---

## Phase 8: Monitoring Setup ✅ (10 minutes)

- [ ] **8.1** Set up monitoring:
  - [ ] N8N error notifications
  - [ ] API error logging
  - [ ] Database backups enabled

- [ ] **8.2** Create admin dashboard:
  - [ ] Check daily analytics
  - [ ] Monitor vendor payouts
  - [ ] Review fraud flags

- [ ] **8.3** Configure alerts:
  - [ ] Webhook failures
  - [ ] Payment processing errors
  - [ ] High fraud scores

---

## Phase 9: Go-Live Checklist ✅ (30 minutes)

- [ ] **9.1** Security review:
  - [ ] All API keys in env variables (not in code)
  - [ ] HTTPS enabled
  - [ ] CORS configured
  - [ ] Rate limiting active

- [ ] **9.2** Performance check:
  - [ ] API response time < 200ms
  - [ ] Database queries optimized
  - [ ] Caching configured

- [ ] **9.3** Data verification:
  - [ ] Backups working
  - [ ] Row Level Security enabled
  - [ ] No test data in production

- [ ] **9.4** Documentation:
  - [ ] All endpoints documented
  - [ ] Error codes documented
  - [ ] Runbook created

- [ ] **9.5** Deploy:
  - [ ] Build production version: `npm run build`
  - [ ] Test build locally
  - [ ] Deploy to production server

---

## Phase 10: Post-Launch (Daily)

- [ ] **10.1** Daily checks:
  - [ ] Check analytics for GMV
  - [ ] Monitor error rates
  - [ ] Review fraud flags

- [ ] **10.2** Weekly:
  - [ ] Analyze user behavior
  - [ ] Check payout status
  - [ ] Review subscription renewals

- [ ] **10.3** Monthly:
  - [ ] Full system audit
  - [ ] Update dependencies
  - [ ] Review and optimize costs

---

## Time Estimates

| Phase | Tasks | Estimated Time |
|-------|-------|-----------------|
| 1 | Environment | 5 minutes |
| 2 | Database | 10 minutes |
| 3 | Supabase Config | 5 minutes |
| 4 | Razorpay Setup | 5 minutes |
| 5 | API Testing | 15 minutes |
| 6 | N8N Workflows | 2-3 hours |
| 7 | Integration Testing | 30 minutes |
| 8 | Monitoring | 10 minutes |
| 9 | Go-Live | 30 minutes |
| **TOTAL** | | **~4-5 hours** |

---

## Quick Command Reference

```bash
# Start development
npm run dev

# Build for production
npm run build

# Run tests (when ready)
npm run test

# Check for errors
npm run lint

# Format code
npm run format

# Create Supabase backup
supabase db pull

# View N8N workflows
# https://aaadyasingh1.app.n8n.cloud/
```

---

## Support

- **Stuck?** → Check `BACKEND_INTEGRATION_GUIDE.md`
- **N8N help** → See `N8N_COMPLETE_SETUP.md`
- **Quick tips** → See `QUICK_REFERENCE.md`
- **Need examples?** → Check API route files in `src/routes/api/`

---

## ✅ When Complete

You'll have:
- ✅ Complete database with all tables
- ✅ 9 working API endpoints
- ✅ 12 automated N8N workflows
- ✅ Payment processing with Razorpay
- ✅ Email/WhatsApp notifications
- ✅ AI-powered recommendations
- ✅ Analytics and fraud detection
- ✅ Production-ready backend

**Estimated Revenue per Month:**
- Commission: ₹50K+ (assuming ₹500K GMV)
- Subscriptions: ₹20K+ (40 active vendors)
- Featured: ₹30K+ (6 featured vendors)
- **Total: ₹100K+ monthly**

Let's go! 🚀
