import { useState, useEffect, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  Star, MapPin, Award, Heart, Share2, CheckCircle2, ShieldCheck, 
  Clock, ArrowLeft, Calendar, ChevronRight, Sparkles, Play, 
  Volume2, Plus, Minus, Info, CalendarDays, ThumbsUp, Send,
  Instagram
} from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/brideora/Navbar";
import { Footer } from "@/components/brideora/Footer";
import { AuthModal } from "@/components/brideora/AuthModal";
import { InfoModal } from "@/components/brideora/InfoModal";
import { BookingModal } from "@/components/brideora/BookingModal";
import { vendors, slugify } from "@/components/brideora/FeaturedVendors";
import { mockSalons } from "./salons";

// Import asset photos if needed or fall back gracefully
import heroCover from "@/assets/hero-bride.jpg";
import catMehendi from "@/assets/cat-mehendi.jpg";
import catParty from "@/assets/cat-party.jpg";
import catBridalMakeup from "@/assets/cat-bridal-makeup.jpg";

// Import new premium images
import hair1 from "@/assets/hair-new-1.jpg";
import hair2 from "@/assets/hair-new-2.jpg";
import hair3 from "@/assets/hair-new-3.jpg";
import hair4 from "@/assets/hair-new-4.jpg";
import hair5 from "@/assets/hair-new-5.jpg";
import hair6 from "@/assets/hair-new-6.jpg";
import hair7 from "@/assets/hair-new-7.jpg";
import makeup1 from "@/assets/makeup-new-1.jpg";
import makeup2 from "@/assets/makeup-new-2.jpg";
import makeup3 from "@/assets/makeup-new-3.jpg";
import makeup4 from "@/assets/makeup-new-4.jpg";
import makeup5 from "@/assets/makeup-new-5.jpg";
import prebridal1 from "@/assets/prebridal-new-1.jpg";
import prebridal2 from "@/assets/prebridal-new-2.jpg";
import prebridal3 from "@/assets/prebridal-new-3.jpg";
import prebridal4 from "@/assets/prebridal-new-4.jpg";
import prebridal5 from "@/assets/prebridal-new-5.jpg";
import prebridal6 from "@/assets/prebridal-new-6.jpg";
import mehendi1 from "@/assets/mehendi-new-1.jpg";
import mehendi2 from "@/assets/mehendi-new-2.jpg";

export const Route = createFileRoute("/artist/$artistSlug")({
  head: () => ({
    meta: [
      { title: "Brideora — Artist Profile" },
      { name: "description", content: "View bridal makeup portfolio, pricing, vanity kit, and verified reviews." },
    ],
  }),
  component: ArtistProfilePage,
});

// Pure CSS/React Before-After comparison slider
function BeforeAfterSlider({ beforeImg, afterImg }: { beforeImg: string; afterImg: string }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden select-none cursor-ew-resize border border-gold/20 shadow-soft"
    >
      {/* Before Image (Filtered to look like raw skin: slightly desaturated, natural tones) */}
      <div className="absolute inset-0 bg-zinc-800">
        <img 
          src={beforeImg} 
          alt="Before makeup" 
          className="w-full h-full object-cover filter saturate-[0.65] brightness-[0.95] contrast-[0.9]"
        />
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full z-10">
          Before (Raw Face)
        </div>
      </div>

      {/* After Image (Full Glamourous Makeup) */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
      >
        <img 
          src={afterImg} 
          alt="After Makeup" 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 right-4 bg-primary/95 backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full z-10">
          After (Brideora Glam)
        </div>
      </div>

      {/* Slider Line / Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize flex items-center justify-center pointer-events-none z-20"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="h-10 w-10 rounded-full bg-white text-primary border-2 border-primary shadow-soft flex items-center justify-center pointer-events-none font-bold text-lg">
          ↔
        </div>
      </div>
    </div>
  );
}

// Simulated vertical short-form reels mockup
function ReelsVideoMock({ artistName, coverImg }: { artistName: string; coverImg: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [likes, setLikes] = useState(148);
  const [hasLiked, setHasLiked] = useState(false);

  return (
    <div className="relative rounded-[2rem] overflow-hidden border border-gold/15 aspect-[9/16] w-full max-w-[280px] mx-auto bg-black shadow-soft group">
      {!isPlaying ? (
        <div className="absolute inset-0 flex flex-col justify-between p-5 h-full">
          <img src={coverImg} alt="Reels cover" className="absolute inset-0 w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
          
          <div className="relative z-10 self-start bg-rose/90 backdrop-blur-md text-primary text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full border border-gold/10">
            Unedited Reel
          </div>

          <button 
            onClick={() => setIsPlaying(true)}
            className="relative z-10 self-center h-14 w-14 rounded-full bg-white/35 backdrop-blur-lg border border-white/50 text-white flex items-center justify-center hover:scale-105 transition-all cursor-pointer shadow-luxe"
          >
            <Play className="h-6 w-6 fill-white ml-0.5 text-white" />
          </button>

          <div className="relative z-10 text-white space-y-1 text-left">
            <p className="font-display text-sm font-semibold">@{artistName.toLowerCase().replace(/[^a-z0-9]/g, "")}</p>
            <p className="text-[10px] text-zinc-300 font-serif line-clamp-2">Real client makeup capture under natural sunlight. No filters, no edits.</p>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col justify-between p-5 h-full bg-zinc-950">
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <img src={coverImg} alt="Simulated play" className="absolute inset-0 w-full h-full object-cover animate-pulse opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/45" />
            <div className="relative z-10 text-white text-center space-y-3 px-4">
              <Volume2 className="h-7 w-7 text-primary animate-bounce mx-auto" />
              <p className="text-[10px] font-semibold font-serif">Simulated HD video reel playing...</p>
              <button 
                onClick={() => setIsPlaying(false)}
                className="text-[9px] font-bold uppercase tracking-wider text-rose hover:underline"
              >
                Pause Reel
              </button>
            </div>
          </div>

          <div className="absolute bottom-16 right-3 flex flex-col items-center space-y-4 z-20">
            <button 
              onClick={() => {
                setHasLiked(!hasLiked);
                setLikes(prev => hasLiked ? prev - 1 : prev + 1);
              }}
              className="h-9 w-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/25 transition-all cursor-pointer"
            >
              <Heart className={`h-4.5 w-4.5 ${hasLiked ? "fill-red-500 text-red-500" : "text-white"}`} />
            </button>
            <span className="text-[9px] text-white font-bold">{likes}</span>
          </div>

          <div className="relative z-10 text-white space-y-1 text-left">
            <p className="font-display text-sm font-semibold">@{artistName.toLowerCase().replace(/[^a-z0-9]/g, "")}</p>
            <p className="text-[10px] text-zinc-300 font-serif line-clamp-2">Real client makeup capture under natural sunlight. No filters, no edits.</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Live availability calendar widget
function AvailabilityCalendar({ selectedDate, onSelectDate }: { selectedDate: string, onSelectDate: (d: string) => void }) {
  const daysInMonth = 31;
  const startDayOffset = 3; // Wednesday offset (July 2026)
  
  // Weekend bookings represent blocked wedding dates
  const blockedDays = [4, 5, 11, 12, 18, 19, 25, 26];

  const weeks: (number | null)[][] = [];
  let currentWeek: (number | null)[] = Array(startDayOffset).fill(null);

  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  return (
    <div className="rounded-3xl border border-gold/15 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
        <h4 className="font-display text-sm text-primary font-bold">July 2026</h4>
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Peak Season</span>
      </div>
      <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-bold text-muted-foreground mb-2">
        <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {weeks.map((week, wIdx) => 
          week.map((day, dIdx) => {
            if (day === null) {
              return <div key={`empty-${wIdx}-${dIdx}`} className="aspect-square" />;
            }
            const isBlocked = blockedDays.includes(day);
            const dateStr = `2026-07-${day.toString().padStart(2, "0")}`;
            const isSelected = selectedDate === dateStr;

            return (
              <button
                key={`day-${day}`}
                disabled={isBlocked}
                onClick={() => onSelectDate(dateStr)}
                className={`aspect-square rounded-xl text-[11px] font-bold flex flex-col items-center justify-center relative transition-all duration-300 ${
                  isBlocked
                    ? "bg-rose/20 text-red-400 cursor-not-allowed border border-red-200/20 overflow-hidden"
                    : isSelected
                    ? "bg-primary text-white shadow-soft scale-105 border border-primary cursor-pointer"
                    : "bg-pearl hover:bg-rose hover:text-primary text-foreground border border-border/40 cursor-pointer"
                }`}
                title={isBlocked ? "Wedding Booked" : "Available"}
              >
                {isBlocked && (
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(239,68,68,0.08)_25%,transparent_25%,transparent_50%,rgba(239,68,68,0.08)_50%,rgba(239,68,68,0.08)_75%,transparent_75%,transparent)] bg-[length:6px_6px] pointer-events-none" />
                )}
                <span>{day}</span>
              </button>
            );
          })
        )}
      </div>
      <div className="mt-4 flex items-center justify-center gap-3 text-[9px] text-muted-foreground border-t border-border/50 pt-3">
        <div className="flex items-center gap-1">
          <div className="h-2.5 w-2.5 rounded bg-pearl border border-border" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2.5 w-2.5 rounded bg-rose/20 border border-red-200/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(239,68,68,0.08)_25%,transparent_25%,transparent_50%,rgba(239,68,68,0.08)_50%,rgba(239,68,68,0.08)_75%,transparent_75%,transparent)] bg-[length:5px_5px]" />
          </div>
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2.5 w-2.5 rounded bg-primary" />
          <span>Selected</span>
        </div>
      </div>
    </div>
  );
}

function ArtistProfilePage() {
  const { artistSlug } = Route.useParams();
  
  // Find artist from our mock vendors list
  let artist = vendors.find(v => slugify(v.name) === artistSlug);

  // If not found, check mock salons
  if (!artist) {
    const salon = mockSalons.find(s => slugify(s.name) === artistSlug);
    if (salon) {
      artist = {
        name: salon.name,
        speciality: salon.services[0]?.name || "Luxury Salon Service",
        location: salon.location,
        price: salon.services[0]?.price || "₹15,000",
        rating: salon.rating,
        reviews: salon.reviews,
        img: salon.img,
        badge: salon.badge,
        category: salon.services[0]?.category || "Bridal Makeup"
      };
    }
  }

  // Fallback to avoid crashes
  if (!artist) {
    const name = artistSlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    artist = {
      name,
      speciality: "HD Bridal Makeup",
      location: "Dwarka, Delhi",
      price: "₹18,000",
      rating: 4.9,
      reviews: 124,
      img: vendors[0].img,
      badge: "Top Rated",
      category: "Bridal Makeup"
    };
  }

  const basePrice = parseInt(artist.price.replace(/[^\d]/g, ""), 10) || 18000;

  const [customProfile, setCustomProfile] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("brideora-artist-profile");
    if (saved) {
      try {
        setCustomProfile(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const slugifiedCustomName = customProfile ? slugify(customProfile.name) : "";
  const isCustomArtist = customProfile && (artistSlug === slugifiedCustomName || artistSlug === "aanya-kapoor" || artistSlug === "glam-by-aanya");

  const displayPrice = isCustomArtist ? customProfile.packages.bridal : basePrice;
  const hdPrice = displayPrice;
  const airbrushPrice = displayPrice + 5000;
  const trialPrice = Math.round(displayPrice * 0.2);
  const partyPrice = Math.round(displayPrice * 0.4);

  // Wishlist and share states
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  useEffect(() => {
    const saved = localStorage.getItem(`wishlist-${isCustomArtist ? customProfile.name : artist!.name}`);
    if (saved === "true") setIsWishlisted(true);
  }, [artist.name, isCustomArtist, customProfile]);

  const toggleWishlist = () => {
    const next = !isWishlisted;
    setIsWishlisted(next);
    localStorage.setItem(`wishlist-${isCustomArtist ? customProfile.name : artist!.name}`, next ? "true" : "false");
    toast.success(next ? "Added to wishlist!" : "Removed from wishlist");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Profile link copied to clipboard!");
  };

  // Portfolio tab state
  const [portfolioTab, setPortfolioTab] = useState<"wedding" | "haldi" | "reception">("wedding");
  
  // Booking Calculator States
  const [selectedService, setSelectedService] = useState<"hd" | "airbrush" | "none">("hd");
  const [includeTrial, setIncludeTrial] = useState(false);
  const [partyCount, setPartyCount] = useState(0);
  const [addons, setAddons] = useState<string[]>([]);
  
  // Calendar select state
  const [bookingDate, setBookingDate] = useState("2026-07-06"); // default available Monday

  // Modal open trigger
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const addonOptions = [
    { id: "lashes", label: "Mink Lashes (Premium)", price: 1500 },
    { id: "extensions", label: "Premium Human Hair Extensions", price: 3500 },
    { id: "contacts", label: "Colored Contact Lenses", price: 1200 },
    { id: "earlyStart", label: "Early Morning Surcharge (Before 6 AM)", price: 2500 },
  ];

  const handleAddonToggle = (id: string) => {
    setAddons(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  // Dynamic cost calculations
  const getCalculatedCosts = () => {
    let mainPkgPrice = 0;
    let mainPkgLabel = "No Package Selected";

    if (selectedService === "hd") {
      mainPkgPrice = hdPrice;
      mainPkgLabel = "HD Bridal Makeup Package";
    } else if (selectedService === "airbrush") {
      mainPkgPrice = airbrushPrice;
      mainPkgLabel = "Airbrush Bridal Makeup Package";
    }

    const trialCost = includeTrial ? trialPrice : 0;
    
    // Group discount logic: 10% off party makeup if 3+ members booked
    const rawPartyCost = partyCount * partyPrice;
    const hasGroupDiscount = partyCount >= 3;
    const partyCost = hasGroupDiscount ? Math.round(rawPartyCost * 0.9) : rawPartyCost;

    const addonsCost = addons.reduce((sum, currentId) => {
      const option = addonOptions.find(opt => opt.id === currentId);
      return sum + (option ? option.price : 0);
    }, 0);

    const total = mainPkgPrice + trialCost + partyCost + addonsCost;
    const deposit = Math.round(total * 0.1);

    return {
      mainPkgPrice,
      mainPkgLabel,
      trialCost,
      partyCost,
      addonsCost,
      total,
      deposit,
      hasGroupDiscount
    };
  };

  const costs = getCalculatedCosts();

  // Unified booking payload to send to Razorpay order builder
  const handleCheckoutTrigger = () => {
    if (selectedService === "none" && !includeTrial && partyCount === 0) {
      toast.error("Please select at least one core service, trial, or squad makeup booking.");
      return;
    }
    setBookingModalOpen(true);
  };

  // Auth / Info models states
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

  // Before-after images selector
  const getBeforeAfterImages = () => {
    if (isCustomArtist && customProfile.profilePic) {
      return { before: customProfile.profilePic, after: customProfile.profilePic };
    }
    const cat = artist.category;
    if (cat === "Hair Styling") {
      return { before: hair3, after: hair1 };
    } else if (cat === "Bridal Mehendi & Henna") {
      return { before: catMehendi, after: mehendi1 };
    } else if (cat === "Pre-Bridal Wellness & Grooming") {
      return { before: prebridal3, after: prebridal1 };
    } else {
      return { before: makeup4, after: makeup1 };
    }
  };

  // Reels cover selector
  const getReelCoverImage = () => {
    if (isCustomArtist && customProfile.profilePic) {
      return customProfile.profilePic;
    }
    const cat = artist.category;
    if (cat === "Hair Styling") {
      return hair2;
    } else if (cat === "Bridal Mehendi & Henna") {
      return mehendi2;
    } else if (cat === "Pre-Bridal Wellness & Grooming") {
      return prebridal2;
    } else {
      return makeup2;
    }
  };

  // Instagram feed selector
  const getInstaFeedPhotos = () => {
    if (isCustomArtist && customProfile.portfolioPics && customProfile.portfolioPics.length >= 6) {
      return customProfile.portfolioPics.slice(0, 6);
    }
    const cat = artist.category;
    if (cat === "Hair Styling") {
      return [hair1, hair2, hair3, hair4, hair5, hair6];
    } else if (cat === "Bridal Mehendi & Henna") {
      return [mehendi1, mehendi2, catMehendi, mehendi1, mehendi2, catMehendi];
    } else if (cat === "Pre-Bridal Wellness & Grooming") {
      return [prebridal1, prebridal2, prebridal3, prebridal4, prebridal5, prebridal6];
    } else {
      return [makeup1, makeup2, makeup3, makeup4, makeup5, catBridalMakeup];
    }
  };

  // Portfolio items mapping based on selected tab
  const getPortfolioItems = () => {
    if (isCustomArtist && customProfile.portfolioPics && customProfile.portfolioPics.length > 0) {
      return customProfile.portfolioPics;
    }
    const cat = artist.category;
    if (cat === "Hair Styling") {
      if (portfolioTab === "haldi") return [hair4, hair5, hair6];
      if (portfolioTab === "reception") return [hair7, hair1, hair2];
      return [hair1, hair2, hair3];
    } else if (cat === "Bridal Mehendi & Henna") {
      if (portfolioTab === "haldi") return [mehendi1, mehendi2, catMehendi];
      if (portfolioTab === "reception") return [mehendi2, catMehendi, mehendi1];
      return [mehendi1, mehendi2, catMehendi];
    } else if (cat === "Pre-Bridal Wellness & Grooming") {
      if (portfolioTab === "haldi") return [prebridal4, prebridal5, prebridal6];
      if (portfolioTab === "reception") return [prebridal1, prebridal2, prebridal3];
      return [prebridal1, prebridal2, prebridal3];
    } else {
      if (portfolioTab === "haldi") return [makeup3, makeup4, makeup5];
      if (portfolioTab === "reception") return [makeup2, makeup1, makeup5];
      return [makeup1, makeup2, makeup3];
    }
  };

  // Dynamic category-specific reviews
  const getReviewsForCategory = () => {
    const cat = artist.category;
    const name = displayName;
    
    if (cat === "Hair Styling") {
      return [
        {
          bride: "Ridhima Sen",
          date: "Sangeet Ceremony - June 2026",
          review: `Stunning hair styling by ${name}! She created a beautiful modern braid with fresh Mogra flowers that stayed perfectly secure through 4 hours of high-energy dancing. Received so many compliments!`,
          rating: 5,
          photos: [hair5]
        },
        {
          bride: "Kiara Bhasin",
          date: "Wedding Day - May 2026",
          review: `The extensions were color-matched perfectly and felt so light. ${name} designed an elegant traditional updo that accommodated my heavy mathapatti and dupatta drape beautifully.`,
          rating: 5,
          photos: [hair6]
        }
      ];
    } else if (cat === "Bridal Mehendi & Henna") {
      return [
        {
          bride: "Ananya Chawla",
          date: "Mehendi Ceremony - June 2026",
          review: `Her hand is incredibly fast and the design lines are laser-sharp. ${name} incorporated our love story motifs into the bridal design. The henna stain turned out to be a deep rich mahogany!`,
          rating: 5,
          photos: [mehendi1]
        },
        {
          bride: "Ishita Arora",
          date: "Sangeet Prep - May 2026",
          review: `Exquisite mandala design on my palms and beautiful Arabic patterns for my bridesmaids. ${name} and her team were very professional, finishing 15 family members' henna exactly on schedule.`,
          rating: 5,
          photos: [mehendi2]
        }
      ];
    } else if (cat === "Pre-Bridal Wellness & Grooming") {
      return [
        {
          bride: "Tanvi Mehta",
          date: "Pre-Bridal Spa - June 2026",
          review: `The pre-wedding HydraFacial and glow treatment at ${name} were heavenly. My skin felt so hydrated and prepped for the wedding makeup. The body massage was the perfect stress buster!`,
          rating: 5,
          photos: [prebridal5]
        },
        {
          bride: "Priya Gill",
          date: "Wellness Package - May 2026",
          review: `Clean, hygienic, and extremely relaxing. The bridal pedicure and nail extensions were done to perfection. ${name} is a must-book for every bride-to-be!`,
          rating: 5,
          photos: [prebridal6]
        }
      ];
    } else {
      return [
        {
          bride: "Kriti Malhotra",
          date: "Wedding Day - June 2026",
          review: `${name} was absolutely amazing! She arrived at my venue at 4:30 AM without a minute of delay. The makeup was extremely lightweight and looked absolutely skin-like. It did not crease or wash out even after 10 hours under heavy hot lights!`,
          rating: 5,
          photos: [makeup4]
        },
        {
          bride: "Sneha Sarin",
          date: "Reception Ceremony - May 2026",
          review: `I was super nervous about looking heavy on my reception day, but ${name}'s signature dewy glass finish was exactly what I wanted. She sanitizes all brushes right in front of you. 100% recommended!`,
          rating: 5,
          photos: [makeup5]
        }
      ];
    }
  };

  const displayName = isCustomArtist ? customProfile.name : artist.name;
  const displayLocation = isCustomArtist ? customProfile.location : artist.location;
  const displayImg = isCustomArtist && customProfile.profilePic ? customProfile.profilePic : artist.img;
  const displayCover = isCustomArtist && customProfile.coverPic ? customProfile.coverPic : heroCover;
  const displayBio = isCustomArtist ? customProfile.bio : "Certified by the prestigious Makeup Studio Academy. I focus on natural skin-like finishes that never feel heavy, highlighting your natural bone structure to make you glow under bright mandap lighting.";
  const displayBrands = isCustomArtist ? customProfile.brands : ["Charlotte Tilbury", "MAC Cosmetics", "Huda Beauty", "NARS", "Dior Beauty", "Estee Lauder"];
  const displayHygiene = isCustomArtist ? customProfile.hygiene : ["Sanitized Brushes", "Disposable Spoolies", "Disinfected Vanity Kit", "PPE & Masks"];
  const displayTravelRadius = isCustomArtist ? customProfile.travelRadius : "Travels outstation globally";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onSignInClick={handleSignInClick} />

      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link to="/artists" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Delhi Directory
          </Link>
        </div>

        {/* Dynamic Cover Section */}
        <div className="relative rounded-[2.5rem] overflow-hidden border border-gold/20 shadow-soft h-[350px] mb-8 group">
          <img 
            src={displayCover} 
            alt="Wedding Cover Backdrop" 
            className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Wishlist and Share Floating Buttons */}
          <div className="absolute top-6 right-6 flex gap-3 z-10">
            <button 
              onClick={handleShare}
              className="h-10 w-10 rounded-full bg-pearl/90 backdrop-blur flex items-center justify-center text-primary border border-gold/20 shadow-soft hover:bg-white hover:scale-105 transition-all cursor-pointer"
              title="Share Profile"
            >
              <Share2 className="h-4.5 w-4.5" />
            </button>
            <button 
              onClick={toggleWishlist}
              className="h-10 w-10 rounded-full bg-pearl/90 backdrop-blur flex items-center justify-center text-primary border border-gold/20 shadow-soft hover:bg-white hover:scale-105 transition-all cursor-pointer"
              title="Save to Wishlist"
            >
              <Heart className={`h-4.5 w-4.5 ${isWishlisted ? "fill-primary text-primary" : "text-primary"}`} />
            </button>
          </div>

          {/* Hero details card overlay */}
          <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 z-10 text-white">
            <div className="flex items-center gap-6">
              <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-white/80 shadow-luxe bg-pearl">
                <img src={displayImg} alt={displayName} className="h-full w-full object-cover" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="font-display text-3xl sm:text-4xl text-pearl font-semibold tracking-wide">{displayName}</h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose/90 backdrop-blur text-primary text-[9px] font-bold px-2.5 py-0.5 border border-gold/10 tracking-widest uppercase shadow-sm">
                    <Award className="h-3 w-3 text-gold" />
                    {artist.badge}
                  </span>
                </div>
                <p className="text-sm text-zinc-200 font-serif font-semibold">{artist.speciality}</p>
                <div className="flex items-center gap-2.5 text-xs text-zinc-300 font-semibold">
                  <MapPin className="h-3.5 w-3.5 text-rose-300" />
                  <span>Based in {displayLocation} • {displayTravelRadius}</span>
                </div>
              </div>
            </div>
            
            {/* Quick Ratings Row */}
            <div className="flex gap-4">
              <div className="bg-pearl/15 backdrop-blur-md rounded-2xl p-4 text-center border border-white/10 min-w-[90px]">
                <div className="flex items-center justify-center gap-1 text-gold">
                  <Star className="h-4 w-4 fill-gold text-gold" />
                  <span className="font-bold text-sm text-white">{artist.rating}</span>
                </div>
                <div className="text-[9px] uppercase tracking-wider text-zinc-300 mt-1">{artist.reviews} Reviews</div>
              </div>

              <div className="bg-pearl/15 backdrop-blur-md rounded-2xl p-4 text-center border border-white/10 min-w-[90px]">
                <div className="font-bold text-sm text-white">{100 + (artist.name.length * 7)}+</div>
                <div className="text-[9px] uppercase tracking-wider text-zinc-300 mt-1">Weddings Done</div>
              </div>
            </div>
          </div>
        </div>

        {/* Instagram Verification Block */}
        <section className="mb-8 rounded-[2.5rem] bg-gradient-to-r from-[#fdf0f5] to-[#f5f0fd] border border-pink-200/40 p-6 lg:p-8 shadow-soft text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 flex items-center justify-center text-white shadow">
                <Instagram className="h-7 w-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-xl font-bold text-foreground">Instagram Verified Feed</h3>
                  <span className="bg-emerald-100 text-emerald-700 text-[8px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full border border-emerald-250 flex items-center gap-0.5">
                    <CheckCircle2 className="h-2 w-2 fill-emerald-700 text-white" /> Synced
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-serif mt-0.5">
                  Real-time portfolio verification for @{isCustomArtist ? customProfile.instagram : "glam_by_aanya"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center md:text-left">
                <div className="text-lg font-bold text-foreground">18.4K</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Followers</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-lg font-bold text-foreground">342</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Posts</div>
              </div>
              <a 
                href={`https://instagram.com/${isCustomArtist ? customProfile.instagram : "glam_by_aanya"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-foreground text-pearl px-5 py-2.5 text-xs font-semibold hover:bg-primary transition-all flex items-center gap-1.5 shadow"
              >
                Follow on Instagram
              </a>
            </div>
          </div>

          {/* Instagram Feed Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-6">
            {getInstaFeedPhotos().map((url, idx) => (
              <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-border/40 shadow-sm group">
                <img src={url} alt="Insta post" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white font-bold font-sans">
                  ♥ 428
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2 Grid Layout: Details & Sticky Calculator */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Main Details (Col-2) */}
          <div className="lg:col-span-2 space-y-10 text-left">
            
            {/* Visual Portfolio Showcase */}
            <section className="bg-pearl/30 border border-border/80 rounded-[2.5rem] p-8 shadow-soft space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border pb-4">
                <div>
                  <h3 className="font-display text-2xl text-foreground">Visual Portfolio</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 font-serif">Flip through ceremony portfolios or view live Before-After transitions.</p>
                </div>

                <div className="flex rounded-full bg-rose p-1 border border-gold/10">
                  <button 
                    onClick={() => setPortfolioTab("wedding")}
                    className={`rounded-full px-4 py-1.5 text-[11px] font-bold tracking-wider uppercase transition-all ${
                      portfolioTab === "wedding" ? "bg-primary text-white shadow-soft" : "text-primary hover:text-foreground"
                    }`}
                  >
                    Wedding Day
                  </button>
                  <button 
                    onClick={() => setPortfolioTab("haldi")}
                    className={`rounded-full px-4 py-1.5 text-[11px] font-bold tracking-wider uppercase transition-all ${
                      portfolioTab === "haldi" ? "bg-primary text-white shadow-soft" : "text-primary hover:text-foreground"
                    }`}
                  >
                    Haldi/Mehendi
                  </button>
                  <button 
                    onClick={() => setPortfolioTab("reception")}
                    className={`rounded-full px-4 py-1.5 text-[11px] font-bold tracking-wider uppercase transition-all ${
                      portfolioTab === "reception" ? "bg-primary text-white shadow-soft" : "text-primary hover:text-foreground"
                    }`}
                  >
                    Reception
                  </button>
                </div>
              </div>

              {/* Grid content containing Before & After, Reels, and Gallery */}
              <div className="grid md:grid-cols-5 gap-6">
                
                {/* Draggable Before & After Slider (takes 2 columns) */}
                <div className="md:col-span-2 space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block text-center">Interactive Makeover Slider</span>
                  <BeforeAfterSlider beforeImg={getBeforeAfterImages().before} afterImg={getBeforeAfterImages().after} />
                </div>

                {/* Unedited Reel Mockup (takes 1.5 columns) */}
                <div className="md:col-span-1.5 space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block text-center">Lighting Validation Reels</span>
                  <ReelsVideoMock artistName={displayName} coverImg={getReelCoverImage()} />
                </div>

                {/* Normal portfolio images (takes 1.5 columns) */}
                <div className="md:col-span-1.5 space-y-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block text-center">Recent Looks</span>
                  <div className="space-y-3">
                    {getPortfolioItems().map((imgUrl, index) => (
                      <div key={index} className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border/80 shadow-soft group cursor-zoom-in">
                        <img src={imgUrl} alt="Gallery" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-wider">
                          View Glam
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Style tags list */}
              <div className="pt-4 border-t border-border flex flex-wrap gap-2 items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Signature Tags:</span>
                {["#HDMakeup", "#DewyFinish", "#GlassSkin", "#SoftGlam", "#TraditionalRed", "#AirbrushExpert"].map(tag => (
                  <span key={tag} className="rounded-full bg-rose text-primary border border-gold/10 px-3 py-1 text-xs font-semibold">
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            {/* vanity Kit & Credentials */}
            <section className="bg-pearl/30 border border-border/80 rounded-[2.5rem] p-8 shadow-soft grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-display text-2xl text-foreground flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" /> What's in My Vanity
                </h3>
                <p className="text-xs text-muted-foreground font-serif">
                  High-paying brides care deeply about product quality. We exclusively stock luxury brand cosmetics to guarantee clean finishes that photograph flawlessly.
                </p>
                <div className="grid grid-cols-3 gap-2.5 pt-2">
                  {displayBrands.map(brand => (
                    <div key={brand} className="rounded-xl border border-border bg-white p-2.5 text-center text-[10px] font-bold text-primary shadow-sm hover:border-gold-soft transition-colors cursor-default">
                      {brand}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-5 border-t md:border-t-0 md:border-l border-border md:pl-8 pt-6 md:pt-0">
                <div>
                  <h3 className="font-display text-2xl text-foreground">Credentials & Bio</h3>
                  <p className="text-xs text-muted-foreground mt-2 font-serif leading-relaxed">
                    "{displayBio}"
                  </p>
                </div>

                <div className="space-y-2 border-t border-border pt-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Hygiene Standards Checks</span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-primary">
                    {displayHygiene.map(item => (
                      <div key={item} className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Logistics & Availability block */}
            <section className="bg-pearl/30 border border-border/80 rounded-[2.5rem] p-8 shadow-soft grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-display text-2xl text-foreground flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" /> Live Booking Calendar
                </h3>
                <p className="text-xs text-muted-foreground font-serif">
                  Select an available date in the calendar below. Dates highlighted in red are already booked for wedding ceremonies and cannot be selected.
                </p>
                <AvailabilityCalendar selectedDate={bookingDate} onSelectDate={(date) => {
                  setBookingDate(date);
                  toast.success(`Date selected: ${date}. Dynamic calculator updated.`);
                }} />
              </div>

              <div className="space-y-6 border-t md:border-t-0 md:border-l border-border md:pl-8 pt-6 md:pt-0">
                <div>
                  <h3 className="font-display text-2xl text-foreground">Travel & Escrow Policies</h3>
                  <p className="text-xs text-muted-foreground mt-1 font-serif">Transparent booking operations protecting both the bride and the artist.</p>
                </div>

                <div className="space-y-4 text-xs font-serif leading-relaxed text-muted-foreground">
                  <div className="space-y-1">
                    <span className="font-display text-xs font-semibold text-primary uppercase tracking-wide block">1. Outstation Travel Policy</span>
                    <p>Client bears direct flight costs, airport transfers, and hotel lodging for venues situated outside of Delhi NCR. Artist travel within Delhi NCR is free.</p>
                  </div>

                  <div className="space-y-1 border-t border-border pt-3">
                    <span className="font-display text-xs font-semibold text-primary uppercase tracking-wide block">2. Cancellation & Refunds</span>
                    <p>Protected by Brideora Escrow. 100% refund if booking is canceled 30 days or more prior to wedding date. 50% refund if canceled within 15–30 days. No refund inside 15 days.</p>
                  </div>

                  <div className="space-y-1 border-t border-border pt-3">
                    <span className="font-display text-xs font-semibold text-primary uppercase tracking-wide block">3. Escrow Deposit Security</span>
                    <p>Your 10% booking advance is held securely in Brideora Escrow and only released to the artist 24 hours after successful wedding day makeup delivery.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Social Proof (Bride Reviews & Unedited Photos) */}
            <section className="bg-pearl/30 border border-border/80 rounded-[2.5rem] p-8 shadow-soft space-y-6">
              <div>
                <h3 className="font-display text-2xl text-foreground">Real Bride Reviews</h3>
                <p className="text-xs text-muted-foreground mt-0.5 font-serif">Verified wedding day reviews from past brides.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {getReviewsForCategory().map((item, idx) => (
                  <div key={idx} className="rounded-3xl border border-border bg-white p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-display text-sm font-semibold text-primary">{item.bride}</h4>
                        <span className="text-[10px] text-muted-foreground uppercase font-serif">{item.date}</span>
                      </div>
                      <div className="flex items-center gap-1 rounded-full bg-rose px-2.5 py-0.5 text-[10px] font-bold text-primary">
                        <Star className="h-3 w-3 fill-gold text-gold" /> {item.rating}.0
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground font-serif leading-relaxed">"{item.review}"</p>
                    
                    {/* Unedited bride uploads */}
                    <div className="space-y-2 border-t border-border/50 pt-3">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground block">Bride's Unedited Photo Upload</span>
                      <div className="flex gap-2">
                        {item.photos.map((ph, i) => (
                          <div key={i} className="h-14 w-14 rounded-xl overflow-hidden border border-border/80 shadow-soft cursor-zoom-in">
                            <img src={ph} alt="Unedited bride" className="h-full w-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Sticky booking Price Calculator Sidebar (Col-1) */}
          <div className="space-y-6 lg:sticky lg:top-24">
            {/* Brideora Match Score */}
            <div className="rounded-[2rem] bg-gradient-royal p-5 text-white flex items-center justify-between shadow-luxe border border-white/10 relative overflow-hidden animate-in fade-in duration-300">
              <div className="absolute -right-6 -bottom-6 h-20 w-20 bg-pearl/10 rounded-full blur-xl pointer-events-none" />
              <div className="relative z-10 text-left space-y-1 pr-3">
                <div className="flex items-center gap-1.5 text-gold font-semibold">
                  <Sparkles className="h-4 w-4 fill-gold text-gold" />
                  <span className="font-display text-sm font-bold text-pearl">92% Brideora Match Score</span>
                </div>
                <p className="text-[10px] text-zinc-200 font-serif leading-relaxed">
                  Match based on your preference for dewy finishes, ₹18k budget limit, Delhi NCR location, and saved ivory inspirations.
                </p>
              </div>
              <span className="relative z-10 text-3xl font-extrabold text-pearl shrink-0">92%</span>
            </div>

            <div className="rounded-[2.5rem] bg-pearl border-2 border-gold/30 p-6 shadow-luxe space-y-6 text-left">
              <div>
                <h3 className="font-display text-xl text-primary font-bold">Package & Price Calculator</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5 font-serif">Customize your bridal booking to see live cost breakdowns.</p>
              </div>

              {/* Selected date display */}
              <div className="rounded-2xl bg-white border border-border p-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>Selected Date:</span>
                </div>
                <span className="text-xs font-bold text-foreground font-serif">{bookingDate}</span>
              </div>

              {/* Service package picker */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Select Core Package</span>
                <div className="space-y-2">
                  <label className={`flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all cursor-pointer bg-white ${
                    selectedService === "hd" ? "border-primary shadow-soft" : "border-border hover:border-gold-soft"
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <input 
                        type="radio" 
                        name="service-pack" 
                        checked={selectedService === "hd"} 
                        onChange={() => setSelectedService("hd")}
                        className="accent-primary"
                      />
                      <div>
                        <span className="text-xs font-bold text-foreground block">HD Bridal Makeup</span>
                        <span className="text-[9px] text-muted-foreground block mt-0.5 font-serif">Includes premium lashes, hair, & draping</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-primary font-serif">₹{hdPrice.toLocaleString()}</span>
                  </label>

                  <label className={`flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all cursor-pointer bg-white ${
                    selectedService === "airbrush" ? "border-primary shadow-soft" : "border-border hover:border-gold-soft"
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <input 
                        type="radio" 
                        name="service-pack" 
                        checked={selectedService === "airbrush"} 
                        onChange={() => setSelectedService("airbrush")}
                        className="accent-primary"
                      />
                      <div>
                        <span className="text-xs font-bold text-foreground block">Airbrush Bridal Makeup</span>
                        <span className="text-[9px] text-muted-foreground block mt-0.5 font-serif">Includes high-def makeup, hair & draping</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-primary font-serif">₹{airbrushPrice.toLocaleString()}</span>
                  </label>

                  <label className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer bg-white ${
                    selectedService === "none" ? "border-red-300" : "border-border/60 hover:border-red-200"
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <input 
                        type="radio" 
                        name="service-pack" 
                        checked={selectedService === "none"} 
                        onChange={() => setSelectedService("none")}
                        className="accent-primary"
                      />
                      <span className="text-xs font-bold text-muted-foreground block">No Core Package</span>
                    </div>
                    <span className="text-xs font-bold text-muted-foreground font-serif">₹0</span>
                  </label>
                </div>
              </div>

              {/* Standalone Trial checkbox */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Standalone Trial Booking</span>
                <label className={`flex items-center justify-between p-3.5 rounded-2xl border-2 bg-white transition-all cursor-pointer ${
                  includeTrial ? "border-primary shadow-soft" : "border-border hover:border-gold-soft"
                }`}>
                  <div className="flex items-center gap-2.5">
                    <input 
                      type="checkbox" 
                      checked={includeTrial} 
                      onChange={() => setIncludeTrial(!includeTrial)}
                      className="accent-primary"
                    />
                    <div>
                      <span className="text-xs font-bold text-foreground block">Pre-Wedding Makeup Trial</span>
                      <span className="text-[9px] text-muted-foreground block mt-0.5 font-serif">Adjustable in package booking deposit later</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-primary font-serif">+ ₹{trialPrice.toLocaleString()}</span>
                </label>
              </div>

              {/* Bridesmaids Squad counter */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Party / Bridal Squad Makeup</span>
                  {costs.hasGroupDiscount && (
                    <span className="bg-emerald-100 text-emerald-700 text-[8px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border border-emerald-250 animate-pulse">
                      10% Group Discount
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-border bg-white shadow-sm">
                  <div>
                    <span className="text-xs font-bold text-foreground block">Family & Bridesmaids</span>
                    <span className="text-[9px] text-muted-foreground block mt-0.5 font-serif">₹{partyPrice.toLocaleString()} per person</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setPartyCount(prev => Math.max(0, prev - 1))}
                      className="h-8 w-8 rounded-full border border-border hover:bg-rose flex items-center justify-center text-primary cursor-pointer transition-colors"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-sm font-bold text-foreground font-serif min-w-[15px] text-center">{partyCount}</span>
                    <button 
                      onClick={() => setPartyCount(prev => prev + 1)}
                      className="h-8 w-8 rounded-full border border-border hover:bg-rose flex items-center justify-center text-primary cursor-pointer transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Add-ons checkboxes */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Luxury Add-ons</span>
                <div className="space-y-1.5">
                  {addonOptions.map(opt => {
                    const isChecked = addons.includes(opt.id);
                    return (
                      <label key={opt.id} className={`flex items-center justify-between p-3 rounded-xl border bg-white cursor-pointer transition-all ${
                        isChecked ? "border-primary/50 bg-rose/10" : "border-border/60 hover:border-gold-soft"
                      }`}>
                        <div className="flex items-center gap-2 select-none">
                          <input 
                            type="checkbox" 
                            checked={isChecked} 
                            onChange={() => handleAddonToggle(opt.id)}
                            className="accent-primary text-[10px]"
                          />
                          <span className="text-[10px] font-semibold text-foreground leading-tight">{opt.label}</span>
                        </div>
                        <span className="text-[10px] font-bold text-primary font-serif">+ ₹{opt.price.toLocaleString()}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Live Cost Invoice Summary */}
              <div className="border-t border-border pt-5 space-y-2.5 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Price Breakdown</span>
                
                {selectedService !== "none" && (
                  <div className="flex justify-between text-muted-foreground font-serif">
                    <span>{costs.mainPkgLabel}:</span>
                    <span>₹{costs.mainPkgPrice.toLocaleString()}</span>
                  </div>
                )}
                
                {includeTrial && (
                  <div className="flex justify-between text-muted-foreground font-serif">
                    <span>Trial Makeup Booking:</span>
                    <span>₹{costs.trialCost.toLocaleString()}</span>
                  </div>
                )}

                {partyCount > 0 && (
                  <div className="flex justify-between text-muted-foreground font-serif">
                    <span>Squad Makeup ({partyCount} people):</span>
                    <span className={costs.hasGroupDiscount ? "text-emerald-600 font-bold" : ""}>
                      ₹{costs.partyCost.toLocaleString()}
                    </span>
                  </div>
                )}

                {addons.length > 0 && (
                  <div className="flex justify-between text-muted-foreground font-serif">
                    <span>Selected Add-ons:</span>
                    <span>₹{costs.addonsCost.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between font-bold text-foreground border-t border-dashed border-border/80 pt-3 text-sm">
                  <span>Grand Total Estimate:</span>
                  <span className="font-serif">₹{costs.total.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center bg-rose/40 border border-gold/10 p-3 rounded-2xl mt-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-primary block">10% Advance Deposit</span>
                    <span className="text-[9px] text-muted-foreground font-serif block">Escrow Protected</span>
                  </div>
                  <span className="font-display text-xl text-primary font-bold font-serif">₹{costs.deposit.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Trigger button */}
              <button 
                onClick={handleCheckoutTrigger}
                className="w-full rounded-full bg-gradient-royal py-3.5 text-xs font-semibold text-pearl hover:shadow-luxe hover:scale-[1.01] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md uppercase tracking-wider"
              >
                <Sparkles className="h-4 w-4" /> Book Deposit Slot
              </button>
            </div>

            {/* Escrow assurance helper */}
            <div className="rounded-[2rem] bg-emerald-50 border border-emerald-200 p-5 flex gap-3 text-left">
              <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-display text-xs font-bold text-emerald-800">Brideora Escrow Guarantee</h5>
                <p className="text-[10px] text-emerald-700 mt-1 font-serif leading-relaxed">
                  Your deposit is securely held. We only disburse the payment to the artist 24 hours after successful wedding day service delivery.
                </p>
              </div>
            </div>
          </div>
        </div>

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
      />

      <InfoModal
        isOpen={infoModal.open}
        onClose={() => setInfoModal({ ...infoModal, open: false })}
        type={infoModal.type}
      />

      {/* Render BookingModal for deposit payments */}
      {bookingModalOpen && (
        <BookingModal 
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          vendor={{
            name: artist.name,
            speciality: artist.speciality,
            price: `₹${costs.total.toLocaleString()}`, // Pass computed total price dynamically
            location: artist.location
          }}
        />
      )}
    </div>
  );
}
