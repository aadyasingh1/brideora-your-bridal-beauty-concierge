import { useState } from "react";
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
    </div>
  );
}
