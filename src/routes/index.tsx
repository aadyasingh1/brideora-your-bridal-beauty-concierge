import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/brideora/Navbar";
import { Hero } from "@/components/brideora/Hero";
import { Categories } from "@/components/brideora/Categories";
import { FeaturedVendors } from "@/components/brideora/FeaturedVendors";
import { Locations } from "@/components/brideora/Locations";
import { HowItWorks } from "@/components/brideora/HowItWorks";
import { AIPreview } from "@/components/brideora/AIPreview";
import { Inspiration } from "@/components/brideora/Inspiration";
import { Testimonials } from "@/components/brideora/Testimonials";
import { FAQ } from "@/components/brideora/FAQ";
import { Footer } from "@/components/brideora/Footer";
import { AuthModal } from "@/components/brideora/AuthModal";
import { InfoModal } from "@/components/brideora/InfoModal";
import { CheckCircle2, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Brideora — Find Your Perfect Bridal Beauty Expert in Delhi" },
      {
        name: "description",
        content:
          "Discover, compare and book trusted bridal makeup artists, mehendi designers and hair stylists across Delhi. Powered by Brideora's Bridal Concierge.",
      },
      { property: "og:title", content: "Brideora — Bridal Beauty Marketplace" },
      {
        property: "og:description",
        content:
          "India's hyperlocal bridal beauty marketplace. Book trusted artists in under 5 minutes.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [localityFilter, setLocalityFilter] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("Any budget");
  const [specialtyFilter, setSpecialtyFilter] = useState("");

  const [authModal, setAuthModal] = useState<{
    open: boolean;
    tab: "login" | "signup";
    role: "user" | "artist";
  }>({ open: false, tab: "login", role: "user" });

  const [infoModal, setInfoModal] = useState<{
    open: boolean;
    type: string;
  }>({ open: false, type: "" });

  const [successData, setSuccessData] = useState<{
    paymentId: string;
    orderId: string;
    vendorName: string;
    serviceName: string;
    date: string;
    userName: string;
    amount: string;
  } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get("payment");

    if (paymentStatus === "success") {
      const paymentId = params.get("payment_id") || "";
      const orderId = params.get("order_id") || "";
      const vendorName = params.get("vendor_name") || "Artist";
      const serviceName = params.get("service_name") || "Bridal Makeup Package";
      const date = params.get("date") || "";
      const userName = params.get("user_name") || "";
      const amount = params.get("amount") || "";

      setSuccessData({
        paymentId,
        orderId,
        vendorName,
        serviceName,
        date,
        userName,
        amount,
      });

      // Show success toast
      toast.success("Payment verified! Your booking is successfully logged.", {
        duration: 6000,
      });

      // Clear search query parameters to keep URL clean and prevent modal showing on refresh
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState(null, "", cleanUrl);
    } else if (paymentStatus === "error") {
      const reason = params.get("reason") || "An unknown error occurred during transaction.";
      toast.error(`Payment failed: ${reason}`, {
        duration: 8000,
      });

      // Clear search query parameters
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState(null, "", cleanUrl);
    }
  }, []);

  const handleSearch = () => {
    const el = document.getElementById("vendors");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleServiceClick = (service: string) => {
    setSpecialtyFilter(service);
    setLocalityFilter("");
    setBudgetFilter("Any budget");
    handleSearch();
  };

  const handleLocationClick = (loc: string) => {
    setLocalityFilter(loc);
    setSpecialtyFilter("");
    setBudgetFilter("Any budget");
    handleSearch();
  };

  const handleInfoClick = (type: string) => {
    setInfoModal({ open: true, type });
  };

  const handleSignInClick = (tab?: "login" | "signup", role?: "user" | "artist") => {
    setAuthModal({
      open: true,
      tab: tab || "login",
      role: role || "user",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSignInClick={handleSignInClick} />
      <main>
        <Hero
          locality={localityFilter}
          setLocality={setLocalityFilter}
          budget={budgetFilter}
          setBudget={setBudgetFilter}
          onSearch={handleSearch}
        />
        <Categories onCategoryClick={handleServiceClick} />
        <FeaturedVendors
          localityFilter={localityFilter}
          budgetFilter={budgetFilter}
          specialtyFilter={specialtyFilter}
          clearFilters={() => {
            setLocalityFilter("");
            setBudgetFilter("Any budget");
            setSpecialtyFilter("");
          }}
        />
        <Locations onLocationClick={handleLocationClick} />
        <HowItWorks />
        <AIPreview />
        <Inspiration />
        <Testimonials />
        <FAQ />
      </main>
      <Footer
        onServiceClick={handleServiceClick}
        onLocationClick={handleLocationClick}
        onInfoClick={handleInfoClick}
        onSignInClick={handleSignInClick}
      />

      <AuthModal
        isOpen={authModal.open}
        onClose={() => setAuthModal({ ...authModal, open: false })}
        initialTab={authModal.tab}
        initialRole={authModal.role}
        key={`${authModal.tab}-${authModal.role}`}
      />

      <InfoModal
        isOpen={infoModal.open}
        onClose={() => setInfoModal({ ...infoModal, open: false })}
        type={infoModal.type}
      />

      {successData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-[2.5rem] bg-pearl border border-gold/20 p-8 shadow-luxe animate-in fade-in zoom-in-95 duration-300">
            <button
              onClick={() => setSuccessData(null)}
              className="absolute right-6 top-6 rounded-full p-2 text-muted-foreground hover:bg-rose hover:text-foreground transition-all"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center py-6">
              <div className="mx-auto h-16 w-16 rounded-full bg-success/15 flex items-center justify-center mb-6 animate-bounce">
                <CheckCircle2 className="h-10 w-10 text-success" />
              </div>
              <h3 className="font-display text-3xl text-foreground mb-3">Booking Confirmed!</h3>
              <p className="text-sm font-serif text-muted-foreground max-w-sm mx-auto mb-6">
                Thank you, {successData.userName}! Your deposit has been successfully captured and your booking is secured.
              </p>
              
              <div className="rounded-2xl bg-ivory border border-border p-5 text-left text-xs space-y-3 mb-6">
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <span className="font-semibold text-muted-foreground">Artist:</span>
                  <span className="font-semibold text-foreground">{successData.vendorName}</span>
                </div>
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <span className="font-semibold text-muted-foreground">Service:</span>
                  <span className="font-semibold text-foreground">{successData.serviceName}</span>
                </div>
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <span className="font-semibold text-muted-foreground">Event Date:</span>
                  <span className="font-semibold text-foreground">
                    {new Date(successData.date).toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <span className="font-semibold text-muted-foreground">Deposit Paid:</span>
                  <span className="font-semibold text-primary">₹{parseInt(successData.amount, 10).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <span className="font-semibold text-muted-foreground">Payment ID:</span>
                  <span className="font-mono text-muted-foreground">{successData.paymentId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-muted-foreground">Order ID:</span>
                  <span className="font-mono text-muted-foreground">{successData.orderId}</span>
                </div>
              </div>

              <div className="text-[10px] text-muted-foreground flex items-center justify-center gap-1.5 mb-6">
                <ShieldCheck className="h-4 w-4 text-gold-soft" />
                Verified by Razorpay Secure Checkout.
              </div>

              <button
                onClick={() => setSuccessData(null)}
                className="w-full rounded-full bg-gradient-royal py-3.5 text-sm font-semibold text-pearl hover:shadow-luxe transition-all"
              >
                Back to Directory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
