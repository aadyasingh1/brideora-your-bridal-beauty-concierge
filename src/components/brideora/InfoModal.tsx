import { useState } from "react";
import { X, Mail, Phone, MapPin, Send, HelpCircle, Shield, FileText, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
}

export function InfoModal({ isOpen, onClose, type }: InfoModalProps) {
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) {
      toast.error("Please fill in all fields.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Thank you! Your inquiry has been sent to the Brideora Concierge Support Team.");
      setContactName("");
      setContactEmail("");
      setContactMessage("");
      onClose();
    }, 1000);
  };

  const getTitle = () => {
    switch (type.toLowerCase()) {
      case "privacy":
        return "Privacy Policy";
      case "terms":
        return "Terms of Service";
      case "refunds":
        return "Refund & Cancellation Policy";
      case "trust-&-safety":
      case "trust & safety":
        return "Trust & Safety";
      case "contact":
        return "Contact Support";
      case "help-centre":
      case "help centre":
        return "Help Centre / FAQs";
      case "blog":
        return "Brideora Blog";
      case "press":
        return "Press & Media Relations";
      default:
        return "Information";
    }
  };

  const renderContent = () => {
    const title = getTitle();
    switch (type.toLowerCase()) {
      case "privacy":
        return (
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed overflow-y-auto max-h-[450px] pr-2">
            <p><strong>Effective Date:</strong> June 21, 2026</p>
            <p>At Brideora, we are committed to protecting your privacy. This policy explains how we collect, use, and secure your personal details when you interact with our bridal beauty concierge platform.</p>
            
            <h4 className="font-semibold text-foreground text-base mt-4 flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-primary" /> 1. Information We Collect
            </h4>
            <p>We collect information necessary to facilitate bookings, such as your full name, email address, mobile number, event dates, locations, and service preferences. Payment transactions are processed directly by our secure partner (Razorpay), and we do not store your full card details or credentials.</p>
            
            <h4 className="font-semibold text-foreground text-base mt-4 flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-primary" /> 2. How We Use Information
            </h4>
            <p>Your details are shared strictly with the specific bridal artist or stylist you request to book. We also use your contact information to deliver booking confirmations, payment receipts, and automated support from the Brideora Concierge.</p>
            
            <h4 className="font-semibold text-foreground text-base mt-4 flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-primary" /> 3. Data Security & Storage
            </h4>
            <p>All data transmitted through Brideora is encrypted using SSL technology. We utilize modern cloud providers with strict security credentials. We do not sell or lease your personal information to third parties for marketing purposes.</p>
          </div>
        );

      case "terms":
        return (
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed overflow-y-auto max-h-[450px] pr-2">
            <p><strong>Last Updated:</strong> June 2026</p>
            <p>Welcome to Brideora. By accessing our platform or booking an artist, you agree to be bound by these terms. Please read them carefully.</p>
            
            <h4 className="font-semibold text-foreground text-base mt-4 flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-primary" /> 1. Hyperlocal Marketplace Scope
            </h4>
            <p>Brideora serves as an intermediary bridal beauty marketplace connecting brides with independent makeup artists, hair designers, and stylists. Brideora coordinates bookings, details verification, and deposits, but is not directly responsible for the execution of beauty services.</p>
            
            <h4 className="font-semibold text-foreground text-base mt-4 flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-primary" /> 2. Booking Deposits
            </h4>
            <p>Reservations require a 10% advance deposit paid securely through our checkout. This deposit acts as a commitment fee to lock in the artist's availability for your specified wedding calendar date.</p>
            
            <h4 className="font-semibold text-foreground text-base mt-4 flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-primary" /> 3. User & Artist Conduct
            </h4>
            <p>Users agree to provide accurate wedding dates and venue coordinates. Artists listed on Brideora are verified professionals and are expected to arrive punctually, equipped with premium, clean cosmetic products matching your booked specifications.</p>
          </div>
        );

      case "refunds":
        return (
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed overflow-y-auto max-h-[450px] pr-2">
            <p>We understand that wedding dates can shift. Our deposit protection ensures a balanced cancellation process for both brides and artists.</p>
            
            <h4 className="font-semibold text-foreground text-base mt-4 flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-primary" /> 1. Grace Period Cancellations
            </h4>
            <p>Cancellations made <strong>30 days or more</strong> prior to the scheduled bridal booking date are eligible for a full 100% refund of the deposit. Refunds are processed back to the original payment source within 5-7 business days.</p>
            
            <h4 className="font-semibold text-foreground text-base mt-4 flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-primary" /> 2. Short-Notice Rules
            </h4>
            <p>For cancellations made within 30 days of the booking date, the 10% deposit is non-refundable, as the artist has reserved their calendar exclusively for you and may have turned down other brides. If the artist initiates a cancellation due to unforeseen circumstances, the bride receives a 100% immediate refund, and Brideora will assist in matching an alternate elite artist.</p>
          </div>
        );

      case "trust-&-safety":
      case "trust & safety":
        return (
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed overflow-y-auto max-h-[450px] pr-2">
            <p>Your wedding is the most important day of your life. We take safety and trust very seriously, implementing strict criteria for all artists on our platform.</p>
            
            <h4 className="font-semibold text-foreground text-base mt-4 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" /> 1. Artist Vetting & Verification
            </h4>
            <p>Every artist on Brideora undergoes profile verification. We review past bridal portfolios, check product kits for authenticity (ensuring use of premium brands like MAC, NARS, Charlotte Tilbury), and verify certification credentials.</p>
            
            <h4 className="font-semibold text-foreground text-base mt-4 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" /> 2. Secure Transactions
            </h4>
            <p>All deposits are handled through modern tokenized APIs. We use Razorpay to process payments safely, protecting you from online frauds and unauthorized transactions.</p>
            
            <h4 className="font-semibold text-foreground text-base mt-4 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" /> 3. kit & Hygiene Standards
            </h4>
            <p>Artists are strictly audited on hygiene protocols. This includes the use of disposable wands, sanitizing palettes, clean brushes, and skin-compatibility checks prior to cosmetic application.</p>
          </div>
        );

      case "contact":
        return (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="rounded-2xl bg-ivory border border-border p-4 space-y-2">
                <div className="font-semibold text-foreground flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-primary" /> Support Desk
                </div>
                <a href="mailto:support@brideora.com" className="text-primary hover:underline block">support@brideora.com</a>
                <div className="text-xs text-muted-foreground">Average reply time: 15 minutes</div>
              </div>
              <div className="rounded-2xl bg-ivory border border-border p-4 space-y-2">
                <div className="font-semibold text-foreground flex items-center gap-1.5">
                  <Phone className="h-4 w-4 text-primary" /> Hotline Support
                </div>
                <div className="text-foreground font-medium">+91 99999 12345</div>
                <div className="text-xs text-muted-foreground">Available 9:00 AM – 9:00 PM IST</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <strong>Brideora HQ:</strong> Suite 402, Regus, Connaught Place, New Delhi, India 110001
              </div>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4 pt-2 border-t border-border">
              <h4 className="font-semibold text-foreground text-sm">Or Send Us an Instant Message</h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Name</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Email</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Message</label>
                <textarea
                  required
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="How can our Bridal Concierge support team help you?"
                  rows={3}
                  className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-gradient-royal py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:shadow-luxe transition-all flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? "Sending..." : "Submit Inquiry"}
              </button>
            </form>
          </div>
        );

      case "help-centre":
      case "help centre":
        return (
          <div className="space-y-4 text-sm text-muted-foreground overflow-y-auto max-h-[450px] pr-2">
            {[
              {
                q: "How does the Brideora Concierge match work?",
                a: "Our smart matching engine evaluates your wedding date, budget constraints, and desired style (e.g. pastel look, HD makeup, airbrush) to provide a curated shortlist of artists instantly. You can speak directly with the Concierge chatbot to query database matches."
              },
              {
                q: "What is the 10% advance deposit?",
                a: "It is a security deposit that blocks the artist's calendar for your date. The remaining balance (90%) is paid directly to the artist on the day of the event or according to your mutual arrangement."
              },
              {
                q: "Can I schedule a makeup trial?",
                a: "Yes! Once you pay the initial booking deposit, you will receive the artist's direct contact coordinates. You can schedule a trial directly with them. Trial fees are set by the individual artist."
              },
              {
                q: "Is there support in case of emergencies?",
                a: "Absolutely. Our hotline support operates daily. If an artist has an emergency, Brideora will assign an equally rated substitute and cover any cost differential."
              }
            ].map((faq, i) => (
              <div key={i} className="border-b border-border pb-3 last:border-b-0">
                <h5 className="font-semibold text-foreground flex items-start gap-1.5 mb-1 text-sm">
                  <HelpCircle className="h-4.5 w-4.5 text-primary flex-shrink-0 mt-0.5" />
                  {faq.q}
                </h5>
                <p className="pl-6 text-xs leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        );

      case "blog":
      case "press":
        return (
          <div className="text-center py-10 space-y-4">
            <div className="h-16 w-16 rounded-full bg-rose mx-auto flex items-center justify-center text-primary text-3xl">
              📢
            </div>
            <h4 className="font-display text-2xl text-foreground">Coming Soon!</h4>
            <p className="text-sm font-serif text-muted-foreground max-w-sm mx-auto">
              We are working hard to compile the latest bridal beauty trends and company press updates. Stay tuned!
            </p>
          </div>
        );

      default:
        return (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground font-serif">No details found for this topic.</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl rounded-[2.5rem] bg-pearl border border-gold/20 p-8 shadow-luxe animate-in fade-in zoom-in-95 duration-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 rounded-full p-2 text-muted-foreground hover:bg-rose hover:text-foreground transition-all cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-5">
          <div className="divider-ornament text-[10px] uppercase tracking-[0.25em] text-gold-soft mb-2">
            Brideora Guide
          </div>
          <h3 className="font-display text-3xl text-foreground">{getTitle()}</h3>
        </div>

        <div className="mt-4 border-t border-border/60 pt-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
