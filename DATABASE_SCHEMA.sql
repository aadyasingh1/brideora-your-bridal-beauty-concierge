/**
 * Supabase Database Schema Setup
 * 
 * Run these SQL queries in your Supabase dashboard to create the required tables
 */

-- ============================================
-- 1. VENDORS TABLE
-- ============================================
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  category TEXT NOT NULL, -- makeup, photography, catering, etc.
  bio TEXT,
  image_url TEXT,
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  location TEXT NOT NULL,
  service_area TEXT,
  years_experience INTEGER,
  
  -- Subscription & Premium
  subscription_plan TEXT, -- 'free', 'premium', 'pro'
  subscription_active_until TIMESTAMP,
  featured_listing_active BOOLEAN DEFAULT FALSE,
  featured_until TIMESTAMP,
  ai_ranking_weight DECIMAL(3, 2) DEFAULT 1.0,
  
  -- Business Details
  bank_account TEXT,
  upi_id TEXT,
  pan_number TEXT,
  gst_number TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending', -- pending, approved, rejected, suspended
  approval_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT valid_subscription CHECK (subscription_plan IN ('free', 'premium', 'pro')),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected', 'suspended'))
);

CREATE INDEX idx_vendors_category ON vendors(category);
CREATE INDEX idx_vendors_status ON vendors(status);
CREATE INDEX idx_vendors_featured ON vendors(featured_listing_active);

-- ============================================
-- 2. USERS TABLE (CUSTOMERS)
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  location TEXT,
  event_date DATE,
  budget_min DECIMAL(10, 2),
  budget_max DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. BOOKINGS TABLE
-- ============================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES vendors(id),
  user_id UUID REFERENCES users(id),
  service_name TEXT NOT NULL,
  booking_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  duration_hours INTEGER,
  amount DECIMAL(10, 2) NOT NULL,
  commission_amount DECIMAL(10, 2),
  vendor_payout DECIMAL(10, 2),
  
  -- Payment Info
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  payment_status TEXT DEFAULT 'pending', -- pending, completed, failed, refunded
  payment_date TIMESTAMP,
  
  -- Status
  status TEXT DEFAULT 'pending', -- pending, confirmed, completed, cancelled, rescheduled
  cancellation_reason TEXT,
  cancelled_at TIMESTAMP,
  
  -- Review
  review_status TEXT DEFAULT 'pending', -- pending, sent, completed
  review_date TIMESTAMP,
  rating INTEGER,
  review_text TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT valid_payment_status CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  CONSTRAINT valid_booking_status CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'rescheduled')),
  CONSTRAINT valid_rating CHECK (rating >= 1 AND rating <= 5)
);

CREATE INDEX idx_bookings_vendor ON bookings(vendor_id);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);

-- ============================================
-- 4. PAYMENTS TABLE (Razorpay)
-- ============================================
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id),
  razorpay_order_id TEXT UNIQUE NOT NULL,
  razorpay_payment_id TEXT UNIQUE,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'created', -- created, captured, failed, refunded
  
  -- Commission breakdown
  vendor_amount DECIMAL(10, 2),
  brideora_commission DECIMAL(10, 2),
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  captured_at TIMESTAMP,
  failed_at TIMESTAMP,
  refunded_at TIMESTAMP,
  
  CONSTRAINT valid_payment_status CHECK (status IN ('created', 'captured', 'failed', 'refunded'))
);

CREATE INDEX idx_payments_razorpay_order ON payments(razorpay_order_id);
CREATE INDEX idx_payments_razorpay_payment ON payments(razorpay_payment_id);

-- ============================================
-- 5. FEATURED LISTINGS TABLE
-- ============================================
CREATE TABLE featured_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES vendors(id),
  payment_id UUID REFERENCES payments(id),
  duration_days INTEGER DEFAULT 30,
  price DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'active', -- active, expired, cancelled
  activated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  
  CONSTRAINT valid_status CHECK (status IN ('active', 'expired', 'cancelled'))
);

CREATE INDEX idx_featured_vendor ON featured_listings(vendor_id);
CREATE INDEX idx_featured_active ON featured_listings(status);

-- ============================================
-- 6. SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES vendors(id),
  plan TEXT NOT NULL, -- premium, pro
  price DECIMAL(10, 2) NOT NULL,
  razorpay_subscription_id TEXT,
  razorpay_payment_id TEXT,
  status TEXT DEFAULT 'active', -- active, expired, cancelled
  activated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  auto_renew BOOLEAN DEFAULT TRUE,
  cancelled_at TIMESTAMP,
  
  CONSTRAINT valid_plan CHECK (plan IN ('premium', 'pro')),
  CONSTRAINT valid_status CHECK (status IN ('active', 'expired', 'cancelled'))
);

CREATE INDEX idx_subscriptions_vendor ON subscriptions(vendor_id);
CREATE INDEX idx_subscriptions_expires ON subscriptions(expires_at);

-- ============================================
-- 7. PAYOUTS TABLE
-- ============================================
CREATE TABLE payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES vendors(id),
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, approved, processing, completed, failed
  
  -- Bookings included
  booking_ids UUID[] DEFAULT ARRAY[]::UUID[],
  
  -- Payout method
  payout_method TEXT, -- bank, upi
  bank_account TEXT,
  upi_id TEXT,
  
  -- Timestamps
  period_start DATE,
  period_end DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP,
  processed_at TIMESTAMP,
  completed_at TIMESTAMP,
  failed_reason TEXT,
  
  CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'processing', 'completed', 'failed'))
);

CREATE INDEX idx_payouts_vendor ON payouts(vendor_id);
CREATE INDEX idx_payouts_status ON payouts(status);

-- ============================================
-- 8. AI CONVERSATIONS TABLE
-- ============================================
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  
  -- Requirements
  event_type TEXT,
  event_date DATE,
  budget_min DECIMAL(10, 2),
  budget_max DECIMAL(10, 2),
  preferences TEXT[], -- array of preferences
  requirements TEXT,
  
  -- AI Response
  ai_recommendations TEXT[], -- array of vendor IDs
  ai_response TEXT,
  gemini_prompt TEXT,
  
  -- Metadata
  viewed_recommendations BOOLEAN DEFAULT FALSE,
  bookings_made INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_conversations_user ON ai_conversations(user_id);

-- ============================================
-- 9. REVIEWS TABLE
-- ============================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id),
  vendor_id UUID REFERENCES vendors(id),
  user_id UUID REFERENCES users(id),
  rating INTEGER NOT NULL,
  text TEXT,
  photos_urls TEXT[],
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  flagged_as_fake BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP,
  
  CONSTRAINT valid_rating CHECK (rating >= 1 AND rating <= 5)
);

CREATE INDEX idx_reviews_vendor ON reviews(vendor_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_status ON reviews(status);

-- ============================================
-- 10. NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  vendor_id UUID REFERENCES vendors(id),
  type TEXT NOT NULL, -- booking_confirmation, payment_alert, review_request, etc.
  title TEXT,
  message TEXT,
  channel TEXT, -- email, whatsapp, in_app, sms
  status TEXT DEFAULT 'pending', -- pending, sent, failed, read
  
  -- Metadata
  related_booking_id UUID REFERENCES bookings(id),
  related_entity_type TEXT, -- booking, payment, subscription, etc.
  related_entity_id UUID,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  sent_at TIMESTAMP,
  read_at TIMESTAMP,
  failed_reason TEXT
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_vendor ON notifications(vendor_id);
CREATE INDEX idx_notifications_status ON notifications(status);

-- ============================================
-- 11. DEMAND CAPTURE / WAITLIST TABLE
-- ============================================
CREATE TABLE demand_capture (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  event_date DATE,
  budget_min DECIMAL(10, 2),
  budget_max DECIMAL(10, 2),
  details TEXT,
  status TEXT DEFAULT 'open', -- open, fulfilled, contacted
  contacted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_demand_category_location ON demand_capture(category, location);
CREATE INDEX idx_demand_status ON demand_capture(status);

-- ============================================
-- 12. ANALYTICS TABLE
-- ============================================
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE UNIQUE NOT NULL,
  
  -- GMV
  total_gmv DECIMAL(12, 2) DEFAULT 0,
  total_transactions INTEGER DEFAULT 0,
  
  -- Revenue
  commission_revenue DECIMAL(12, 2) DEFAULT 0,
  subscription_revenue DECIMAL(12, 2) DEFAULT 0,
  featured_revenue DECIMAL(12, 2) DEFAULT 0,
  
  -- Users
  active_vendors INTEGER DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  new_vendors INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  
  -- Conversions
  bookings_completed INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5, 2) DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 13. FRAUD FLAGS TABLE
-- ============================================
CREATE TABLE fraud_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL, -- fake_review, duplicate_account, refund_abuse, suspicious_booking
  target_type TEXT, -- vendor, user, booking, review
  target_id UUID,
  severity TEXT DEFAULT 'low', -- low, medium, high
  details TEXT,
  status TEXT DEFAULT 'flagged', -- flagged, investigating, resolved, false_positive
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  
  CONSTRAINT valid_severity CHECK (severity IN ('low', 'medium', 'high'))
);

CREATE INDEX idx_fraud_type ON fraud_flags(type);
CREATE INDEX idx_fraud_status ON fraud_flags(status);

-- ============================================
-- UPDATE TIMESTAMPS TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_conversations_updated_at BEFORE UPDATE ON ai_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VENDOR REGISTRATION TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION trigger_vendor_registration()
RETURNS TRIGGER AS $$
BEGIN
  -- This will be called when a new vendor is created
  -- n8n webhook will be triggered via HTTP function
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- BOOKING CREATION TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION trigger_booking_creation()
RETURNS TRIGGER AS $$
BEGIN
  -- This will be called when a new booking is created
  -- n8n webhook will be triggered via HTTP function
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
