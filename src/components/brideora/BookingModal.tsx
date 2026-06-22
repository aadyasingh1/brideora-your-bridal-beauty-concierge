import { useState } from "react";
import { X, Calendar, User, Mail, Sparkles, CheckCircle2, CreditCard } from "lucide-react";
import { toast } from "sonner";

interface Vendor {
  name: string;
  speciality: string;
  price: string;
  location: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: Vendor;
}

export function BookingModal({ isOpen, onClose, vendor }: BookingModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [service, setService] = useState("Bridal Makeup Package");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{
    paymentId: string;
    orderId: string;
  } | null>(null);

  if (!isOpen) return null;

  // Clean numerical amount (e.g. "₹18,000" -> 18000)
  const basePrice = parseInt(vendor.price.replace(/[^\d]/g, ""), 10) || 15000;
  // Calculate 10% booking advance deposit
  const depositAmount = Math.round(basePrice * 0.1);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !date) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Create order on the server
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: depositAmount,
          currency: "INR",
          receipt: `rcpt_bk_${Date.now()}`,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        throw new Error(orderData.error || "Failed to create payment order");
      }

      // 2. Initialize Razorpay Checkout
      const keyId = "rzp_test_T4KODs1lPUhMSJ"; // From user request

      const options = {
        key: keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Brideora",
        description: `Deposit for ${vendor.name} - ${service}`,
        order_id: orderData.orderId,
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          setIsLoading(true);
          try {
            // 3. Verify payment signature on the server
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                bookingData: {
                  vendorId: "00000000-0000-0000-0000-000000000000", // Placeholder UUID for testing
                  serviceName: service,
                  bookingDate: new Date(date).toISOString(),
                  amount: basePrice,
                  userEmail: email,
                  userName: name,
                  notes: notes,
                },
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setPaymentDetails({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
              });
              setIsSuccess(true);
              toast.success("Payment verified! Your booking is complete.");
            } else {
              throw new Error(verifyData.error || "Payment verification failed.");
            }
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Error confirming payment");
          } finally {
            setIsLoading(false);
          }
        },
        prefill: {
          name: name,
          email: email,
        },
        theme: {
          color: "#A30D1B", // Primary deep red logo color
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        toast.error(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to initiate payment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-[2.5rem] bg-pearl border border-gold/20 p-8 shadow-luxe animate-in fade-in zoom-in-95 duration-300">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 rounded-full p-2 text-muted-foreground hover:bg-rose hover:text-foreground transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8">
            <div className="mx-auto h-16 w-16 rounded-full bg-success/15 flex items-center justify-center mb-6">
              <CheckCircle2 className="h-10 w-10 text-success" />
            </div>
            <h3 className="font-display text-3xl text-foreground mb-3">Booking Confirmed!</h3>
            <p className="text-sm font-serif text-muted-foreground max-w-sm mx-auto mb-6">
              Thank you, {name}! Your deposit of ₹{depositAmount.toLocaleString()} has been paid and your request was sent to {vendor.name}.
            </p>
            <div className="rounded-2xl bg-ivory border border-border p-4 text-left text-xs space-y-2 mb-6">
              <div><span className="font-semibold">Artist:</span> {vendor.name}</div>
              <div><span className="font-semibold">Service:</span> {service}</div>
              <div><span className="font-semibold">Date:</span> {new Date(date).toLocaleString()}</div>
              <div><span className="font-semibold">Payment ID:</span> {paymentDetails?.paymentId}</div>
              <div><span className="font-semibold">Order ID:</span> {paymentDetails?.orderId}</div>
            </div>
            <button
              onClick={onClose}
              className="w-full rounded-full bg-gradient-royal py-3.5 text-sm font-semibold text-pearl hover:shadow-luxe transition-all"
            >
              Back to Directory
            </button>
          </div>
        ) : (
          <div>
            <div className="divider-ornament text-[10px] uppercase tracking-[0.25em] text-gold-soft mb-2">
              Secured Booking
            </div>
            <h3 className="font-display text-3xl text-foreground mb-1">Book {vendor.name}</h3>
            <p className="text-sm text-muted-foreground mb-6 font-serif">
              Fill in your event details to initialize the reservation.
            </p>

            <form onSubmit={handlePayment} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Name</label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3.5 h-4 w-4 text-muted-foreground/60" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full rounded-2xl border border-border bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Email</label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3.5 h-4 w-4 text-muted-foreground/60" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full rounded-2xl border border-border bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Service Selection */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Service Type</label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-primary transition-all"
                >
                  <option value="Bridal Makeup Package">Bridal Makeup Package (₹{basePrice.toLocaleString()})</option>
                  <option value="Sangeet/Engagement Makeup">Engagement Makeup (₹{Math.round(basePrice * 0.7).toLocaleString()})</option>
                  <option value="Party Makeup">Party Makeup (₹{Math.round(basePrice * 0.4).toLocaleString()})</option>
                </select>
              </div>

              {/* Date */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Date & Time</label>
                <div className="relative flex items-center">
                  <Calendar className="absolute left-3.5 h-4 w-4 text-muted-foreground/60" />
                  <input
                    type="datetime-local"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-2xl border border-border bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Notes for Artist (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Specify venue details, skin type or styling preferences..."
                  rows={2}
                  className="w-full rounded-2xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-primary transition-all resize-none"
                />
              </div>

              {/* Payment Summary */}
              <div className="rounded-2xl bg-ivory border border-gold/10 p-4 space-y-2 mt-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Package total:</span>
                  <span>₹{basePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-primary font-semibold">
                  <span>Advance Deposit (10%):</span>
                  <span>₹{depositAmount.toLocaleString()}</span>
                </div>
                <div className="text-[10px] text-muted-foreground border-t border-border pt-2 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-gold-soft" />
                  Secure verification by Razorpay sandbox.
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full bg-gradient-royal py-3.5 text-sm font-semibold text-pearl shadow-soft hover:shadow-luxe transition-all flex items-center justify-center gap-2 disabled:opacity-75"
              >
                <CreditCard className="h-4 w-4" />
                {isLoading ? "Initiating Checkout..." : `Pay Deposit (₹${depositAmount.toLocaleString()})`}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
