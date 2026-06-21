/**
 * Supabase Database Utilities
 * Common functions for database operations
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Track analytics metrics
 */
export async function trackAnalytics(metrics: {
  date?: Date;
  gmv?: number;
  transactions?: number;
  commissionRevenue?: number;
  subscriptionRevenue?: number;
  featuredRevenue?: number;
  activeVendors?: number;
  activeUsers?: number;
  newVendors?: number;
  newUsers?: number;
  bookingsCompleted?: number;
  conversionRate?: number;
}) {
  try {
    const date = metrics.date || new Date();
    date.setHours(0, 0, 0, 0); // Normalize to day start

    // Check if record exists
    const { data: existing } = await supabase
      .from("analytics")
      .select("id")
      .eq("date", date.toISOString().split("T")[0])
      .single();

    if (existing) {
      // Update existing
      await supabase
        .from("analytics")
        .update({
          total_gmv: metrics.gmv || 0,
          total_transactions: metrics.transactions || 0,
          commission_revenue: metrics.commissionRevenue || 0,
          subscription_revenue: metrics.subscriptionRevenue || 0,
          featured_revenue: metrics.featuredRevenue || 0,
          active_vendors: metrics.activeVendors || 0,
          active_users: metrics.activeUsers || 0,
          new_vendors: metrics.newVendors || 0,
          new_users: metrics.newUsers || 0,
          bookings_completed: metrics.bookingsCompleted || 0,
          conversion_rate: metrics.conversionRate || 0,
        })
        .eq("date", date.toISOString().split("T")[0]);
    } else {
      // Create new
      await supabase.from("analytics").insert({
        date: date.toISOString().split("T")[0],
        total_gmv: metrics.gmv || 0,
        total_transactions: metrics.transactions || 0,
        commission_revenue: metrics.commissionRevenue || 0,
        subscription_revenue: metrics.subscriptionRevenue || 0,
        featured_revenue: metrics.featuredRevenue || 0,
        active_vendors: metrics.activeVendors || 0,
        active_users: metrics.activeUsers || 0,
        new_vendors: metrics.newVendors || 0,
        new_users: metrics.newUsers || 0,
        bookings_completed: metrics.bookingsCompleted || 0,
        conversion_rate: metrics.conversionRate || 0,
      });
    }

    console.log("Analytics tracked for", date);
  } catch (error) {
    console.error("Error tracking analytics:", error);
  }
}

/**
 * Calculate daily metrics
 */
export async function calculateDailyMetrics(date?: Date) {
  try {
    const targetDate = date || new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Total GMV from completed payments
    const { data: payments } = await supabase
      .from("payments")
      .select("amount")
      .eq("status", "captured")
      .gte("captured_at", startOfDay.toISOString())
      .lte("captured_at", endOfDay.toISOString());

    const gmv = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
    const commission = gmv * 0.1;
    const transactionCount = payments?.length || 0;

    // Active vendors (with bookings today)
    const { data: activeVendors } = await supabase
      .from("bookings")
      .select("vendor_id", { count: "exact" })
      .gte("booking_date", startOfDay.toISOString())
      .lte("booking_date", endOfDay.toISOString())
      .eq("status", "confirmed");

    const uniqueVendors = new Set(activeVendors?.map((b: any) => b.vendor_id) || [])
      .size;

    // Completed bookings
    const { data: completedBookings, count: completedCount } = await supabase
      .from("bookings")
      .select("*", { count: "exact" })
      .eq("status", "completed")
      .gte("updated_at", startOfDay.toISOString())
      .lte("updated_at", endOfDay.toISOString());

    // Track metrics
    await trackAnalytics({
      date: targetDate,
      gmv,
      commissionRevenue: commission,
      transactions: transactionCount,
      activeVendors: uniqueVendors,
      bookingsCompleted: completedCount || 0,
    });

    return {
      date: targetDate,
      gmv,
      commission,
      transactions: transactionCount,
      activeVendors: uniqueVendors,
      bookingsCompleted: completedCount,
    };
  } catch (error) {
    console.error("Error calculating daily metrics:", error);
  }
}

/**
 * Get vendor payout amount
 */
export async function calculateVendorPayout(
  vendorId: string,
  startDate: Date,
  endDate: Date
) {
  try {
    const { data: bookings } = await supabase
      .from("bookings")
      .select("vendor_payout")
      .eq("vendor_id", vendorId)
      .eq("status", "completed")
      .eq("payment_status", "completed")
      .gte("updated_at", startDate.toISOString())
      .lte("updated_at", endDate.toISOString());

    const totalPayout = bookings?.reduce(
      (sum, b) => sum + (b.vendor_payout || 0),
      0
    ) || 0;

    return totalPayout;
  } catch (error) {
    console.error("Error calculating vendor payout:", error);
    return 0;
  }
}

/**
 * Flag potential fraud
 */
export async function flagFraud(
  type: string,
  targetType: string,
  targetId: string,
  severity: "low" | "medium" | "high" = "low",
  details?: string
) {
  try {
    await supabase.from("fraud_flags").insert({
      type,
      target_type: targetType,
      target_id: targetId,
      severity,
      details,
      status: "flagged",
    });

    console.log(
      `Fraud flag created: ${type} on ${targetType} ${targetId} (${severity})`
    );
  } catch (error) {
    console.error("Error flagging fraud:", error);
  }
}

/**
 * Store notification record
 */
export async function logNotification(
  type: string,
  channel: "email" | "whatsapp" | "sms" | "in_app",
  recipient: string,
  message: string,
  status: "pending" | "sent" | "failed" = "sent"
) {
  try {
    await supabase.from("notifications").insert({
      type,
      channel,
      recipient,
      message,
      status,
    });
  } catch (error) {
    console.error("Error logging notification:", error);
  }
}

/**
 * Get booking details with vendor info
 */
export async function getBookingDetails(bookingId: string) {
  try {
    const { data } = await supabase
      .from("bookings")
      .select(
        `
        *,
        vendor:vendor_id (name, email, phone, category, rating),
        user:user_id (name, email, phone)
      `
      )
      .eq("id", bookingId)
      .single();

    return data;
  } catch (error) {
    console.error("Error getting booking details:", error);
    return null;
  }
}

/**
 * Update vendor rating
 */
export async function updateVendorRating(vendorId: string) {
  try {
    // Get all approved reviews
    const { data: reviews } = await supabase
      .from("reviews")
      .select("rating")
      .eq("vendor_id", vendorId)
      .eq("status", "approved");

    if (!reviews || reviews.length === 0) {
      return;
    }

    const avgRating =
      reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;

    await supabase
      .from("vendors")
      .update({
        rating: Math.round(avgRating * 100) / 100,
        review_count: reviews.length,
      })
      .eq("id", vendorId);

    console.log(
      `Updated vendor ${vendorId} rating: ${avgRating} from ${reviews.length} reviews`
    );
  } catch (error) {
    console.error("Error updating vendor rating:", error);
  }
}

/**
 * Create demand capture record
 */
export async function captureDemand(
  userId: string,
  category: string,
  location: string,
  eventDate?: Date,
  budget?: { min: number; max: number },
  details?: string
) {
  try {
    await supabase.from("demand_capture").insert({
      user_id: userId,
      category,
      location,
      event_date: eventDate?.toISOString().split("T")[0],
      budget_min: budget?.min,
      budget_max: budget?.max,
      details,
      status: "open",
    });

    console.log(`Demand captured: ${category} in ${location}`);
  } catch (error) {
    console.error("Error capturing demand:", error);
  }
}
