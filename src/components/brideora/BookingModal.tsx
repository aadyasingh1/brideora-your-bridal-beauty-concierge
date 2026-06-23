import { useState } from "react";
import { X, Calendar, Clock, User, Mail, Sparkles, CheckCircle2, CreditCard } from "lucide-react";
import { toast } from "sonner";

interface Vendor {
  name: string;
  speciality: string;
  price: string;
  location: string;
}

const formatTime12hr = (timeStr: string) => {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(":");
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const displayHours = h % 12 || 12;
  return `${displayHours}:${minutes} ${ampm}`;
};

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: Vendor;
}

export function BookingModal({ isOpen, onClose, vendor }: BookingModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [notes, setNotes] = useState("");
  const [service, setService] = useState("Bridal Makeup Package");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{
    paymentId: string;
    orderId: string;
  } | null>(null);

  const [showStyleTransfer, setShowStyleTransfer] = useState(false);
  const [selfie, setSelfie] = useState<string | null>(null);
  const [selectedLook, setSelectedLook] = useState<string | null>(null);
  const [isTransferring, setIsTransferring] = useState(false);
  const [styleResult, setStyleResult] = useState<string | null>(null);

  const handleSelfieUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSelfie(event.target.result as string);
        setStyleResult(null);
      }
    };
    reader.readAsDataURL(file);
  };

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
      // 1. Create order on the server with full booking details
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: depositAmount,
          currency: "INR",
          receipt: `rcpt_bk_${Date.now()}`,
          bookingData: {
            vendorId: "00000000-0000-0000-0000-000000000000", // Placeholder UUID for testing
            vendorName: vendor.name,
            serviceName: service,
            bookingDate: new Date(`${date}T${time}`).toISOString(),
            amount: basePrice,
            userEmail: email,
            userName: name,
            notes: notes,
          },
        }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        throw new Error(orderData.error || "Failed to create payment order");
      }

      // 2. Perform a full page redirect via standard HTML form submission to Razorpay Hosted Checkout
      const keyId = "rzp_test_T4KODs1lPUhMSJ"; // From user request
      
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://api.razorpay.com/v1/checkout/embedded";

      const params = {
        key_id: keyId,
        order_id: orderData.orderId,
        name: "Brideora",
        description: `Deposit for ${vendor.name} - ${service}`,
        "prefill[name]": name,
        "prefill[email]": email,
        callback_url: `${window.location.origin}/api/payments/verify-redirect`,
        cancel_url: window.location.href,
      };

      for (const [key, val] of Object.entries(params)) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = val;
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to initiate payment");
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
              <div><span className="font-semibold">Date:</span> {new Date(`${date}T${time}`).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {formatTime12hr(time)}</div>
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

            {/* Try Style Transfer Trigger */}
            <div className="mb-4 rounded-2xl border border-gold/30 bg-rose-glow/5 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4.5 w-4.5 text-primary animate-pulse" />
                  <div>
                    <div className="text-xs font-bold text-foreground">Virtual Style Transfer Preview</div>
                    <div className="text-[10px] text-muted-foreground">Upload a selfie to preview {vendor.name}'s styling on your face.</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowStyleTransfer(!showStyleTransfer)}
                  className="rounded-full bg-foreground text-pearl px-4 py-1.5 text-[10px] font-bold hover:bg-primary transition-colors cursor-pointer"
                >
                  {showStyleTransfer ? "Hide Preview" : "Try AI Demo"}
                </button>
              </div>

              {showStyleTransfer && (
                <div className="mt-4 border-t border-border/60 pt-4 space-y-4 animate-in slide-in-from-top duration-300">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Selfie slot */}
                    <div className="flex flex-col items-center justify-center border border-dashed rounded-xl p-4 bg-white min-h-[140px] text-center">
                      {selfie ? (
                        <div className="relative h-28 w-28 rounded-full overflow-hidden border shadow">
                          <img
                            src={selfie}
                            alt="Selfie"
                            className="h-full w-full object-cover transition-all duration-700"
                            style={{
                              filter: isTransferring
                                ? "blur(3px)"
                                : styleResult
                                ? selectedLook === "Dewy Glass Glam"
                                  ? "saturate(1.25) brightness(1.05) contrast(1.05)"
                                  : selectedLook === "Matte Crimson Lip"
                                  ? "contrast(1.05) saturate(1.15) sepia(0.05)"
                                  : selectedLook === "Smokey Charcoal Eye"
                                  ? "contrast(1.15) brightness(0.95) saturate(0.9)"
                                  : selectedLook === "Traditional Golden Glow"
                                  ? "sepia(0.15) saturate(1.25) brightness(1.02)"
                                  : "none"
                                : "none"
                            }}
                          />
                          {styleResult && !isTransferring && (
                            <div className="absolute inset-0 bg-gold-soft/10 mix-blend-overlay animate-pulse" />
                          )}
                          <button
                            type="button"
                            onClick={() => { setSelfie(null); setStyleResult(null); }}
                            className="absolute bottom-0 right-0 h-6 w-6 bg-black/60 hover:bg-primary text-white rounded-full flex items-center justify-center text-xs cursor-pointer font-bold"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center space-y-1">
                          <span className="text-xl">👤</span>
                          <span className="text-[10px] font-bold text-primary hover:underline">Upload Selfie</span>
                          <input type="file" accept="image/*" className="hidden" onChange={handleSelfieUpload} />
                        </label>
                      )}
                    </div>

                    {/* Look Picker */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block">Select Makeup Look</span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { id: "Dewy Glass Glam", label: "Dewy Glass" },
                          { id: "Matte Crimson Lip", label: "Matte Crimson" },
                          { id: "Smokey Charcoal Eye", label: "Smokey Eye" },
                          { id: "Traditional Golden Glow", label: "Gold Glow" }
                        ].map(look => (
                          <button
                            key={look.id}
                            type="button"
                            onClick={() => { setSelectedLook(look.id); setStyleResult(null); }}
                            className={`rounded-lg p-2 text-[10px] font-semibold text-center border transition-all ${
                              selectedLook === look.id
                                ? "bg-primary border-primary text-pearl"
                                : "bg-pearl border-border/80 text-foreground/80 hover:bg-rose"
                            }`}
                          >
                            {look.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Transfer Action */}
                  {selfie && selectedLook && (
                    <div className="pt-2">
                      {isTransferring ? (
                        <div className="rounded-full bg-rose/40 text-primary py-2.5 text-[10px] font-semibold text-center flex items-center justify-center gap-1.5 animate-pulse">
                          <span className="h-3 w-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          Mapping facial dimensions & blending look...
                        </div>
                      ) : styleResult ? (
                        <div className="text-center">
                          <div className="text-[10px] text-success font-semibold mb-1 flex items-center justify-center gap-1">
                            ✓ Style transfer complete! Blended look: {selectedLook}
                          </div>
                          <button
                            type="button"
                            onClick={() => setStyleResult(null)}
                            className="text-[9px] text-primary hover:underline font-bold"
                          >
                            Reset Style Transfer
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setIsTransferring(true);
                            setTimeout(() => {
                              setIsTransferring(false);
                              setStyleResult(selfie);
                              toast.success(`Applied ${selectedLook} style transfer!`);
                            }, 1800);
                          }}
                          className="w-full rounded-full bg-foreground text-pearl py-2.5 text-[10px] font-semibold hover:bg-primary transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow"
                        >
                          <Sparkles className="h-3 w-3 text-gold-soft" /> Run Style Transfer Simulation
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

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

              <div className="grid grid-cols-2 gap-3">
                {/* Date */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Event Date</label>
                  <div className="relative flex items-center">
                    <Calendar className="absolute left-3.5 h-4 w-4 text-muted-foreground/60" />
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full rounded-2xl border border-border bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>

                {/* Time */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Start Time</label>
                  <div className="relative flex items-center">
                    <Clock className="absolute left-3.5 h-4 w-4 text-muted-foreground/60" />
                    <input
                      type="time"
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full rounded-2xl border border-border bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary transition-all"
                    />
                  </div>
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
