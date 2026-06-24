import { useState, useEffect } from "react";
import { Star, MapPin, Award, Heart } from "lucide-react";
import { Link } from "@tanstack/react-router";
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
import mehendiCover from "@/assets/mehendi-new-3.jpg";
import catNails from "@/assets/nails-new-5.jpg";

// Batch 1 manual uploads
import hair9 from "@/assets/hair-new-9.jpg";
import hair10 from "@/assets/hair-new-10.jpg";
import mehendi3 from "@/assets/mehendi-new-3.jpg";
import makeup9 from "@/assets/makeup-new-9.jpg";
import prebridal8 from "@/assets/prebridal-new-8.jpg";

// Batch 2 manual uploads
import hair11 from "@/assets/hair-new-11.jpg";
import hair12 from "@/assets/hair-new-12.jpg";
import makeup10 from "@/assets/makeup-new-10.jpg";
import prebridal9 from "@/assets/prebridal-new-9.jpg";
import prebridal10 from "@/assets/prebridal-new-10.jpg";

// Batch 3 manual uploads
import nails1 from "@/assets/nails-new-1.jpg";
import nails2 from "@/assets/nails-new-2.jpg";
import nails3 from "@/assets/nails-new-3.jpg";
import nails4 from "@/assets/nails-new-4.jpg";
import nails5 from "@/assets/nails-new-5.jpg";

// Batch 4 manual uploads
import hair13 from "@/assets/hair-new-13.jpg";
import makeup11 from "@/assets/makeup-new-11.jpg";
import mehendi4 from "@/assets/mehendi-new-4.jpg";
import mehendi5 from "@/assets/mehendi-new-5.jpg";
import mehendi6 from "@/assets/mehendi-new-6.jpg";

import { BookingModal } from "./BookingModal";
import { toast } from "sonner";
import {
  gdriveMakeupImages,
  gdriveHairImages,
  gdriveMehendiImages,
  gdriveNailsImages,
  gdrivePrebridalImages
} from "./gdriveImages";

const makeupImages = [makeup11, makeup10, makeup9, ...gdriveMakeupImages, a1, a2, an1, an2, an3, an5, an6, an8, an10, makeup1, makeup2, makeup3, makeup4, makeup5, makeup6, makeup7, makeup8];
const eventImages = [makeup11, makeup10, makeup9, ...gdriveMakeupImages, a2, a3, an4, an7, an9, makeup2, makeup3, makeup5, makeup6, makeup8];
const hairImages = [hair13, hair11, hair12, hair9, hair10, ...gdriveHairImages, a3, hair1, hair2, hair3, hair4, hair5, hair6, hair7, hair8];
const mehendiImages = [mehendi4, mehendi5, mehendi6, mehendi3, ...gdriveMehendiImages, mehendi1, mehendi2, mehendiCover];
const squadImages = [nails1, nails2, nails3, nails4, nails5, ...gdriveNailsImages, catNails];
const wellnessImages = [prebridal9, prebridal10, prebridal8, ...gdrivePrebridalImages, prebridal1, prebridal2, prebridal3, prebridal4, prebridal5, prebridal6, prebridal7, an8];

const firstNames = [
  "Aanya", "Meher", "Riya", "Kriti", "Divya", "Pooja", "Ananya", "Ishita", "Sneha", "Tanvi", 
  "Neha", "Priya", "Aditi", "Simran", "Ridhima", "Kiara", "Nisha", "Gauri", "Shreya", "Kavya", 
  "Avani", "Diya", "Myra", "Suhana", "Kareena", "Alia", "Deepika", "Priyanka", "Shraddha", "Janhvi"
];

const lastNames = [
  "Kapoor", "Sharma", "Sehgal", "Malhotra", "Mehta", "Sen", "Joshi", "Verma", "Gupta", "Bhasin", 
  "Chawla", "Arora", "Gill", "Kaur", "Singh", "Roy", "Das", "Rao", "Nair", "Iyer", 
  "Trivedi", "Sarin", "Mehra", "Khanna", "Bahl", "Sethi", "Bose", "Choudhury", "Patel", "Reddy"
];

const localities = [
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

const services = [
  {
    category: "Bridal Makeup",
    styles: [
      "HD Bridal Makeup",
      "Airbrush Bridal Makeup",
      "Traditional Bridal Makeup",
      "Minimalist Bridal Makeup",
      "Glam Bridal Makeup"
    ],
    minPrice: 15000,
    maxPrice: 35000
  },
  {
    category: "Event-Specific Styling",
    styles: [
      "Haldi (Event-Specific Styling)",
      "Mehendi (Event-Specific Styling)",
      "Sangeet (Event-Specific Styling)",
      "Wedding Day (Event-Specific Styling)",
      "Reception (Event-Specific Styling)"
    ],
    minPrice: 6000,
    maxPrice: 18000
  },
  {
    category: "Hair Styling",
    styles: [
      "Bridal Updo (Hair Styling)",
      "Open Style (Hair Styling)",
      "Hair Extension Application (Hair Styling)",
      "Premium Styling (Hair Styling)"
    ],
    minPrice: 5000,
    maxPrice: 12000
  },
  {
    category: "Bridal Mehendi & Henna",
    styles: [
      "Traditional Bridal Mehendi (Bridal Mehendi & Henna)",
      "Arabic Henna Design (Bridal Mehendi & Henna)",
      "Intricate Mandala Mehendi (Bridal Mehendi & Henna)",
      "Premium Rajasthani Bridal Henna (Bridal Mehendi & Henna)"
    ],
    minPrice: 5000,
    maxPrice: 15000
  },
  {
    category: "Nail Art",
    styles: [
      "Classic Bridal Gel Extensions (Nail Art)",
      "Premium 3D Nail Art & Stones (Nail Art)",
      "Chrome Overlay & French Tips (Nail Art)",
      "Luxury Hand Spa & Overlay (Nail Art)"
    ],
    minPrice: 3000,
    maxPrice: 8000
  },
  {
    category: "Pre-Bridal Wellness & Grooming",
    styles: [
      "Facial & Massage (Pre-Bridal Wellness & Grooming)",
      "Hair Removal Package (Pre-Bridal Wellness & Grooming)",
      "Full Pre-Bridal Glow Treatment (Pre-Bridal Wellness & Grooming)"
    ],
    minPrice: 5000,
    maxPrice: 25000
  }
];

const artistImages = [a1, a2, a3, an1, an2, an3, an4, an5, an6, an7, an8, an9, an10];

const generateMockVendors = () => {
  const list = [];
  
  localities.forEach((loc, locIdx) => {
    services.forEach((srv, srvIdx) => {
      for (let itemIdx = 0; itemIdx < 12; itemIdx++) {
        const nameSeed = locIdx * 100 + srvIdx * 10 + itemIdx;
        
        let name = "";
        let speciality = "";
        let priceStr = "";
        let rating = 4.8;
        let reviews = 100;
        let img = artistImages[nameSeed % artistImages.length];
        
        if (srv.category === "Bridal Makeup") {
          img = makeupImages[nameSeed % makeupImages.length];
        } else if (srv.category === "Event-Specific Styling") {
          img = eventImages[nameSeed % eventImages.length];
        } else if (srv.category === "Hair Styling") {
          img = hairImages[nameSeed % hairImages.length];
        } else if (srv.category === "Bridal Mehendi & Henna") {
          img = mehendiImages[nameSeed % mehendiImages.length];
        } else if (srv.category === "Nail Art") {
          img = squadImages[nameSeed % squadImages.length];
        } else if (srv.category === "Pre-Bridal Wellness & Grooming") {
          img = wellnessImages[nameSeed % wellnessImages.length];
        }

        let badge = "";

        // Sync with specific chatbot recommended artists
        if (loc === "Dwarka" && srv.category === "Bridal Makeup" && itemIdx === 0) {
          name = "Aanya Kapoor";
          speciality = "HD Bridal Makeup";
          priceStr = "₹18,000";
          rating = 4.9;
          reviews = 124;
          img = a1;
          badge = "Top Rated";
        }
        else if (loc === "Saket" && srv.category === "Event-Specific Styling" && itemIdx === 0) {
          name = "Meher Studio";
          speciality = "Airbrush & Engagement (Event-Specific Styling)";
          priceStr = "₹22,000";
          rating = 4.8;
          reviews = 98;
          img = a2;
          badge = "Verified";
        }
        else if (loc === "Rohini" && srv.category === "Hair Styling" && itemIdx === 0) {
          name = "Riya Sehgal";
          speciality = "Hair Styling & Updos (Hair Styling)";
          priceStr = "₹9,500";
          rating = 4.9;
          reviews = 156;
          img = a3;
          badge = "Premium";
        }
        else if (loc === "Pitampura" && srv.category === "Bridal Mehendi & Henna" && itemIdx === 0) {
          name = "Priti Henna Art";
          speciality = "Traditional Bridal Mehendi (Bridal Mehendi & Henna)";
          priceStr = "₹8,500";
          rating = 4.9;
          reviews = 112;
          img = mehendi1;
          badge = "Premium";
        }
        else if (loc === "Janakpuri" && srv.category === "Bridal Mehendi & Henna" && itemIdx === 0) {
          name = "Divya Henna Studio";
          speciality = "Intricate Mandala Mehendi (Bridal Mehendi & Henna)";
          priceStr = "₹7,000";
          rating = 4.8;
          reviews = 94;
          img = mehendi2;
          badge = "Trending";
        }
        else if (loc === "Lajpat Nagar" && srv.category === "Hair Styling" && itemIdx === 0) {
          name = "Ishita Hair Couture";
          speciality = "Premium Styling (Hair Styling)";
          priceStr = "₹11,000";
          rating = 4.9;
          reviews = 138;
          img = hair4;
          badge = "Luxe";
        }
        else if (loc === "Rajouri Garden" && srv.category === "Pre-Bridal Wellness & Grooming" && itemIdx === 0) {
          name = "Pearl & Rose Wellness";
          speciality = "Full Pre-Bridal Glow Treatment (Pre-Bridal Wellness & Grooming)";
          priceStr = "₹12,500";
          rating = 4.8;
          reviews = 84;
          img = prebridal1;
          badge = "Luxury";
        }
        else if (loc === "Paschim Vihar" && srv.category === "Pre-Bridal Wellness & Grooming" && itemIdx === 0) {
          name = "Aura Luxury Spa";
          speciality = "Facial & Massage (Pre-Bridal Wellness & Grooming)";
          priceStr = "₹8,000";
          rating = 4.7;
          reviews = 76;
          img = prebridal3;
          badge = "Verified";
        }
        else if (loc === "Saket" && srv.category === "Bridal Makeup" && itemIdx === 0) {
          name = "Kriti Malhotra";
          speciality = "HD Bridal Makeup";
          priceStr = "₹24,000";
          rating = 4.9;
          reviews = 104;
          img = makeup1;
          badge = "Featured";
        }
        else {
          const firstName = firstNames[nameSeed % firstNames.length];
          const lastName = lastNames[(nameSeed * 7 + 3) % lastNames.length];
          name = `${firstName} ${lastName}`;
          
          speciality = srv.styles[nameSeed % srv.styles.length];
          
          const ratingVal = parseFloat((4.5 + (nameSeed % 5) * 0.1).toFixed(1));
          rating = ratingVal > 5.0 ? 5.0 : ratingVal;
          
          reviews = 30 + (nameSeed % 220);
          
          const priceStep = (srv.maxPrice - srv.minPrice) / 11;
          const priceVal = Math.round(srv.minPrice + itemIdx * priceStep);
          const roundedPrice = Math.round(priceVal / 500) * 500;
          priceStr = `₹${roundedPrice.toLocaleString('en-IN')}`;
          
          const badges = ["Top Rated", "Verified", "Premium", "Trending", "Featured", "Luxe"];
          badge = badges[nameSeed % badges.length];
        }

        const suffix = (loc === "Saket" || loc === "Lajpat Nagar") ? ", South Delhi" : ", Delhi";
        const location = `${loc}${suffix}`;

        list.push({
          name,
          speciality,
          location,
          price: priceStr,
          rating,
          reviews,
          img,
          badge,
          category: srv.category
        });
      }
    });
  });

  return list;
};

export const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const vendors = generateMockVendors();

interface FeaturedVendorsProps {
  localityFilter: string;
  budgetFilter: string;
  specialtyFilter: string;
  clearFilters: () => void;
}

export function FeaturedVendors({
  localityFilter,
  budgetFilter,
  specialtyFilter,
  clearFilters,
}: FeaturedVendorsProps) {
  const [selectedVendor, setSelectedVendor] = useState<typeof vendors[0] | null>(null);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [isWaitlistLoading, setIsWaitlistLoading] = useState(false);
  const [isWaitlistSubmitted, setIsWaitlistSubmitted] = useState(false);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail) return;

    setIsWaitlistLoading(true);

    try {
      const res = await fetch("/api/n8n/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "inquiry",
          path: "waitlist-request",
          data: {
            userEmail: waitlistEmail,
            userName: waitlistEmail.split("@")[0],
            category: specialtyFilter || "Bridal Makeup",
            location: localityFilter || "Delhi",
            budget: budgetFilter,
            timestamp: new Date().toISOString(),
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsWaitlistSubmitted(true);
        toast.success("Successfully joined the area waitlist!");
      } else {
        throw new Error(data.error || "Failed to join waitlist");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error joining waitlist");
    } finally {
      setIsWaitlistLoading(false);
    }
  };

  useEffect(() => {
    const handleOpenBooking = (e: Event) => {
      const customEvent = e as CustomEvent;
      const vendor = customEvent.detail?.vendor;
      if (vendor) {
        setSelectedVendor(vendor);
      }
    };
    window.addEventListener("open-booking-modal", handleOpenBooking);
    return () => window.removeEventListener("open-booking-modal", handleOpenBooking);
  }, []);

  const filteredVendors = vendors.filter((v) => {
    if (localityFilter) {
      const match = v.location.toLowerCase().includes(localityFilter.toLowerCase());
      if (!match) return false;
    }
    if (specialtyFilter) {
      const matchSpec =
        v.speciality.toLowerCase().includes(specialtyFilter.toLowerCase()) ||
        v.name.toLowerCase().includes(specialtyFilter.toLowerCase());
      if (!matchSpec) return false;
    }
    if (budgetFilter && budgetFilter !== "Any budget") {
      const priceVal = parseInt(v.price.replace(/[^\d]/g, ""), 10) || 0;
      if (budgetFilter === "Under ₹10,000") {
        if (priceVal >= 10000) return false;
      } else if (budgetFilter === "₹10,000 – ₹20,000") {
        if (priceVal < 10000 || priceVal > 20000) return false;
      } else if (budgetFilter === "₹20,000+") {
        if (priceVal < 20000) return false;
      }
    }
    return true;
  });

  const hasActiveFilters = !!(localityFilter || specialtyFilter || (budgetFilter && budgetFilter !== "Any budget"));

  const displayedVendors = hasActiveFilters
    ? filteredVendors
    : [
        vendors.find((v) => v.location.includes("Dwarka") && v.speciality.includes("Bridal Makeup")),
        vendors.find((v) => v.location.includes("Saket") && v.speciality.includes("Event-Specific Styling")),
        vendors.find((v) => v.location.includes("Rohini") && v.speciality.includes("Hair Styling")),
        vendors.find((v) => v.location.includes("Pitampura") && v.speciality.includes("Bridal Mehendi & Henna")),
        vendors.find((v) => v.location.includes("Janakpuri") && v.category === "Nail Art"),
        vendors.find((v) => v.location.includes("Rajouri Garden") && v.speciality.includes("Pre-Bridal Wellness & Grooming")),
      ].filter(Boolean) as typeof vendors;

  const triggerConciergeHelp = () => {
    let query = "I am looking for an artist";
    if (localityFilter) query += ` in ${localityFilter}`;
    if (budgetFilter && budgetFilter !== "Any budget") query += ` with budget ${budgetFilter.toLowerCase()}`;
    if (specialtyFilter) query += ` specializing in ${specialtyFilter}`;
    
    window.dispatchEvent(
      new CustomEvent("open-concierge", {
        detail: { query: query }
      })
    );
  };

  return (
    <section id="vendors" className="py-20 lg:py-28 bg-pearl/40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div className="max-w-xl">
            <div className="divider-ornament text-xs uppercase tracking-[0.3em] text-gold-soft">
              Handpicked
            </div>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl text-foreground">
              Featured artists this week
            </h2>
          </div>
          <button 
            onClick={triggerConciergeHelp}
            className="text-sm font-semibold text-primary hover:underline cursor-pointer"
          >
            Request Custom Concierge Search →
          </button>
        </div>

        {/* Filters status bar */}
        {hasActiveFilters && (
          <div className="mt-8 flex flex-wrap items-center gap-3 bg-ivory/80 border border-gold/10 rounded-2xl px-5 py-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Filters:</span>
            {localityFilter && (
              <span className="rounded-full bg-rose/40 text-primary px-3 py-1 text-xs font-medium border border-gold/15">
                Locality: {localityFilter}
              </span>
            )}
            {specialtyFilter && (
              <span className="rounded-full bg-rose/40 text-primary px-3 py-1 text-xs font-medium border border-gold/15">
                Specialty: {specialtyFilter}
              </span>
            )}
            {budgetFilter && budgetFilter !== "Any budget" && (
              <span className="rounded-full bg-rose/40 text-primary px-3 py-1 text-xs font-medium border border-gold/15">
                Budget: {budgetFilter}
              </span>
            )}
            <button
              onClick={clearFilters}
              className="ml-auto text-xs font-bold text-primary hover:underline cursor-pointer"
            >
              Clear all filters
            </button>
          </div>
        )}

        {displayedVendors.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-gold/30 bg-pearl p-12 text-center max-w-2xl mx-auto shadow-soft">
            <div className="h-16 w-16 rounded-full bg-rose mx-auto flex items-center justify-center text-primary mb-4 text-2xl">
              🔍
            </div>
            <h3 className="font-display text-2xl text-foreground mb-2">No matching artists found</h3>
            <p className="text-sm font-serif text-muted-foreground mb-6">
              We couldn't find featured listings in our preview directories matching your exact combination. Ask our smart Concierge to search all 850+ artists across Delhi!
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <button
                onClick={clearFilters}
                className="rounded-full border border-border px-5 py-2.5 text-xs font-semibold text-foreground hover:bg-ivory transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
              <button
                onClick={triggerConciergeHelp}
                className="rounded-full bg-gradient-royal px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow hover:shadow-md transition-all cursor-pointer"
              >
                Ask Bridal Concierge
              </button>
            </div>

            {isWaitlistSubmitted ? (
              <div className="border-t border-gold/10 pt-6 animate-in fade-in duration-500 max-w-md mx-auto">
                <div className="mx-auto h-10 w-10 rounded-full bg-success/15 flex items-center justify-center mb-3">
                  <span className="text-success text-lg">✓</span>
                </div>
                <h4 className="font-semibold text-foreground text-sm">Added to Area Waitlist!</h4>
                <p className="text-[11px] text-muted-foreground mt-1 max-w-xs mx-auto font-serif">
                  We have registered your interest in requesting {specialtyFilter || "bridal beauty expert"} services in {localityFilter || "Delhi"}. We'll email you immediately when matches join.
                </p>
              </div>
            ) : (
              <div className="border-t border-gold/10 pt-6 max-w-md mx-auto">
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-gold-soft mb-2.5">Join the Area Waitlist</h4>
                <p className="text-xs text-muted-foreground font-serif mb-4">
                  Request artists in {localityFilter || "your area"} and get notified as soon as new experts match your search criteria.
                </p>
                <form onSubmit={handleWaitlistSubmit} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    placeholder="Enter email to join waitlist"
                    className="flex-1 rounded-full border border-border bg-white px-4.5 py-2.5 text-xs outline-none focus:border-primary transition-all"
                  />
                  <button
                    type="submit"
                    disabled={isWaitlistLoading}
                    className="rounded-full bg-gradient-royal px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:shadow transition-all disabled:opacity-75 cursor-pointer whitespace-nowrap"
                  >
                    {isWaitlistLoading ? "Joining..." : "Join Waitlist"}
                  </button>
                </form>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {displayedVendors.map((v) => (
              <article
                key={v.name}
                className="group rounded-3xl bg-card overflow-hidden shadow-soft hover:shadow-luxe transition-all duration-500 border border-border/60"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Link to="/artist/$artistSlug" params={{ artistSlug: slugify(v.name) }}>
                    <img
                      src={v.img}
                      alt={v.name}
                      loading="lazy"
                      width={800}
                      height={1000}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer"
                    />
                  </Link>
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-pearl/90 backdrop-blur px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                    <Award className="h-3 w-3 text-gold" />
                    {v.badge}
                  </div>
                  <button
                    className="absolute top-4 right-4 h-9 w-9 rounded-full bg-pearl/90 backdrop-blur flex items-center justify-center hover:bg-pearl transition-colors cursor-pointer"
                    aria-label="Save"
                  >
                    <Heart className="h-4 w-4 text-primary" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link to="/artist/$artistSlug" params={{ artistSlug: slugify(v.name) }}>
                        <h3 className="font-display text-2xl text-foreground hover:text-primary transition-colors cursor-pointer">{v.name}</h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mt-0.5">{v.speciality}</p>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-rose px-2.5 py-1 text-xs font-semibold text-primary">
                      <Star className="h-3 w-3 fill-gold text-gold" />
                      {v.rating}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> {v.location}
                  </div>
                  <div className="mt-5 flex items-end justify-between pt-5 border-t border-border">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Starting from</div>
                      <div className="font-display text-2xl text-primary">{v.price}</div>
                    </div>
                    <Link
                      to="/artist/$artistSlug"
                      params={{ artistSlug: slugify(v.name) }}
                      className="rounded-full bg-foreground px-5 py-2.5 text-xs font-semibold text-pearl hover:bg-primary transition-colors cursor-pointer"
                    >
                      View Profile
                    </Link>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">{v.reviews} reviews</div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {selectedVendor && (
        <BookingModal
          isOpen={!!selectedVendor}
          onClose={() => setSelectedVendor(null)}
          vendor={selectedVendor}
        />
      )}
    </section>
  );
}
