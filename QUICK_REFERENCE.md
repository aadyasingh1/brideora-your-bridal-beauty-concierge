# Brideora Backend Integration - Quick Reference

## 🚀 Quick Start (5 minutes)

### 1. Database Setup
```bash
# Go to Supabase Dashboard → SQL Editor → New Query
# Paste entire DATABASE_SCHEMA.sql and execute
```

### 2. Environment Variables
```bash
# Create .env.local
SUPABASE_URL=your_url
SUPABASE_SERVICE_KEY=your_key
RAZORPAY_WEBHOOK_SECRET=your_secret
SMTP_USER=your_email
SMTP_PASS=your_app_password
GEMINI_API_KEY=your_key
```

### 3. Start Server
```bash
npm run dev
```

### 4. Test Endpoints
```bash
curl -X POST http://localhost:8080/api/vendors/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com"...}'
```

---

## 📊 Core Business Logic

### Commission Model
```
Total Booking Amount: ₹10,000
├── Brideora Commission (10%): ₹1,000
└── Vendor Payout (90%): ₹9,000
```

### Revenue Streams
- Booking commissions (10%)
- Premium subscriptions (₹499/month)
- Pro subscriptions (₹999/month)
- Featured listings (₹5,000-15,000)

### Booking Lifecycle
```
Customer Books → Vendor Confirms → Payment → Booking Completed → Review → Payout
```

---

## 🔌 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/vendors/register` | POST | Vendor signup |
| `/api/bookings/create` | POST | Create booking |
| `/api/bookings/manage` | POST | Reschedule/cancel |
| `/api/featured-listings/purchase` | POST | Boost vendor |
| `/api/ai/recommendations` | POST | Get AI recommendations |
| `/api/reviews/submit` | POST | Submit review |
| `/api/payouts/calculate` | POST | Calculate payout |
| `/api/webhooks/razorpay` | POST | Payment webhook |

---

## 📝 Common Code Patterns

### Trigger N8N Workflow
```typescript
import { triggerN8NWorkflow } from '~/lib/n8n';

const result = await triggerN8NWorkflow({
  type: 'booking',
  data: {
    event: 'booking_created',
    vendorId: 'xxx',
    amount: 25000,
    // ... more data
  }
});

if (result.success) {
  console.log('Workflow triggered:', result.data);
} else {
  console.error('Error:', result.error);
}
```

### Send Notification
```typescript
import { sendEmail, sendWhatsApp } from '~/lib/notifications';
import { emailTemplates, whatsappTemplates } from '~/lib/notifications';

// Email
await sendEmail(
  'vendor@example.com',
  emailTemplates.bookingConfirmed('John', '2026-07-15').subject,
  emailTemplates.bookingConfirmed('John', '2026-07-15').message
);

// WhatsApp
await sendWhatsApp(
  '919876543210',
  whatsappTemplates.bookingConfirmed('John', '2026-07-15')
);
```

### Database Operations
```typescript
import { 
  calculateVendorPayout,
  updateVendorRating,
  flagFraud 
} from '~/lib/supabase-utils';

// Calculate payout
const payout = await calculateVendorPayout(
  vendorId,
  new Date('2026-06-01'),
  new Date('2026-06-30')
);

// Update rating
await updateVendorRating(vendorId);

// Flag fraud
await flagFraud('fake_review', 'review', reviewId, 'high', 'Suspicious content');
```

### Verify Payment
```typescript
import { 
  verifyRazorpaySignature,
  extractPaymentDetails,
  calculateCommission
} from '~/lib/razorpay';

const isValid = verifyRazorpaySignature(
  requestBody,
  signatureHeader,
  webhookSecret
);

if (isValid) {
  const details = extractPaymentDetails(event);
  const { commission, payout } = calculateCommission(details.amount);
}
```

---

## 🔄 N8N Workflows (12 Total)

| # | Workflow | Trigger | Key Action |
|---|----------|---------|-----------|
| 1 | Vendor Registration | POST /vendors/register | Store vendor, notify admin |
| 2 | Vendor Approval | Admin action | Send approval email |
| 3 | Booking Management | POST /bookings/create | Check availability, confirm |
| 4 | Payment Processing | Razorpay webhook | Verify, calculate payout |
| 5 | Featured Listings | POST /featured-listings | Boost AI ranking |
| 6 | Subscriptions | Payment captured | Auto-renew, manage plan |
| 7 | Payouts | Scheduled weekly | Calculate & approve |
| 8 | AI Recommendations | POST /ai/recommendations | Call Gemini, return vendors |
| 9 | Reviews | 24h after booking | Send review request |
| 10 | Notifications | Various events | Email/WhatsApp/SMS |
| 11 | Analytics | Daily 11:59 PM | Calculate GMV & metrics |
| 12 | Fraud Detection | Continuous | Flag suspicious activity |

---

## 📱 Database Tables (13 Total)

```
CORE TABLES
├── vendors (vendor profiles)
├── users (customer profiles)
├── bookings (service bookings)
└── payments (payment records)

FEATURES
├── featured_listings (boost visibility)
├── subscriptions (premium plans)
├── reviews (customer feedback)
├── ai_conversations (AI history)

OPERATIONS
├── payouts (vendor earnings)
├── notifications (alert logs)
├── demand_capture (market gaps)

MONITORING
├── analytics (daily metrics)
└── fraud_flags (suspicious activity)
```

---

## 🔐 Security Checklist

- [ ] HMAC verification on all Razorpay webhooks
- [ ] Rate limiting on API endpoints
- [ ] Input validation on all requests
- [ ] SQL injection prevention (use parameterized queries)
- [ ] XSS prevention (sanitize user input)
- [ ] CORS configured correctly
- [ ] Sensitive data not logged
- [ ] API keys stored in env variables
- [ ] HTTPS enforced
- [ ] Regular security audits

---

## 📈 Metrics to Monitor

| Metric | Target | Check Daily |
|--------|--------|-------------|
| Webhook latency | < 200ms | Yes |
| Error rate | < 1% | Yes |
| Payment success rate | > 95% | Yes |
| Email delivery | > 98% | Yes |
| Booking completion | > 70% | Yes |
| Review submission rate | > 40% | Yes |
| Fraud detection accuracy | > 95% | Weekly |

---

## 🐛 Debugging Tips

### Check N8N Logs
- Dashboard → Workflows → Click workflow → Executions
- Filter by status: Failed, Success
- Click execution to see full logs

### Test Webhook
```bash
curl -X POST http://your-n8n-url/webhook/test \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### Check Supabase
- Open SQL Editor
- Run queries to verify data:
  ```sql
  SELECT * FROM bookings WHERE status = 'pending' LIMIT 10;
  SELECT * FROM payments WHERE status = 'captured' ORDER BY created_at DESC LIMIT 5;
  SELECT COUNT(*) as total_gmv, SUM(amount) as gmv FROM payments WHERE status = 'captured' AND DATE(created_at) = TODAY();
  ```

### Enable Request Logging
```typescript
// In API route
console.log('Request body:', JSON.stringify(payload, null, 2));
console.log('Response:', result);
```

---

## 📚 File Structure

```
src/
├── lib/
│   ├── n8n.ts (workflow triggers)
│   ├── razorpay.ts (payment verification)
│   ├── notifications.ts (email/SMS/WhatsApp)
│   └── supabase-utils.ts (database helpers)
├── hooks/
│   └── use-n8n.ts (React hooks)
└── routes/
    └── api/
        ├── vendors/register.tsx
        ├── bookings/
        │   ├── create.tsx
        │   └── manage.tsx
        ├── featured-listings/purchase.tsx
        ├── ai/recommendations.tsx
        ├── reviews/submit.tsx
        ├── payouts/calculate.tsx
        └── webhooks/razorpay.tsx

DOCS/
├── DATABASE_SCHEMA.sql
├── N8N_COMPLETE_SETUP.md
├── BACKEND_INTEGRATION_GUIDE.md
└── QUICK_REFERENCE.md (this file)
```

---

## 🚨 Critical Reminders

1. **Always verify Razorpay signatures** before processing payments
2. **Never log sensitive data** (API keys, payment details)
3. **Use database transactions** for multi-step operations
4. **Test on staging first** before production
5. **Monitor error rates** continuously
6. **Set up alerts** for critical failures
7. **Keep backups** of all configurations
8. **Document all changes** to workflows
9. **Review logs daily** for suspicious activity
10. **Update dependencies** regularly

---

## 🆘 Getting Help

| Issue | Solution |
|-------|----------|
| Webhook not triggering | Check URL in n8n matches API endpoint |
| Payment verification fails | Verify webhook secret matches Razorpay |
| Email not sending | Check SMTP credentials and Gmail app password |
| Database connection error | Verify Supabase URL and service key |
| AI recommendations empty | Check Gemini API key and rate limits |
| N8N workflow hangs | Check for infinite loops in n8n nodes |

---

## 📞 Quick Links

- **N8N Dashboard:** https://aaadyasingh1.app.n8n.cloud/
- **Supabase Dashboard:** https://supabase.co/dashboard
- **Razorpay Dashboard:** https://dashboard.razorpay.com/
- **Gemini API Docs:** https://ai.google.dev/docs
- **N8N Docs:** https://docs.n8n.io/

---

Last Updated: June 21, 2026
Version: 1.0
