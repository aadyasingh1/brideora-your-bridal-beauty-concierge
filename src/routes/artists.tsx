import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MapPin, Search, SlidersHorizontal, ArrowLeft, Sparkles } from "lucide-react";
import { Navbar } from "@/components/brideora/Navbar";
import { Footer } from "@/components/brideora/Footer";
import { AuthModal } from "@/components/brideora/AuthModal";
import { InfoModal } from "@/components/brideora/InfoModal";
import { FeaturedVendors } from "@/components/brideora/FeaturedVendors";

interface ArtistsSearch {
  specialty?: string;
  locality?: string;
  budget?: string;
}

export const Route = createFileRoute("/artists")({
  head: () => ({
    meta: [
      { title: "Brideora Artists — Verified Bridal Beauty Experts in Delhi" },
      {
        name: "description",
        content: "Browse and book top bridal makeup artists, hair stylists, and mehendi experts in Delhi. Filter by area, budget, and specialty.",
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): ArtistsSearch => {
    return {
      specialty: search.specialty as string | undefined,
      locality: search.locality as string | undefined,
      budget: search.budget as string | undefined,
    };
  },
  component: ArtistsPage,
});

const categories = [
  "All Services",
  "Bridal Makeup",
  "Event-Specific Styling",
  "Hair Styling",
  "Bridal Mehendi & Henna",
  "Bridal Squad Services",
  "Pre-Bridal Wellness & Grooming"
];

const localities = [
  "All Delhi",
  "Dwarka",
  "Rohini",
  "Saket",
  "Pitampura",
  "Janakpuri",
  "Rajouri Garden",
  "Punjabi Bagh",
  "Lajpat Nagar",
  "Vasant Kunj",
  "Karol Bagh",
  "Model Town",
  "Paschim Vihar"
];

function ArtistsPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/artists" });

  const [localityFilter, setLocalityFilter] = useState(search.locality || "");
  const [specialtyFilter, setSpecialtyFilter] = useState(search.specialty || "");
  const [budgetFilter, setBudgetFilter] = useState(search.budget || "Any budget");

  // Sync state with URL search params when they change
  useEffect(() => {
    setLocalityFilter(search.locality || "");
    setSpecialtyFilter(search.specialty || "");
    setBudgetFilter(search.budget || "Any budget");
  }, [search.locality, search.specialty, search.budget]);

  const [authModal, setAuthModal] = useState<{ open: boolean; tab: "login" | "signup"; role: "user" | "artist" }>({
    open: false,
    tab: "login",
    role: "user"
  });
  const [infoModal, setInfoModal] = useState<{ open: boolean; type: string }>({ open: false, type: "" });

  const handleSignInClick = (tab?: "login" | "signup", role?: "user" | "artist") => {
    setAuthModal({
      open: true,
      tab: tab || "login",
      role: role || "user"
    });
  };

  const updateFilters = (newFilters: { locality?: string; specialty?: string; budget?: string }) => {
    const nextLoc = newFilters.hasOwnProperty("locality") ? newFilters.locality : localityFilter;
    const nextSpec = newFilters.hasOwnProperty("specialty") ? newFilters.specialty : specialtyFilter;
    const nextBud = newFilters.hasOwnProperty("budget") ? newFilters.budget : budgetFilter;

    navigate({
      search: {
        locality: nextLoc || undefined,
        specialty: nextSpec || undefined,
        budget: nextBud !== "Any budget" ? nextBud : undefined,
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSignInClick={handleSignInClick} />

      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Breadcrumbs & Back */}
        <div className="mb-6 flex items-center gap-2">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="mb-12 max-w-3xl">
          <div className="divider-ornament text-xs uppercase tracking-[0.3em] text-gold-soft mb-3">Bridal Artists</div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground mb-4">
            Hyperlocal Bridal <span className="text-gradient-royal italic">Artists</span> in Delhi
          </h1>
          <p className="text-lg text-muted-foreground font-serif">
            Discover and book verified bridal makeup, hair styling, bridal mehendi, and pre-bridal wellness artists near you.
          </p>
        </div>

        {/* Filters Panel */}
        <div className="mb-10 rounded-[2rem] bg-pearl border border-border/80 p-6 lg:p-8 shadow-soft space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Locality Selector */}
            <div className="relative flex items-center">
              <MapPin className="absolute left-4 h-5 w-5 text-muted-foreground/60" />
              <select
                value={localityFilter ? localityFilter : "All Delhi"}
                onChange={(e) => {
                  const val = e.target.value;
                  updateFilters({ locality: val === "All Delhi" ? "" : val });
                }}
                className="w-full rounded-2xl border border-border/70 bg-white pl-12 pr-4 py-3.5 text-sm outline-none focus:border-primary transition-all appearance-none cursor-pointer"
              >
                {localities.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Budget Selector */}
            <div className="relative flex items-center">
              <SlidersHorizontal className="absolute left-4 h-5 w-5 text-muted-foreground/60" />
              <select
                value={budgetFilter}
                onChange={(e) => updateFilters({ budget: e.target.value })}
                className="w-full rounded-2xl border border-border/70 bg-white pl-12 pr-4 py-3.5 text-sm outline-none focus:border-primary transition-all appearance-none cursor-pointer"
              >
                <option value="Any budget">Any budget</option>
                <option value="Under ₹10,000">Under ₹10,000</option>
                <option value="₹10,000 – ₹20,000">₹10,000 – ₹20,000</option>
                <option value="₹20,000+">₹20,000+</option>
              </select>
            </div>

            {/* Category Dropdown */}
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-muted-foreground/60" />
              <select
                value={specialtyFilter ? specialtyFilter : "All Services"}
                onChange={(e) => {
                  const val = e.target.value;
                  updateFilters({ specialty: val === "All Services" ? "" : val });
                }}
                className="w-full rounded-2xl border border-border/70 bg-white pl-12 pr-4 py-3.5 text-sm outline-none focus:border-primary transition-all appearance-none cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Quick Filters */}
          <div className="border-t border-border/60 pt-6">
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-3 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-gold-soft" /> Quick Filter by Category
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isActive = (specialtyFilter === "" && cat === "All Services") || specialtyFilter === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => updateFilters({ specialty: cat === "All Services" ? "" : cat })}
                    className={`rounded-full px-5 py-2 text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                      isActive
                        ? "bg-foreground text-pearl shadow-md"
                        : "bg-rose text-primary hover:bg-rose/85"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Directory Listings */}
        <FeaturedVendors
          localityFilter={localityFilter}
          budgetFilter={budgetFilter}
          specialtyFilter={specialtyFilter}
          clearFilters={() => {
            updateFilters({ locality: "", specialty: "", budget: "Any budget" });
          }}
        />
      </main>

      <Footer
        onServiceClick={(cat) => updateFilters({ specialty: cat })}
        onLocationClick={(loc) => updateFilters({ locality: loc })}
        onInfoClick={(type) => setInfoModal({ open: true, type })}
        onSignInClick={handleSignInClick}
      />

      <AuthModal
        isOpen={authModal.open}
        onClose={() => setAuthModal({ ...authModal, open: false })}
        initialTab={authModal.tab}
        initialRole={authModal.role}
      />

      <InfoModal
        isOpen={infoModal.open}
        onClose={() => setInfoModal({ ...infoModal, open: false })}
        type={infoModal.type}
      />
    </div>
  );
}
