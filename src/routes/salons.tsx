import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Star, Award, Sparkles, Search, SlidersHorizontal, ArrowLeft, Check, Heart } from "lucide-react";
import { Navbar } from "@/components/brideora/Navbar";
import { Footer } from "@/components/brideora/Footer";
import { AuthModal } from "@/components/brideora/AuthModal";
import { InfoModal } from "@/components/brideora/InfoModal";
import { BookingModal } from "@/components/brideora/BookingModal";
import { toast } from "sonner";

// Import premium assets
import an1 from "@/assets/artist-new-1.jpg";
import an2 from "@/assets/artist-new-2.jpg";
import an4 from "@/assets/artist-new-4.jpg";
import an6 from "@/assets/artist-new-6.jpg";
import an9 from "@/assets/artist-new-9.jpg";
import an10 from "@/assets/artist-new-10.jpg";
import me1 from "@/assets/cat-mehendi.jpg";
import n1 from "@/assets/cat-nails.jpg";

export const Route = createFileRoute("/salons")({
  head: () => ({
    meta: [
      { title: "Brideora Salons — Hyperlocal Bridal Beauty & Hair Studios in Delhi" },
      {
        name: "description",
        content: "Discover, compare and book premium luxury salons, spas and beauty studios in Delhi. Browse multiple services and book deposits instantly.",
      },
    ],
  }),
  component: SalonsPage,
});

const mockSalons = [
  {
    id: "salon-1",
    name: "South Delhi Salon",
    location: "Saket, South Delhi",
    rating: 4.9,
    reviews: 178,
    badge: "Luxury",
    img: an1,
    services: [
      { name: "Complete Bridal Package", price: "₹35,000", category: "Bridal Makeup" },
      { name: "Engagement & Sangeet Makeup", price: "₹24,000", category: "Event-Specific Styling" },
      { name: "Party Makeup & Hair Styling", price: "₹14,000", category: "Event-Specific Styling" }
    ]
  },
  {
    id: "salon-2",
    name: "The Bride & Co. Studio",
    location: "Dwarka, Delhi",
    rating: 4.8,
    reviews: 134,
    badge: "Premium",
    img: an2,
    services: [
      { name: "HD Bridal Makeup", price: "₹28,000", category: "Bridal Makeup" },
      { name: "Airbrush Bridal Finish", price: "₹32,000", category: "Bridal Makeup" },
      { name: "Trial Makeup Session", price: "₹5,000", category: "Makeup Trials" }
    ]
  },
  {
    id: "salon-3",
    name: "Royal Orchid Spa & Salon",
    location: "Vasant Kunj, Delhi",
    rating: 4.9,
    reviews: 145,
    badge: "Elite",
    img: an6,
    services: [
      { name: "Luxury Pre-Bridal Skincare", price: "₹15,000", category: "Pre-Bridal Wellness & Grooming" },
      { name: "Global Hair Coloring & Styling", price: "₹10,500", category: "Hair Styling" },
      { name: "Bridal Glow HydraFacial", price: "₹8,000", category: "Pre-Bridal Wellness & Grooming" }
    ]
  },
  {
    id: "salon-4",
    name: "Golden Shear Salon",
    location: "Rajouri Garden, Delhi",
    rating: 4.7,
    reviews: 96,
    badge: "Verified",
    img: an10,
    services: [
      { name: "Hair Extensions & Volumizing", price: "₹12,000", category: "Hair Styling" },
      { name: "Bridal Hair Spa & Cut", price: "₹6,500", category: "Hair Styling" },
      { name: "Rebonding & Smoothening", price: "₹9,000", category: "Hair Styling" }
    ]
  },
  {
    id: "salon-5",
    name: "Nail Couture & Spa",
    location: "Punjabi Bagh, Delhi",
    rating: 4.8,
    reviews: 82,
    badge: "Best Seller",
    img: n1,
    services: [
      { name: "Bridal Gel Nail Extensions", price: "₹4,500", category: "Pre-Bridal Wellness & Grooming" },
      { name: "Chrome Overlay & Nail Art", price: "₹3,000", category: "Pre-Bridal Wellness & Grooming" },
      { name: "Premium Pedicure & Manicure", price: "₹2,500", category: "Pre-Bridal Wellness & Grooming" }
    ]
  },
  {
    id: "salon-6",
    name: "Delhi Glamour Hub",
    location: "Karol Bagh, Delhi",
    rating: 4.6,
    reviews: 112,
    badge: "Popular",
    img: an9,
    services: [
      { name: "Party Makeup & Styling", price: "₹9,500", category: "Event-Specific Styling" },
      { name: "Saree/Lehenga Draping", price: "₹2,500", category: "Outfit Draping" },
      { name: "Sangeet Hair Styling", price: "₹4,500", category: "Hair Styling" }
    ]
  },
  {
    id: "salon-7",
    name: "Studio Velvet Beauty",
    location: "Model Town, Delhi",
    rating: 4.9,
    reviews: 104,
    badge: "Trending",
    img: an4,
    services: [
      { name: "Glass Skin Makeover", price: "₹22,000", category: "Bridal Makeup" },
      { name: "Reception Glam Pack", price: "₹18,000", category: "Event-Specific Styling" },
      { name: "Roka/Engagement Finish", price: "₹15,000", category: "Event-Specific Styling" }
    ]
  },
  {
    id: "salon-8",
    name: "Heritage Mehendi & Salon",
    location: "Janakpuri, Delhi",
    rating: 4.9,
    reviews: 156,
    badge: "Elite",
    img: me1,
    services: [
      { name: "Luxury Bridal Mehendi", price: "₹11,500", category: "Event-Specific Styling" },
      { name: "Pre-Bridal Haldi Package", price: "₹7,500", category: "Pre-Bridal Wellness & Grooming" },
      { name: "Family Mehendi (Per Hand)", price: "₹1,500", category: "Event-Specific Styling" }
    ]
  }
];

const categories = [
  "All Services",
  "Bridal Makeup",
  "Event-Specific Styling",
  "Hair Styling",
  "Outfit Draping",
  "Bridal Squad Services",
  "Makeup Trials",
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

function SalonsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Services");
  const [selectedLocality, setSelectedLocality] = useState("All Delhi");
  
  // Track selected service per salon ID
  const [selectedServices, setSelectedServices] = useState<Record<string, number>>({});
  
  // Booking Modal State
  const [bookingModal, setBookingModal] = useState<{
    open: boolean;
    vendor: { name: string; speciality: string; price: string; location: string } | null;
  }>({ open: false, vendor: null });

  // Auth & Info modals
  const [authModal, setAuthModal] = useState<{ open: boolean; tab: "login" | "signup"; role: "user" | "artist" }>({
    open: false,
    tab: "login",
    role: "user"
  });
  const [infoModal, setInfoModal] = useState<{ open: boolean; type: string }>({ open: false, type: "" });

  // Initialize first service as selected for each salon
  useEffect(() => {
    const initial: Record<string, number> = {};
    mockSalons.forEach(s => {
      initial[s.id] = 0;
    });
    setSelectedServices(initial);
  }, []);

  const handleBookClick = (salon: typeof mockSalons[0]) => {
    const serviceIndex = selectedServices[salon.id] ?? 0;
    const service = salon.services[serviceIndex];
    setBookingModal({
      open: true,
      vendor: {
        name: salon.name,
        speciality: service.name,
        price: service.price,
        location: salon.location
      }
    });
  };

  const handleSignInClick = (tab?: "login" | "signup", role?: "user" | "artist") => {
    setAuthModal({
      open: true,
      tab: tab || "login",
      role: role || "user"
    });
  };

  // Filter salons
  const filteredSalons = mockSalons.filter(salon => {
    // 1. Locality Filter
    const matchesLocality =
      selectedLocality === "All Delhi" ||
      salon.location.toLowerCase().includes(selectedLocality.toLowerCase());

    // 2. Category Filter (checks if salon offers any service in this category)
    const matchesCategory =
      selectedCategory === "All Services" ||
      salon.services.some(s => s.category === selectedCategory);

    // 3. Search Query Filter (name or service name)
    const matchesSearch =
      searchQuery === "" ||
      salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      salon.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      salon.services.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesLocality && matchesCategory && matchesSearch;
  });

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
          <div className="divider-ornament text-xs uppercase tracking-[0.3em] text-gold-soft mb-3">Salons & Studios</div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground mb-4">
            Luxury Salons & <span className="text-gradient-royal italic">Studios</span> in Delhi
          </h1>
          <p className="text-lg text-muted-foreground font-serif">
            Compare services, explore rates, and book custom bridal packages, haircuts, pre-bridal glow care, and nail art at Delhi's top studios.
          </p>
        </div>

        {/* Filters Panel */}
        <div className="mb-10 rounded-[2rem] bg-pearl border border-border/80 p-6 lg:p-8 shadow-soft space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-muted-foreground/60" />
              <input
                type="text"
                placeholder="Search salons or services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-border/70 bg-white pl-12 pr-4 py-3.5 text-sm outline-none focus:border-primary transition-all"
              />
            </div>

            {/* Locality Selector */}
            <div className="relative flex items-center">
              <MapPin className="absolute left-4 h-5 w-5 text-muted-foreground/60" />
              <select
                value={selectedLocality}
                onChange={(e) => setSelectedLocality(e.target.value)}
                className="w-full rounded-2xl border border-border/70 bg-white pl-12 pr-4 py-3.5 text-sm outline-none focus:border-primary transition-all appearance-none cursor-pointer"
              >
                {localities.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Total Results Counter */}
            <div className="flex items-center justify-end text-sm text-muted-foreground pr-2 font-medium">
              Found {filteredSalons.length} premium salons
            </div>
          </div>

          {/* Category Quick Filters */}
          <div className="border-t border-border/60 pt-6">
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-3 flex items-center gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5 text-gold-soft" /> Filter by Service Type
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-5 py-2 text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-foreground text-pearl shadow-md"
                      : "bg-rose text-primary hover:bg-rose/85"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Directory Grid */}
        {filteredSalons.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSalons.map((salon) => {
              const activeIndex = selectedServices[salon.id] ?? 0;
              const activeService = salon.services[activeIndex] || salon.services[0];
              const priceInt = parseInt(activeService.price.replace(/[^\d]/g, ""), 10) || 10000;
              const depositAmount = Math.round(priceInt * 0.1);

              return (
                <article key={salon.id} className="group rounded-3xl bg-card overflow-hidden shadow-soft hover:shadow-luxe transition-all duration-500 border border-border/60 flex flex-col">
                  {/* Image container */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={salon.img}
                      alt={salon.name}
                      loading="lazy"
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-pearl/90 backdrop-blur px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                      <Award className="h-3 w-3 text-gold" /> {salon.badge}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Name & Rating */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-display text-2xl text-foreground leading-snug">{salon.name}</h3>
                        <div className="flex items-center gap-1 rounded-full bg-rose px-2.5 py-1 text-xs font-semibold text-primary">
                          <Star className="h-3 w-3 fill-gold text-gold" /> {salon.rating}
                        </div>
                      </div>

                      {/* Locality */}
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6 font-medium">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground/80" /> {salon.location}
                      </div>

                      {/* Services Picker section */}
                      <div className="mb-6 space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Select Service</span>
                        <div className="space-y-2">
                          {salon.services.map((service, index) => (
                            <label
                              key={service.name}
                              className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-all ${
                                activeIndex === index
                                  ? "border-primary/85 bg-rose-glow/10"
                                  : "border-border/60 bg-pearl/40 hover:bg-ivory"
                              }`}
                              onClick={() => {
                                setSelectedServices(prev => ({ ...prev, [salon.id]: index }));
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <div className={`flex h-4.5 w-4.5 items-center justify-center rounded-full border ${
                                  activeIndex === index ? "border-primary bg-primary text-pearl" : "border-border bg-white"
                                }`}>
                                  {activeIndex === index && <Check className="h-3 w-3" />}
                                </div>
                                <span className="text-xs font-semibold text-foreground/90">{service.name}</span>
                              </div>
                              <span className="text-xs font-bold text-primary">{service.price}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Booking/Checkout Summary & Button */}
                    <div className="pt-4 border-t border-border mt-auto">
                      <div className="flex justify-between items-end mb-4">
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Advance Deposit (10%)</div>
                          <div className="font-display text-2xl text-primary font-bold">₹{depositAmount.toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Full package</div>
                          <div className="text-sm font-semibold text-foreground">{activeService.price}</div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleBookClick(salon)}
                        className="w-full rounded-full bg-foreground py-3 text-xs font-semibold text-pearl hover:bg-primary transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-gold-soft" /> Book Selected Service
                      </button>
                      <div className="text-center text-[9px] text-muted-foreground mt-2">
                        {salon.reviews} reviews verified
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 rounded-[2rem] border border-dashed border-border/80 bg-pearl/40 p-8 max-w-lg mx-auto">
            <SlidersHorizontal className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="font-display text-2xl text-foreground mb-2">No Salons Match Filters</h3>
            <p className="text-sm font-serif text-muted-foreground mb-6">
              Try adjusting your search query, selecting another locality, or resetting category filters to browse available beauty salons.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All Services");
                setSelectedLocality("All Delhi");
              }}
              className="rounded-full bg-foreground px-6 py-3 text-xs font-semibold text-pearl hover:bg-primary transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      <Footer
        onServiceClick={() => {}}
        onLocationClick={() => {}}
        onInfoClick={(type) => setInfoModal({ open: true, type })}
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

      {bookingModal.open && bookingModal.vendor && (
        <BookingModal
          isOpen={bookingModal.open}
          onClose={() => setBookingModal({ open: false, vendor: null })}
          vendor={bookingModal.vendor}
        />
      )}
    </div>
  );
}
