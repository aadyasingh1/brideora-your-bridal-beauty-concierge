import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Star, Award, Sparkles, Search, SlidersHorizontal, ArrowLeft, Check, Heart } from "lucide-react";
import { Navbar } from "@/components/brideora/Navbar";
import { Footer } from "@/components/brideora/Footer";
import { AuthModal } from "@/components/brideora/AuthModal";
import { InfoModal } from "@/components/brideora/InfoModal";
import { BookingModal } from "@/components/brideora/BookingModal";
import { toast } from "sonner";
import { slugify } from "@/components/brideora/FeaturedVendors";

// Import premium assets
import a1 from "@/assets/artist-1.jpg";
import a2 from "@/assets/artist-2.jpg";
import a3 from "@/assets/artist-3.jpg";
import an1 from "@/assets/artist-new-1.jpg";
import an2 from "@/assets/artist-new-2.jpg";
import an3 from "@/assets/artist-new-3.jpg";
import an4 from "@/assets/artist-new-4.jpg";
import an5 from "@/assets/artist-new-5.jpg";
import an6 from "@/assets/artist-new-6.jpg";
import an7 from "@/assets/artist-new-7.jpg";
import an8 from "@/assets/artist-new-8.jpg";
import an9 from "@/assets/artist-new-9.jpg";
import an10 from "@/assets/artist-new-10.jpg";
import me1 from "@/assets/cat-mehendi.jpg";
import n1 from "@/assets/cat-nails.jpg";

// Import new premium images
import hair1 from "@/assets/hair-new-1.jpg";
import hair2 from "@/assets/hair-new-2.jpg";
import hair3 from "@/assets/hair-new-3.jpg";
import hair4 from "@/assets/hair-new-4.jpg";
import hair5 from "@/assets/hair-new-5.jpg";
import hair6 from "@/assets/hair-new-6.jpg";
import hair7 from "@/assets/hair-new-7.jpg";
import hair8 from "@/assets/hair-new-8.jpg";
import makeup1 from "@/assets/makeup-new-1.jpg";
import makeup2 from "@/assets/makeup-new-2.jpg";
import makeup3 from "@/assets/makeup-new-3.jpg";
import makeup4 from "@/assets/makeup-new-4.jpg";
import makeup5 from "@/assets/makeup-new-5.jpg";
import makeup6 from "@/assets/makeup-new-6.jpg";
import makeup7 from "@/assets/makeup-new-7.jpg";
import makeup8 from "@/assets/makeup-new-8.jpg";
import prebridal1 from "@/assets/prebridal-new-1.jpg";
import prebridal2 from "@/assets/prebridal-new-2.jpg";
import prebridal3 from "@/assets/prebridal-new-3.jpg";
import prebridal4 from "@/assets/prebridal-new-4.jpg";
import prebridal5 from "@/assets/prebridal-new-5.jpg";
import prebridal6 from "@/assets/prebridal-new-6.jpg";
import prebridal7 from "@/assets/prebridal-new-7.jpg";
import mehendi1 from "@/assets/mehendi-new-1.jpg";
import mehendi2 from "@/assets/mehendi-new-2.jpg";

const makeupImages = [a1, a2, an1, an2, an3, an5, an6, an8, an10, makeup1, makeup2, makeup3, makeup4, makeup5, makeup6, makeup7, makeup8];
const eventImages = [a2, a3, an4, an7, an9, makeup2, makeup3, makeup5, makeup6, makeup8];
const hairImages = [a3, hair1, hair2, hair3, hair4, hair5, hair6, hair7, hair8];
const mehendiImages = [mehendi1, mehendi2, me1, mehendi1, mehendi2];
const squadImages = [n1, an2, an5, an6, an10];
const wellnessImages = [prebridal1, prebridal2, prebridal3, prebridal4, prebridal5, prebridal6, prebridal7, an8];

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

const generateMockSalons = () => {
  const list = [];
  const salonNames = [
    "Grace & Glow", "The Velvet Room", "Femme Salon", "Aura Luxury Studio", "Royal Oak Salon", 
    "Urban Chic Spa", "Diva Makeovers", "Magnolia Hair & Beauty", "Reflections Salon", "Elite Bridal Studio",
    "Gilded Scissors", "Pearl & Rose Wellness", "Golden Shear Salon", "Nail Couture & Spa", "Studio Velvet Beauty"
  ];
  const images = [a1, a2, a3, an1, an2, an3, an4, an5, an6, an7, an8, an9, an10, me1, n1];
  
  const cleanLocalities = localities.filter(l => l !== "All Delhi");
  const cleanCategories = categories.filter(c => c !== "All Services");

  cleanLocalities.forEach((loc, locIdx) => {
    cleanCategories.forEach((cat, catIdx) => {
      for (let itemIdx = 0; itemIdx < 12; itemIdx++) {
        const nameSeed = locIdx * 100 + catIdx * 10 + itemIdx;
        
        let img = images[nameSeed % images.length];
        if (cat === "Bridal Makeup") {
          img = makeupImages[nameSeed % makeupImages.length];
        } else if (cat === "Event-Specific Styling") {
          img = eventImages[nameSeed % eventImages.length];
        } else if (cat === "Hair Styling") {
          img = hairImages[nameSeed % hairImages.length];
        } else if (cat === "Bridal Mehendi & Henna") {
          img = mehendiImages[nameSeed % mehendiImages.length];
        } else if (cat === "Bridal Squad Services") {
          img = squadImages[nameSeed % squadImages.length];
        } else if (cat === "Pre-Bridal Wellness & Grooming") {
          img = wellnessImages[nameSeed % wellnessImages.length];
        }

        const name = `${loc} ${salonNames[nameSeed % salonNames.length]}`;
        const suffix = (loc === "Saket" || loc === "Lajpat Nagar") ? ", South Delhi" : ", Delhi";
        const location = `${loc}${suffix}`;
        
        const ratingVal = parseFloat((4.5 + (nameSeed % 5) * 0.1).toFixed(1));
        const rating = ratingVal > 5.0 ? 5.0 : ratingVal;
        const reviews = 50 + (nameSeed % 150);
        const badges = ["Luxury", "Premium", "Elite", "Verified", "Best Seller", "Trending", "Popular"];
        const badge = badges[nameSeed % badges.length];

        const servicesList = [];
        if (cat === "Bridal Makeup") {
          servicesList.push({ name: "HD Bridal Makeup", price: "₹28,000", category: "Bridal Makeup" });
          servicesList.push({ name: "Airbrush Bridal Finish", price: "₹35,000", category: "Bridal Makeup" });
          servicesList.push({ name: "Royal Bridal Makeover", price: "₹45,000", category: "Bridal Makeup" });
        } else if (cat === "Event-Specific Styling") {
          servicesList.push({ name: "Haldi & Mehendi Look", price: "₹12,000", category: "Event-Specific Styling" });
          servicesList.push({ name: "Sangeet Styling Package", price: "₹15,000", category: "Event-Specific Styling" });
          servicesList.push({ name: "Engagement Glam Finish", price: "₹18,000", category: "Event-Specific Styling" });
        } else if (cat === "Hair Styling") {
          servicesList.push({ name: "Bridal Updo & Flowers", price: "₹8,500", category: "Hair Styling" });
          servicesList.push({ name: "Luxury Extensions & Blowdry", price: "₹12,000", category: "Hair Styling" });
          servicesList.push({ name: "Premium Styling & Setting", price: "₹6,000", category: "Hair Styling" });
        } else if (cat === "Bridal Mehendi & Henna") {
          servicesList.push({ name: "Traditional Bridal Mehendi", price: "₹8,500", category: "Bridal Mehendi & Henna" });
          servicesList.push({ name: "Premium Arabic Henna Design", price: "₹4,500", category: "Bridal Mehendi & Henna" });
          servicesList.push({ name: "Intricate Mandala Henna", price: "₹6,000", category: "Bridal Mehendi & Henna" });
        } else if (cat === "Bridal Squad Services") {
          servicesList.push({ name: "Bridesmaid Makeup & Hair", price: "₹9,500", category: "Bridal Squad Services" });
          servicesList.push({ name: "Mothers Grooming Package", price: "₹8,000", category: "Bridal Squad Services" });
          servicesList.push({ name: "Squad Pack (3+ People)", price: "₹22,000", category: "Bridal Squad Services" });
        } else if (cat === "Pre-Bridal Wellness & Grooming") {
          servicesList.push({ name: "Luxury Skincare HydraFacial", price: "₹7,500", category: "Pre-Bridal Wellness & Grooming" });
          servicesList.push({ name: "Bridal Glow Body Spa", price: "₹10,000", category: "Pre-Bridal Wellness & Grooming" });
          servicesList.push({ name: "Nail Extensions & Pedicure", price: "₹6,500", category: "Pre-Bridal Wellness & Grooming" });
        }

        list.push({
          id: `salon-${locIdx}-${catIdx}-${itemIdx}`,
          name,
          location,
          rating,
          reviews,
          badge,
          img,
          services: servicesList
        });
      }
    });
  });

  return list;
};

export const mockSalons = generateMockSalons();

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

  // Conversational AI states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [parsedSummary, setParsedSummary] = useState<string | null>(null);
  const [maxBudget, setMaxBudget] = useState<number | null>(null);

  const handleConversationalSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setParsedSummary(null);
      setMaxBudget(null);
      return;
    }

    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      
      const q = query.toLowerCase();
      let detectedLocality = "All Delhi";
      let detectedCategory = "All Services";
      let budget: number | null = null;

      // Extract locality
      for (const loc of localities) {
        if (loc !== "All Delhi" && q.includes(loc.toLowerCase())) {
          detectedLocality = loc;
          break;
        }
      }

      // Extract category keywords
      if (q.includes("bridal") || q.includes("wedding") || q.includes("makeover")) {
        detectedCategory = "Bridal Makeup";
      } else if (q.includes("hair") || q.includes("cut") || q.includes("extensions") || q.includes("styling")) {
        detectedCategory = "Hair Styling";
      } else if (q.includes("mehendi") || q.includes("henna") || q.includes("mehndi")) {
        detectedCategory = "Bridal Mehendi & Henna";
      } else if (q.includes("drap") || q.includes("saree") || q.includes("lehenga")) {
        detectedCategory = "Event-Specific Styling";
      } else if (q.includes("squad") || q.includes("bridesmaid") || q.includes("sister") || q.includes("family")) {
        detectedCategory = "Bridal Squad Services";
      } else if (q.includes("wellness") || q.includes("skin") || q.includes("facial") || q.includes("spa") || q.includes("glow") || q.includes("pedi") || q.includes("mani") || q.includes("nail")) {
        detectedCategory = "Pre-Bridal Wellness & Grooming";
      } else if (q.includes("event") || q.includes("haldi") || q.includes("sangeet") || q.includes("engagement")) {
        detectedCategory = "Event-Specific Styling";
      }

      // Extract budget numbers
      const kMatch = q.match(/(\d+)\s*k/);
      const numMatch = q.match(/(?:under|below|budget|₹)?\s*(\d{4,6})/);

      if (kMatch) {
        budget = parseInt(kMatch[1], 10) * 1000;
      } else if (numMatch) {
        budget = parseInt(numMatch[1], 10);
      }

      // Set states
      setSelectedLocality(detectedLocality);
      setSelectedCategory(detectedCategory);
      setMaxBudget(budget);

      // Build summary description
      let summary = "AI Concierge: Showing ";
      if (detectedCategory !== "All Services") {
        summary += `${detectedCategory} `;
      } else {
        summary += "salons ";
      }
      if (detectedLocality !== "All Delhi") {
        summary += `in ${detectedLocality} `;
      } else {
        summary += "across Delhi ";
      }
      if (budget) {
        summary += `under ₹${budget.toLocaleString()}`;
      }
      setParsedSummary(summary);
      toast.success("AI parsed search filters applied!");
    }, 800);
  };

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

    // 4. Budget Filter
    const matchesBudget =
      !maxBudget ||
      salon.services.some(s => {
        const priceNum = parseInt(s.price.replace(/[^\d]/g, ""), 10) || 0;
        return (selectedCategory === "All Services" || s.category === selectedCategory) && priceNum <= maxBudget;
      });

    return matchesLocality && matchesCategory && matchesSearch && matchesBudget;
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
            {/* Conversational AI Search Input */}
            <div className="relative flex items-center col-span-1 md:col-span-2">
              <Search className="absolute left-4 h-5 w-5 text-muted-foreground/60" />
              <input
                type="text"
                placeholder="Ask Brideora Concierge (e.g. 'makeup in Saket under 30k' or 'hydrafacial under 8k')"
                value={searchQuery}
                onChange={(e) => handleConversationalSearch(e.target.value)}
                className={`w-full rounded-2xl border bg-white pl-12 pr-12 py-3.5 text-sm outline-none transition-all ${
                  isAnalyzing 
                    ? "border-gold ring-4 ring-gold/15 animate-pulse text-foreground" 
                    : "border-border/70 focus:border-primary text-foreground"
                }`}
              />
              <div className="absolute right-4 flex items-center">
                {isAnalyzing ? (
                  <Sparkles className="h-5 w-5 text-gold animate-spin" />
                ) : (
                  <Sparkles className="h-5 w-5 text-gold-soft" title="AI Concierge Search Enabled" />
                )}
              </div>
            </div>

            {/* Locality Selector */}
            <div className="relative flex items-center col-span-1">
              <MapPin className="absolute left-4 h-5 w-5 text-muted-foreground/60" />
              <select
                value={selectedLocality}
                onChange={(e) => {
                  setSelectedLocality(e.target.value);
                  setParsedSummary(null);
                }}
                className="w-full rounded-2xl border border-border/70 bg-white pl-12 pr-4 py-3.5 text-sm outline-none focus:border-primary transition-all appearance-none cursor-pointer text-foreground"
              >
                {localities.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>

          {/* AI Parser Summary */}
          {parsedSummary && (
            <div className="rounded-2xl bg-gradient-to-r from-gold/10 to-rose/10 border border-gold/25 p-4 text-xs text-primary font-serif italic flex items-center justify-between gap-2 shadow-sm animate-in fade-in duration-300">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-gold animate-bounce shrink-0" />
                <span>{parsedSummary}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All Services");
                  setSelectedLocality("All Delhi");
                  setMaxBudget(null);
                  setParsedSummary(null);
                }}
                className="font-sans font-bold text-[10px] text-muted-foreground hover:text-primary cursor-pointer uppercase shrink-0"
              >
                Clear AI Filter
              </button>
            </div>
          )}

          {/* Category Quick Filters */}
          <div className="border-t border-border/60 pt-6 flex flex-wrap justify-between items-center gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-3 flex items-center gap-1.5">
                <SlidersHorizontal className="h-3.5 w-3.5 text-gold-soft" /> Filter by Service Type
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setParsedSummary(null);
                    }}
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
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest pt-4 md:pt-0">
              Found <span className="text-primary font-bold text-sm">{filteredSalons.length}</span> premium salons
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
                    <Link to="/artist/$artistSlug" params={{ artistSlug: slugify(salon.name) }}>
                      <img
                        src={salon.img}
                        alt={salon.name}
                        loading="lazy"
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer"
                      />
                    </Link>
                    <div className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-pearl/90 backdrop-blur px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                      <Award className="h-3 w-3 text-gold" /> {salon.badge}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Name & Rating */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <Link to="/artist/$artistSlug" params={{ artistSlug: slugify(salon.name) }} className="hover:text-primary transition-colors">
                          <h3 className="font-display text-2xl text-foreground leading-snug cursor-pointer">{salon.name}</h3>
                        </Link>
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
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleBookClick(salon)}
                          className="flex-1 rounded-full bg-foreground py-3 text-xs font-semibold text-pearl hover:bg-primary transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Sparkles className="h-3.5 w-3.5 text-gold-soft" /> Book
                        </button>
                        <Link
                          to="/artist/$artistSlug"
                          params={{ artistSlug: slugify(salon.name) }}
                          className="flex-1 rounded-full border border-border bg-white text-center py-3 text-xs font-semibold text-foreground hover:bg-rose transition-all flex items-center justify-center gap-1"
                        >
                          View Portfolio
                        </Link>
                      </div>
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
