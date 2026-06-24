import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  TrendingUp,
  Users,
  Calendar as CalendarIcon,
  Settings,
  Sparkles,
  RefreshCw,
  Plus,
  AlertCircle,
  CheckCircle,
  Instagram,
  DollarSign,
  Briefcase,
  Layers,
  ArrowLeft,
  Info,
  MessageSquare,
  Send,
  User
} from "lucide-react";
import { Navbar } from "@/components/brideora/Navbar";
import { Footer } from "@/components/brideora/Footer";
import { toast } from "sonner";

export const Route = createFileRoute("/artist-dashboard")({
  head: () => ({
    meta: [
      { title: "Brideora Partner Portal — Artist Dashboard" },
      {
        name: "description",
        content: "Manage your bridal beauty bookings, block wedding dates, analyze profile metrics, and sync Instagram portfolios.",
      },
    ],
  }),
  component: ArtistDashboardPage,
});

function ArtistDashboardPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "calendar" | "packages" | "health" | "instagram" | "inbox" | "bookings" | "profile">("dashboard");

  // State for Profile Editor
  const [profile, setProfile] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("brideora-artist-profile");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return {
      name: "Aanya Kapoor",
      studioName: "Aanya Kapoor Makeovers",
      bio: "Certified by the prestigious Makeup Studio Academy. I focus on natural skin-like finishes that never feel heavy, highlighting your natural bone structure to make you glow under bright mandap lighting.",
      location: "Dwarka, Delhi",
      travelRadius: "Travels outstation globally",
      instagram: "glam_by_aanya",
      packages: {
        bridal: 18000,
        engagement: 12000,
        haldi: 6000
      },
      brands: ["Charlotte Tilbury", "MAC Cosmetics", "Huda Beauty", "NARS", "Dior Beauty", "Estee Lauder"],
      hygiene: ["Sanitized Brushes", "Disposable Spoolies", "Disinfected Vanity Kit", "PPE & Masks"],
      profilePic: "",
      coverPic: "",
      portfolioPics: [] as string[]
    };
  });

  // State for bookings
  const [bookingsList, setBookingsList] = useState<Array<{
    id: string;
    clientName: string;
    date: string;
    service: string;
    location: string;
    amount: number;
    status: "Paid" | "Confirmed" | "Cancelled" | "Declined";
  }>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("brideora-bookings");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return [
      { id: "b1", clientName: "Devika Sen", date: "2026-07-12", service: "HD Bridal Makeup", location: "Saket, South Delhi", amount: 18000, status: "Paid" },
      { id: "b2", clientName: "Anjali Kabir", date: "2026-07-23", service: "Airbrush Bridal Finish", location: "Gurugram, NCR", amount: 23000, status: "Confirmed" },
      { id: "b3", clientName: "Priya Sharma", date: "2026-07-05", service: "Haldi & Mehendi Look", location: "Dwarka, Delhi", amount: 12000, status: "Paid" }
    ];
  });

  const saveBookings = (list: typeof bookingsList) => {
    setBookingsList(list);
    if (typeof window !== "undefined") {
      localStorage.setItem("brideora-bookings", JSON.stringify(list));
    }
  };

  // State for Calendar (Unified Calendar Management)
  const [blockedDates, setBlockedDates] = useState<Array<{ date: string; label: string }>>([
    { date: "2026-11-12", label: "Devika Weds Rohan" },
    { date: "2026-11-23", label: "Peak Season Block" },
    { date: "2026-12-05", label: "Anjali Weds Kabir" },
    { date: "2026-07-12", label: "Devika Weds Rohan" },
    { date: "2026-07-23", label: "Peak Season Block" },
    { date: "2026-07-05", label: "Anjali Weds Kabir" }
  ]);
  const [newBlockDate, setNewBlockDate] = useState("");
  const [newBlockLabel, setNewBlockLabel] = useState("");
  const [currentMonth, setCurrentMonth] = useState(6); // July
  const [currentYear, setCurrentYear] = useState(2026);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  // State for Service Builder (Tiered Package & Service Builder)
  const [isPeakSeasonBoost, setIsPeakSeasonBoost] = useState(true);
  const [isWeekdayDiscount, setIsWeekdayDiscount] = useState(false);
  const [baseBridalRate, setBaseBridalRate] = useState(() => profile.packages.bridal);
  const [baseEngagementRate, setBaseEngagementRate] = useState(() => profile.packages.engagement);
  const [baseHaldiRate, setBaseHaldiRate] = useState(() => profile.packages.haldi);

  // Sync profile package edits back to base rates state if profile changes
  useEffect(() => {
    setBaseBridalRate(profile.packages.bridal);
    setBaseEngagementRate(profile.packages.engagement);
    setBaseHaldiRate(profile.packages.haldi);
  }, [profile.packages]);

  // State for Instagram Sync (Instagram Auto-Sync Integration)
  const [isInstaSynced, setIsInstaSynced] = useState(true);
  const [instaGrid, setInstaGrid] = useState([
    { id: "img-1", url: "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?q=80&w=300", synced: true },
    { id: "img-2", url: "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?q=80&w=300", synced: true },
    { id: "img-3", url: "https://images.unsplash.com/photo-1594744803329-e58b31de215f?q=80&w=300", synced: false },
    { id: "img-4", url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=300", synced: true },
    { id: "img-5", url: "https://images.unsplash.com/photo-1522337360788-8b13edd793be?q=80&w=300", synced: false },
    { id: "img-6", url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=300", synced: true }
  ]);

  // State for AI Automated Portfolio Tagging
  const [taggingImage, setTaggingImage] = useState<string | null>(null);
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [generatedTags, setGeneratedTags] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState("");

  // Inquiries State (for AI Auto-Responder)
  const [inquiries, setInquiries] = useState<Array<{
    id: string;
    clientName: string;
    location: string;
    service: string;
    date: string;
    message: string;
    status: "Pending" | "Replied";
    squadCount: number;
  }>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("brideora-inquiries");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return [
      {
        id: "inq-1",
        clientName: "Riya Malhotra",
        location: "Saket, South Delhi",
        service: "HD Bridal Makeup",
        date: "2026-07-15",
        message: "Hi! I wanted to check if you are available for a wedding on July 15th in Saket. We'd need makeup for me (HD Bridal) + 3 bridesmaids. Let me know pricing!",
        status: "Pending",
        squadCount: 3
      },
      {
        id: "inq-2",
        clientName: "Sanya Gupta",
        location: "Dwarka, Delhi",
        service: "Engagement Makeup",
        date: "2026-07-20",
        message: "Hey, I need an engagement makeup look for July 20th in Dwarka. Just myself, looking for a very soft dewy look. Is your calendar open?",
        status: "Pending",
        squadCount: 0
      },
      {
        id: "inq-3",
        clientName: "Meera Oberoi",
        location: "Punjabi Bagh, Delhi",
        service: "Airbrush Bridal Finish",
        date: "2026-07-28",
        message: "Hello! Looking to book Airbrush Bridal Makeup for July 28th. We have a day wedding in Punjabi Bagh. Do you offer any discount if I book trial too?",
        status: "Pending",
        squadCount: 1
      }
    ];
  });

  const saveInquiries = (list: typeof inquiries) => {
    setInquiries(list);
    if (typeof window !== "undefined") {
      localStorage.setItem("brideora-inquiries", JSON.stringify(list));
    }
  };

  const [activeInquiryId, setActiveInquiryId] = useState("inq-1");
  const [selectedTemplate, setSelectedTemplate] = useState<"professional" | "urgency" | "discount">("professional");
  const [editableDraft, setEditableDraft] = useState("");

  const getDraftText = (inquiry: typeof inquiries[0], template: "professional" | "urgency" | "discount") => {
    if (!inquiry) return "";
    const dateStr = new Date(inquiry.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
    const baseRate = inquiry.service.includes("Airbrush") ? baseBridalRate + 5000 : baseBridalRate;
    const groupDiscount = inquiry.squadCount >= 3 ? 0.9 : 1.0;
    const squadPrice = inquiry.squadCount * 6000 * groupDiscount;
    const totalPrice = baseRate + squadPrice;
    const depositPrice = Math.round(totalPrice * 0.1);

    if (template === "professional") {
      return `Dear ${inquiry.clientName}, thank you for reaching out! Yes, I am available on ${dateStr} for your services in ${inquiry.location}. Based on my current rates, the quote for ${inquiry.service} ${inquiry.squadCount > 0 ? `+ ${inquiry.squadCount} Bridesmaids` : ''} is ₹${totalPrice.toLocaleString()}. A 10% advance of ₹${depositPrice.toLocaleString()} via Brideora Escrow will secure this date on my calendar. Looking forward to being part of your special day!\n\nBest regards,\n${profile.name}`;
    } else if (template === "urgency") {
      return `Hi ${inquiry.clientName}! Thanks for your message. I am available on ${dateStr}, but please note that this is a highly requested date and I have other inquiries pending for it. The total quote is ₹${totalPrice.toLocaleString()} (Deposit: ₹${depositPrice.toLocaleString()}). If you'd like to book, let's finalize the 10% advance deposit today so I can block it for you and reject other offers.\n\nWarmly,\n${profile.name}`;
    } else {
      const discTotal = Math.round(totalPrice * 0.95);
      const discDeposit = Math.round(discTotal * 0.1);
      return `Hello ${inquiry.clientName}! I would love to work with you on ${dateStr}. To help you lock in your wedding styling, I can offer a special 5% package discount on your booking, bringing the total from ₹${totalPrice.toLocaleString()} down to ₹${discTotal.toLocaleString()}! The booking deposit would be only ₹${discDeposit.toLocaleString()}. Let me know if you would like me to send over the booking link!\n\nCheers,\n${profile.name}`;
    }
  };

  // Re-generate draft on active inquiry / template changes
  useEffect(() => {
    const inquiry = inquiries.find(i => i.id === activeInquiryId);
    if (inquiry) {
      setEditableDraft(getDraftText(inquiry, selectedTemplate));
    }
  }, [activeInquiryId, selectedTemplate, inquiries, baseBridalRate, profile.name]);

  // Add block date handler
  const handleAddBlockDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockDate || !newBlockLabel) {
      toast.error("Please enter a valid date and description.");
      return;
    }
    // Prevent double block
    if (blockedDates.some(d => d.date === newBlockDate)) {
      toast.error("This date is already blocked on your calendar.");
      return;
    }
    setBlockedDates([...blockedDates, { date: newBlockDate, label: newBlockLabel }]);
    setNewBlockDate("");
    setNewBlockLabel("");
    toast.success(`Successfully blocked ${newBlockDate} on your unified calendar.`);
  };

  // Remove block date handler
  const handleRemoveBlockDate = (dateToRemove: string) => {
    setBlockedDates(blockedDates.filter(d => d.date !== dateToRemove));
    toast.success("Date unblocked successfully.");
  };

  const handleSaveProfile = (updatedProfile: typeof profile) => {
    setProfile(updatedProfile);
    localStorage.setItem("brideora-artist-profile", JSON.stringify(updatedProfile));
    toast.success("Public profile updated successfully! Changes are live on your portfolio page.");
  };

  const handleProfilePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setProfile(prev => ({ ...prev, profilePic: event.target.result as string }));
        toast.success("Profile photo uploaded!");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCoverPicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setProfile(prev => ({ ...prev, coverPic: event.target.result as string }));
        toast.success("Cover background photo uploaded!");
      }
    };
    reader.readAsDataURL(file);
  };


  // Toggle Insta pic sync
  const handleToggleInstaPic = (id: string) => {
    setInstaGrid(
      instaGrid.map(item =>
        item.id === id ? { ...item, synced: !item.synced } : item
      )
    );
    toast.success("Portfolio sync status updated.");
  };

  // Trigger Insta refresh simulation
  const handleInstaRefresh = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: "Syncing with @glam_by_aanya...",
        success: "Successfully synced 2 new posts from your Instagram grid!",
        error: "Sync failed."
      }
    );
  };

  const handlePortfolioTaggingUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setTaggingImage(event.target.result as string);
        setAnalyzingImage(true);
        setGeneratedTags([]);
        
        setTimeout(() => {
          setAnalyzingImage(false);
          setGeneratedTags(["#HDMakeup", "#RedLip", "#MatteFinish", "#DuskySkinTone", "#DewyGlow", "#BridalNath"]);
          toast.success("AI face-analysis complete! Generated 6 tags.");
        }, 2000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTagInput.trim()) return;
    let tag = customTagInput.trim();
    if (!tag.startsWith("#")) tag = "#" + tag;
    if (generatedTags.includes(tag)) {
      toast.error("Tag already exists.");
      return;
    }
    setGeneratedTags([...generatedTags, tag]);
    setCustomTagInput("");
  };

  const handleRemoveGeneratedTag = (tagToRemove: string) => {
    setGeneratedTags(generatedTags.filter(t => t !== tagToRemove));
  };

  const handleSaveTaggedImage = () => {
    setInstaGrid([
      { id: `img-${Date.now()}`, url: taggingImage || "", synced: true },
      ...instaGrid
    ]);
    setTaggingImage(null);
    setGeneratedTags([]);
    toast.success(`Successfully saved new photo with ${generatedTags.length} AI search tags!`);
  };

  // Calculate dynamic rates based on toggles
  const getCalculatedRate = (base: number) => {
    let multiplier = 1;
    if (isPeakSeasonBoost) multiplier += 0.2; // +20%
    if (isWeekdayDiscount) multiplier -= 0.1; // -10%
    return Math.round(base * multiplier);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="w-full max-w-[1920px] mx-auto px-6 sm:px-10 lg:px-16 py-12">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="divider-ornament text-xs uppercase tracking-[0.3em] text-gold-soft mb-2">Partner Portal</div>
            <h1 className="font-display text-4xl sm:text-5xl text-foreground">
              Artist <span className="text-gradient-royal italic">Dashboard</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1 font-serif">
              Welcome back, Aanya Kapoor • Professional HD Bridal Makeup Specialist
            </p>
          </div>
          
          {/* Quick Stats Pill */}
          <div className="rounded-2xl border border-gold/20 bg-pearl/60 p-4 shadow-soft flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-success/15 flex items-center justify-center text-success">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Profile Status</div>
              <div className="text-xs font-semibold text-foreground">Active & Bookable</div>
            </div>
          </div>
        </div>

        {/* Dashboard Layout */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-2 space-y-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-foreground text-pearl shadow-md"
                  : "bg-pearl hover:bg-rose/40 text-foreground/80"
              }`}
            >
              <TrendingUp className="h-4.5 w-4.5" /> Dashboard & Earnings
            </button>
            
            <button
              onClick={() => setActiveTab("calendar")}
              className={`w-full flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === "calendar"
                  ? "bg-foreground text-pearl shadow-md"
                  : "bg-pearl hover:bg-rose/40 text-foreground/80"
              }`}
            >
              <CalendarIcon className="h-4.5 w-4.5" /> Unified Calendar
            </button>

            <button
              onClick={() => setActiveTab("bookings")}
              className={`w-full flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === "bookings"
                  ? "bg-foreground text-pearl shadow-md"
                  : "bg-pearl hover:bg-rose/40 text-foreground/80"
              }`}
            >
              <Users className="h-4.5 w-4.5" /> Bookings & Customers
            </button>

            <button
              onClick={() => setActiveTab("inbox")}
              className={`w-full flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === "inbox"
                  ? "bg-foreground text-pearl shadow-md"
                  : "bg-pearl hover:bg-rose/40 text-foreground/80"
              }`}
            >
              <MessageSquare className="h-4.5 w-4.5" /> AI Inbox Responder
            </button>
            
            <button
              onClick={() => setActiveTab("packages")}
              className={`w-full flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === "packages"
                  ? "bg-foreground text-pearl shadow-md"
                  : "bg-pearl hover:bg-rose/40 text-foreground/80"
              }`}
            >
              <DollarSign className="h-4.5 w-4.5" /> Tiered Service Builder
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === "profile"
                  ? "bg-foreground text-pearl shadow-md"
                  : "bg-pearl hover:bg-rose/40 text-foreground/80"
              }`}
            >
              <User className="h-4.5 w-4.5" /> Edit Public Profile
            </button>
            
            <button
              onClick={() => setActiveTab("instagram")}
              className={`w-full flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === "instagram"
                  ? "bg-foreground text-pearl shadow-md"
                  : "bg-pearl hover:bg-rose/40 text-foreground/80"
              }`}
            >
              <Instagram className="h-4.5 w-4.5" /> Instagram Auto-Sync
            </button>

            <button
              onClick={() => setActiveTab("health")}
              className={`w-full flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === "health"
                  ? "bg-foreground text-pearl shadow-md"
                  : "bg-pearl hover:bg-rose/40 text-foreground/80"
              }`}
            >
              <Sparkles className="h-4.5 w-4.5" /> Health & Analytics
            </button>
          </aside>

          {/* Main Dashboard Content */}
          <section className="lg:col-span-10">
            
            {/* TAB 1: Centralized Artist Dashboard & Earnings */}
            {activeTab === "dashboard" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* Metrics Row */}
                <div className="grid sm:grid-cols-3 gap-6">
                  {/* Monthly Earnings Card */}
                  <div className="rounded-[2rem] bg-pearl border border-gold/20 p-6 shadow-soft flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Monthly Earnings</span>
                      <div className="text-3xl font-display text-primary font-bold">₹2,45,000</div>
                      <span className="text-xs text-success font-semibold flex items-center gap-1">
                        +18% vs last month
                      </span>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                      <DollarSign className="h-6 w-6" />
                    </div>
                  </div>

                  {/* Page Views Card */}
                  <div className="rounded-[2rem] bg-pearl border border-gold/20 p-6 shadow-soft flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Profile Views</span>
                      <div className="text-3xl font-display text-foreground font-bold">1,240</div>
                      <span className="text-xs text-success font-semibold flex items-center gap-1">
                        +12% this week
                      </span>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-gold/15 text-gold flex items-center justify-center">
                      <Users className="h-6 w-6" />
                    </div>
                  </div>

                  {/* Conversion Rate Card */}
                  <div className="rounded-[2rem] bg-pearl border border-gold/20 p-6 shadow-soft flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Conversion Rate</span>
                      <div className="text-3xl font-display text-foreground font-bold">8.4%</div>
                      <span className="text-xs text-primary font-semibold">
                        Top 10% in Delhi
                      </span>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center">
                      <Briefcase className="h-6 w-6" />
                    </div>
                  </div>
                </div>

                {/* Earnings Chart Visualizer */}
                <div className="rounded-[2.5rem] bg-pearl border border-border p-6 lg:p-8 shadow-luxe">
                  <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                    <div>
                      <h3 className="font-display text-2xl text-foreground">Earnings & Bookings Tracker</h3>
                      <p className="text-xs text-muted-foreground">Visual analytics of client payouts and deposits</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-3 w-3 rounded-full bg-primary" />
                      <span className="text-xs font-semibold mr-4 text-muted-foreground">Earnings</span>
                      <span className="inline-block h-3 w-3 rounded-full bg-gold-soft" />
                      <span className="text-xs font-semibold text-muted-foreground">Views</span>
                    </div>
                  </div>
                  
                  {/* Custom Simulated Bar Graph */}
                  <div className="h-64 flex items-end gap-3 pt-6 border-b border-border">
                    {[
                      { month: "Jan", earnings: 40, views: 30 },
                      { month: "Feb", earnings: 55, views: 45 },
                      { month: "Mar", earnings: 70, views: 60 },
                      { month: "Apr", earnings: 60, views: 50 },
                      { month: "May", earnings: 85, views: 80 },
                      { month: "Jun", earnings: 100, views: 90 }
                    ].map((bar, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                        <div className="w-full flex justify-center gap-1.5 h-full items-end">
                          {/* Earnings bar */}
                          <div 
                            style={{ height: `${bar.earnings}%` }} 
                            className="w-1/3 bg-primary rounded-t-lg transition-all duration-500 group-hover:opacity-90 relative"
                          >
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-pearl px-2 py-0.5 rounded text-[10px] font-bold z-10 shadow transition-opacity">
                              ₹{(bar.earnings * 2450).toLocaleString()}
                            </div>
                          </div>
                          {/* Views bar */}
                          <div 
                            style={{ height: `${bar.views}%` }} 
                            className="w-1/3 bg-gold-soft rounded-t-lg transition-all duration-500 group-hover:opacity-90 relative"
                          >
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-pearl px-2 py-0.5 rounded text-[10px] font-bold z-10 shadow transition-opacity">
                              {bar.views * 12}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-muted-foreground mt-2">{bar.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Unified Calendar Management */}
            {activeTab === "calendar" && (
              <div className="rounded-[2.5rem] bg-pearl border border-border p-6 lg:p-8 shadow-luxe space-y-8 animate-in fade-in duration-300">
                <div>
                  <h3 className="font-display text-2xl text-foreground mb-1">Unified Calendar Management</h3>
                  <p className="text-sm text-muted-foreground font-serif">
                    Manage blocked dates and view paid bookings directly in a unified monthly grid to prevent double-bookings.
                  </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                  {/* Left Column: Monthly Grid (takes 7 columns) */}
                  <div className="lg:col-span-7 bg-white rounded-3xl border border-border p-6 shadow-soft space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-border pb-4">
                      <button
                        onClick={() => {
                          if (currentMonth === 0) {
                            setCurrentMonth(11);
                            setCurrentYear(prev => prev - 1);
                          } else {
                            setCurrentMonth(prev => prev - 1);
                          }
                        }}
                        className="p-2 rounded-full hover:bg-rose transition-colors cursor-pointer text-primary text-sm font-bold"
                      >
                        &larr; Prev
                      </button>
                      <h4 className="font-display text-lg text-primary font-bold">
                        {monthNames[currentMonth]} {currentYear}
                      </h4>
                      <button
                        onClick={() => {
                          if (currentMonth === 11) {
                            setCurrentMonth(0);
                            setCurrentYear(prev => prev + 1);
                          } else {
                            setCurrentMonth(prev => prev + 1);
                          }
                        }}
                        className="p-2 rounded-full hover:bg-rose transition-colors cursor-pointer text-primary text-sm font-bold"
                      >
                        Next &rarr;
                      </button>
                    </div>

                    {/* Weekdays Row */}
                    <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-muted-foreground">
                      <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                    </div>

                    {/* Grid Days */}
                    <div className="grid grid-cols-7 gap-2">
                      {(() => {
                        const daysInMonthVal = getDaysInMonth(currentMonth, currentYear);
                        const firstDayIdx = getFirstDayOfMonth(currentMonth, currentYear);
                        const elements = [];

                        // Empty cells before start of month
                        for (let i = 0; i < firstDayIdx; i++) {
                          elements.push(<div key={`empty-${i}`} className="aspect-square" />);
                        }

                        // Day cells
                        for (let day = 1; day <= daysInMonthVal; day++) {
                          const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
                          
                          // Check blocked dates
                          const isBlocked = blockedDates.find(d => d.date === dateStr);
                          
                          // Check paid bookings
                          const isBooked = bookingsList.find(b => b.date === dateStr);

                          elements.push(
                            <button
                              key={`day-${day}`}
                              onClick={() => {
                                setNewBlockDate(dateStr);
                                if (isBlocked) {
                                  toast.info(`Blocked Date: "${isBlocked.label}"`);
                                } else if (isBooked) {
                                  toast.info(`Booking: "${isBooked.clientName} - ${isBooked.service}"`);
                                } else {
                                  toast.success(`Selected ${dateStr} for manual block.`);
                                }
                              }}
                              className={`aspect-square rounded-2xl text-xs font-bold flex flex-col items-center justify-between p-1.5 relative border transition-all hover:scale-105 cursor-pointer ${
                                isBlocked
                                  ? "bg-rose border-red-200 text-primary shadow-sm"
                                  : isBooked
                                  ? "bg-gold-soft/20 border-gold/40 text-primary shadow-sm"
                                  : "bg-pearl border-border/40 hover:bg-rose/40 text-foreground"
                              }`}
                            >
                              <span className="self-start">{day}</span>
                              <div className="w-full flex flex-col gap-0.5 mt-1 overflow-hidden pointer-events-none">
                                {isBlocked && (
                                  <span className="text-[7px] font-sans font-bold bg-primary text-pearl px-1 rounded-sm block truncate leading-tight">
                                    Blocked
                                  </span>
                                )}
                                {isBooked && (
                                  <span className="text-[7px] font-sans font-bold bg-gold text-pearl px-1 rounded-sm block truncate leading-tight">
                                    Booked
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        }

                        return elements;
                      })()}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground border-t border-border/50 pt-4 mt-2">
                      <div className="flex items-center gap-1.5">
                        <div className="h-3 w-3 rounded bg-pearl border border-border" />
                        <span>Available</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="h-3 w-3 rounded bg-rose border border-red-200" />
                        <span>Blocked Out</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="h-3 w-3 rounded bg-gold-soft/20 border border-gold/40" />
                        <span>Paid Booking</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Block Form & Blocked Dates List (takes 5 columns) */}
                  <div className="lg:col-span-5 space-y-6">
                    {/* Block Date Form */}
                    <form onSubmit={handleAddBlockDate} className="bg-white border border-border rounded-3xl p-6 shadow-soft space-y-4">
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b pb-2">Manual Block Tool</h4>
                      
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground">Select Wedding/Event Date</label>
                        <input
                          type="date"
                          required
                          value={newBlockDate}
                          onChange={(e) => setNewBlockDate(e.target.value)}
                          className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary transition-all text-foreground"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground">Event / Client Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g., Deepika Weds Ranveer"
                          value={newBlockLabel}
                          onChange={(e) => setNewBlockLabel(e.target.value)}
                          className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary transition-all text-foreground"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full rounded-full bg-foreground py-3 text-xs font-semibold text-pearl hover:bg-primary transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Plus className="h-4 w-4" /> Block Date on Platform
                      </button>
                    </form>

                    {/* Blocked Dates List */}
                    <div className="bg-white border border-border rounded-3xl p-6 shadow-soft space-y-4">
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b pb-2">Currently Blocked Dates</h4>
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {blockedDates.length > 0 ? (
                          blockedDates.map((block) => (
                            <div key={`${block.date}-${block.label}`} className="flex items-center justify-between rounded-2xl border border-border/80 bg-pearl p-3 shadow-sm hover:border-gold/30 transition-all text-left">
                              <div>
                                <div className="text-xs font-bold text-foreground truncate max-w-[160px]">{block.label}</div>
                                <div className="text-[10px] text-muted-foreground font-medium mt-0.5">{block.date}</div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveBlockDate(block.date)}
                                className="rounded-full px-3 py-1.5 text-[10px] font-bold bg-rose hover:bg-rose/85 text-primary transition-colors cursor-pointer"
                              >
                                Unblock
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-muted-foreground text-center py-4">No blocked dates.</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2.5: Bookings & Customers Directory */}
            {activeTab === "bookings" && (
              <div className="rounded-[2.5rem] bg-pearl border border-border p-6 lg:p-8 shadow-luxe space-y-8 animate-in fade-in duration-300 text-left">
                <div>
                  <h3 className="font-display text-2xl text-foreground mb-1">Bookings & Customers Directory</h3>
                  <p className="text-sm text-muted-foreground font-serif">
                    Monitor, filter, and manage all your active bridal appointments, deposits, and client statuses.
                  </p>
                </div>

                <div className="overflow-x-auto rounded-3xl border border-border bg-white shadow-soft">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-rose/10 text-[10px] uppercase font-bold tracking-widest text-primary">
                        <th className="px-6 py-4">Client Name</th>
                        <th className="px-6 py-4">Event Date</th>
                        <th className="px-6 py-4">Service</th>
                        <th className="px-6 py-4">Location</th>
                        <th className="px-6 py-4 text-right">Amount</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60 text-xs font-serif text-muted-foreground">
                      {bookingsList.map((booking) => (
                        <tr key={booking.id} className="hover:bg-ivory/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-foreground font-display text-sm">{booking.clientName}</td>
                          <td className="px-6 py-4 font-sans font-semibold">{booking.date}</td>
                          <td className="px-6 py-4">{booking.service}</td>
                          <td className="px-6 py-4">{booking.location}</td>
                          <td className="px-6 py-4 text-right font-sans font-bold text-primary">₹{booking.amount.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-block rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${
                              booking.status === "Paid"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-250"
                                : booking.status === "Confirmed"
                                ? "bg-blue-50 text-blue-700 border border-blue-250"
                                : booking.status === "Cancelled"
                                ? "bg-zinc-100 text-zinc-650 border border-zinc-200"
                                : "bg-red-50 text-red-700 border border-red-200"
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center gap-1.5">
                              {booking.status !== "Confirmed" && booking.status !== "Paid" && (
                                <button
                                  onClick={() => {
                                    const updated = bookingsList.map(b => b.id === booking.id ? { ...b, status: "Confirmed" as const } : b);
                                    saveBookings(updated);
                                    toast.success(`Booking for ${booking.clientName} confirmed!`);
                                  }}
                                  className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                                >
                                  Confirm
                                </button>
                              )}
                              {booking.status !== "Cancelled" && (
                                <button
                                  onClick={() => {
                                    const updated = bookingsList.map(b => b.id === booking.id ? { ...b, status: "Cancelled" as const } : b);
                                    saveBookings(updated);
                                    toast.error(`Booking for ${booking.clientName} cancelled.`);
                                  }}
                                  className="rounded-full bg-rose px-2.5 py-1 text-[10px] font-bold text-primary hover:bg-rose/85 transition-colors cursor-pointer"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}


            {/* TAB 3: Tiered Package & Service Builder */}
            {activeTab === "packages" && (
              <div className="rounded-[2.5rem] bg-pearl border border-border p-6 lg:p-8 shadow-luxe space-y-8 animate-in fade-in duration-300">
                <div>
                  <h3 className="font-display text-2xl text-foreground mb-1">Tiered Package & Service Builder</h3>
                  <p className="text-sm text-muted-foreground font-serif">
                    Customize your ceremonial rates dynamically based on wedding peak seasons, weekdays, or specialized event demands.
                  </p>
                </div>

                {/* Adjuster Toggles */}
                <div className="grid sm:grid-cols-2 gap-4 border-b border-border/60 pb-6">
                  {/* Peak Season Boost Toggle */}
                  <div className="rounded-2xl border border-gold/20 bg-rose-glow/5 p-4 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-foreground">Peak Wedding Season Rates</div>
                      <div className="text-[10px] text-muted-foreground">Boost rates by +20% during peak months (Nov - Feb)</div>
                    </div>
                    <button
                      onClick={() => setIsPeakSeasonBoost(!isPeakSeasonBoost)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isPeakSeasonBoost ? "bg-primary" : "bg-muted-foreground/30"
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isPeakSeasonBoost ? "translate-x-6" : "translate-x-1"
                      }`} />
                    </button>
                  </div>

                  {/* Weekday Discount Toggle */}
                  <div className="rounded-2xl border border-gold/20 bg-rose-glow/5 p-4 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-foreground">Weekday Discount (Mon - Thu)</div>
                      <div className="text-[10px] text-muted-foreground">Provide a -10% discount on weekday bookings</div>
                    </div>
                    <button
                      onClick={() => setIsWeekdayDiscount(!isWeekdayDiscount)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isWeekdayDiscount ? "bg-primary" : "bg-muted-foreground/30"
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isWeekdayDiscount ? "translate-x-6" : "translate-x-1"
                      }`} />
                    </button>
                  </div>
                </div>

                {/* Rates Editor Form */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b pb-2">Base Rates Creator</h4>
                    
                    {/* Bridal Rate */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground">Base Bridal Makeup Package (₹)</label>
                      <input
                        type="number"
                        value={baseBridalRate}
                        onChange={(e) => setBaseBridalRate(parseInt(e.target.value, 10) || 0)}
                        className="w-full rounded-2xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-primary transition-all"
                      />
                    </div>

                    {/* Engagement Rate */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground">Base Engagement Package (₹)</label>
                      <input
                        type="number"
                        value={baseEngagementRate}
                        onChange={(e) => setBaseEngagementRate(parseInt(e.target.value, 10) || 0)}
                        className="w-full rounded-2xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-primary transition-all"
                      />
                    </div>

                    {/* Haldi Rate */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground">Base Haldi/Mehendi Package (₹)</label>
                      <input
                        type="number"
                        value={baseHaldiRate}
                        onChange={(e) => setBaseHaldiRate(parseInt(e.target.value, 10) || 0)}
                        className="w-full rounded-2xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  {/* Active Dynamic Rates Display */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b pb-2">Active Rates on Platform</h4>
                    <div className="space-y-3">
                      
                      {/* Bridal active */}
                      <div className="rounded-2xl border border-border bg-white p-4 shadow-sm flex justify-between items-center">
                        <div>
                          <div className="text-xs font-bold text-foreground">Bridal Makeup Package</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">Base: ₹{baseBridalRate.toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary font-display">₹{getCalculatedRate(baseBridalRate).toLocaleString()}</div>
                          <div className="text-[9px] text-muted-foreground">10% Deposit: ₹{Math.round(getCalculatedRate(baseBridalRate) * 0.1).toLocaleString()}</div>
                        </div>
                      </div>

                      {/* Engagement active */}
                      <div className="rounded-2xl border border-border bg-white p-4 shadow-sm flex justify-between items-center">
                        <div>
                          <div className="text-xs font-bold text-foreground">Engagement Makeup Package</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">Base: ₹{baseEngagementRate.toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary font-display">₹{getCalculatedRate(baseEngagementRate).toLocaleString()}</div>
                          <div className="text-[9px] text-muted-foreground">10% Deposit: ₹{Math.round(getCalculatedRate(baseEngagementRate) * 0.1).toLocaleString()}</div>
                        </div>
                      </div>

                      {/* Haldi active */}
                      <div className="rounded-2xl border border-border bg-white p-4 shadow-sm flex justify-between items-center">
                        <div>
                          <div className="text-xs font-bold text-foreground">Haldi / Mehendi Package</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">Base: ₹{baseHaldiRate.toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary font-display">₹{getCalculatedRate(baseHaldiRate).toLocaleString()}</div>
                          <div className="text-[9px] text-muted-foreground">10% Deposit: ₹{Math.round(getCalculatedRate(baseHaldiRate) * 0.1).toLocaleString()}</div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Artist Profile Health & Trend Analytics */}
            {activeTab === "health" && (
              <div className="rounded-[2.5rem] bg-pearl border border-border p-6 lg:p-8 shadow-luxe space-y-8 animate-in fade-in duration-300">
                <div>
                  <h3 className="font-display text-2xl text-foreground mb-1">Profile Health & Trend Analytics</h3>
                  <p className="text-sm text-muted-foreground font-serif">
                    Personalized insights and regional trends to optimize your catalog profile and secure more wedding conversions.
                  </p>
                </div>

                {/* Profile score tracker */}
                <div className="grid sm:grid-cols-3 gap-6 items-center">
                  <div className="sm:col-span-1 text-center p-6 bg-white border border-border rounded-2xl shadow-sm">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Profile Score</div>
                    <div className="relative inline-flex items-center justify-center">
                      {/* Circular Gauge Simulation */}
                      <svg className="w-24 h-24 transform -rotate-90">
                        <circle cx="48" cy="48" r="40" stroke="currentColor" className="text-muted/15" strokeWidth="8" fill="transparent" />
                        <circle cx="48" cy="48" r="40" stroke="currentColor" className="text-primary" strokeWidth="8" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * 84) / 100} fill="transparent" />
                      </svg>
                      <span className="absolute text-2xl font-bold text-foreground">84%</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground font-semibold mt-2">Almost Perfect!</div>
                  </div>

                  {/* Recommendations */}
                  <div className="sm:col-span-2 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Actionable Optimizations</h4>
                    
                    <div className="flex gap-3 rounded-2xl border border-gold/20 bg-rose-glow/5 p-4 items-start">
                      <AlertCircle className="h-5 w-5 text-gold-soft flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-foreground">Add 2 High-Res Bridal Nath Looks</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">Your profile health will reach 100% and unlock the "Brideora Verified Premium" badge.</div>
                      </div>
                    </div>

                    <div className="flex gap-3 rounded-2xl border border-gold/20 bg-rose-glow/5 p-4 items-start">
                      <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-foreground">Trend Alert: Reception Glam in Dwarka</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">"Profiles with 3 more reception looks are getting 40% more clicks in your area right now."</div>
                      </div>
                    </div>

                    <div className="flex gap-3 rounded-2xl border border-gold/20 bg-rose-glow/5 p-4 items-start">
                      <TrendingUp className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-foreground">Winter Season Forecast: Airbrush Demand Up 40%</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">Searches for 'Airbrush Makeup' in your area have increased by 40% for the upcoming winter wedding season. Consider adding an Airbrush package or adjusting winter weekend rates by +15% to capture this demand.</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conversion metrics info */}
                <div className="rounded-2xl border border-border bg-white p-5 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Regional Demand Metrics</h4>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold">Average conversion in Saket</span>
                      <div className="text-lg font-bold text-foreground">5.2%</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold">Your conversion rate</span>
                      <div className="text-lg font-bold text-primary">8.4%</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: Instagram Auto-Sync Integration */}
            {activeTab === "instagram" && (
              <div className="rounded-[2.5rem] bg-pearl border border-border p-6 lg:p-8 shadow-luxe space-y-8 animate-in fade-in duration-300">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="font-display text-2xl text-foreground mb-1">Instagram Auto-Sync Pipeline</h3>
                    <p className="text-sm text-muted-foreground font-serif">
                      Automatically pulls new portfolio images from your social grid onto your Brideora profile.
                    </p>
                  </div>
                  
                  {/* Status Toggle */}
                  <button
                    onClick={() => {
                      setIsInstaSynced(!isInstaSynced);
                      toast.success(isInstaSynced ? "Instagram pipeline paused." : "Instagram pipeline synced successfully.");
                    }}
                    className={`rounded-full px-5 py-2.5 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isInstaSynced ? "bg-success/15 text-success border border-success/35" : "bg-muted-foreground/15 text-muted-foreground border border-transparent"
                    }`}
                  >
                    <Instagram className="h-4 w-4" /> {isInstaSynced ? "Connected & Synced" : "Pause Sync Pipeline"}
                  </button>
                </div>

                {/* Instagram sync controller */}
                {isInstaSynced && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between rounded-2xl bg-ivory border border-border p-4">
                      <div>
                        <div className="text-xs font-bold text-foreground">Synced Account: @glam_by_aanya</div>
                        <div className="text-[10px] text-muted-foreground">Last synchronized: 10 minutes ago</div>
                      </div>
                      <button
                        onClick={handleInstaRefresh}
                        className="rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-pearl hover:bg-primary transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <RefreshCw className="h-3.5 w-3.5" /> Sync Grid Now
                      </button>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Select Sync Photos</span>
                      <p className="text-xs text-muted-foreground">Toggled pictures automatically sync to your Brideora profile gallery.</p>
                      
                      {/* Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {instaGrid.map((pic) => (
                          <div
                            key={pic.id}
                            onClick={() => handleToggleInstaPic(pic.id)}
                            className="relative aspect-square rounded-2xl overflow-hidden border border-border cursor-pointer group shadow-sm"
                          >
                            <img src={pic.url} alt="Insta Grid" className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                            
                            {/* Sync Status Badge overlay */}
                            <div className={`absolute bottom-3 right-3 rounded-full px-2 py-1 text-[9px] font-bold flex items-center gap-1 shadow ${
                              pic.synced ? "bg-primary text-pearl" : "bg-white text-muted-foreground"
                            }`}>
                              {pic.synced ? (
                                <>Synced <CheckCircle className="h-3 w-3" /></>
                              ) : (
                                "Paused"
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Automated Portfolio Tagging Panel */}
                <div className="border-t border-border/60 pt-8 mt-8 space-y-6">
                  <div>
                    <h4 className="font-display text-2xl text-foreground flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" /> AI Automated Portfolio Tagging
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 font-serif">
                      Upload a new portfolio photo. Our face-analysis model will automatically extract traits and generate tags (#HDMakeup, #RedLip) to save you data entry.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Upload Card */}
                    <div className="rounded-2xl border border-dashed border-border p-6 bg-pearl/40 flex flex-col items-center justify-center min-h-[220px]">
                      {taggingImage ? (
                        <div className="relative w-full max-w-[200px] aspect-square rounded-2xl overflow-hidden shadow">
                          <img src={taggingImage} alt="Tagging upload" className="h-full w-full object-cover" />
                          <button
                            onClick={() => { setTaggingImage(null); setGeneratedTags([]); }}
                            className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/60 text-white hover:bg-primary transition-colors flex items-center justify-center text-sm cursor-pointer"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center text-center space-y-2">
                          <div className="h-12 w-12 rounded-full bg-rose flex items-center justify-center text-primary text-xl">
                            📸
                          </div>
                          <div>
                            <span className="text-xs font-bold text-primary hover:underline">Click to upload photo</span>
                            <p className="text-[10px] text-muted-foreground mt-1">Accepts PNG, JPG up to 10MB</p>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handlePortfolioTaggingUpload}
                          />
                        </label>
                      )}
                    </div>

                    {/* AI Tagging Controls */}
                    <div className="space-y-4">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">AI Face-Analysis Status</h5>
                      
                      {analyzingImage ? (
                        <div className="rounded-2xl border border-border bg-white p-5 flex flex-col items-center justify-center space-y-3 min-h-[140px]">
                          <RefreshCw className="h-8 w-8 text-primary animate-spin" />
                          <span className="text-xs font-semibold text-muted-foreground font-serif">Mapping facial landmarks & skin tones...</span>
                        </div>
                      ) : taggingImage && generatedTags.length > 0 ? (
                        <div className="space-y-4">
                          <div className="rounded-2xl border border-border bg-white p-4 space-y-3">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Generated Tags</span>
                            <div className="flex flex-wrap gap-1.5">
                              {generatedTags.map((tag) => (
                                <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-rose text-primary px-3 py-1 text-xs font-semibold border border-gold/10">
                                  {tag}
                                  <button
                                    onClick={() => handleRemoveGeneratedTag(tag)}
                                    className="hover:text-foreground text-[10px] ml-0.5 cursor-pointer font-bold"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Add Custom Tag Form */}
                          <form onSubmit={handleAddCustomTag} className="flex gap-2">
                            <input
                              type="text"
                              value={customTagInput}
                              onChange={(e) => setCustomTagInput(e.target.value)}
                              placeholder="Add custom tag (e.g. #DewyLook)..."
                              className="flex-1 rounded-full border border-border bg-white px-4 py-2 text-xs outline-none focus:border-primary transition-all text-foreground"
                            />
                            <button
                              type="submit"
                              className="rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-pearl hover:bg-primary transition-colors cursor-pointer"
                            >
                              Add
                            </button>
                          </form>

                          {/* Save Button */}
                          <button
                            onClick={handleSaveTaggedImage}
                            className="w-full rounded-full bg-gradient-royal py-3 text-xs font-semibold text-pearl hover:shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <Sparkles className="h-3.5 w-3.5" /> Save Photo with Tags
                          </button>
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-border bg-white p-5 text-center text-xs text-muted-foreground flex items-center justify-center min-h-[140px] font-serif">
                          Upload a portfolio image above to start AI automatic tagging.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "inbox" && (
              <div className="rounded-[2.5rem] bg-pearl border border-border p-6 lg:p-8 shadow-luxe space-y-8 animate-in fade-in duration-300 text-left">
                <div>
                  <h3 className="font-display text-2xl text-foreground mb-1">AI Inbox Auto-Responder</h3>
                  <p className="text-sm text-muted-foreground font-serif">
                    Review and approve auto-generated draft replies for client inquiries based on your calendar and rates.
                  </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                  {/* Left Column: Inquiry list (takes 4 columns) */}
                  <div className="lg:col-span-4 bg-white rounded-3xl border border-border p-4 shadow-soft space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2 px-2">Inquiries Queue</span>
                    <div className="space-y-2">
                      {inquiries.map((inq) => (
                        <button
                          key={inq.id}
                          onClick={() => setActiveInquiryId(inq.id)}
                          className={`w-full rounded-2xl p-3 border transition-all text-left flex flex-col gap-1 cursor-pointer ${
                            activeInquiryId === inq.id
                              ? "border-primary bg-rose-glow/10 shadow-sm"
                              : "border-border/60 hover:bg-rose/40"
                          }`}
                        >
                          <div className="flex justify-between items-center w-full">
                            <span className="font-display text-sm font-semibold text-primary">{inq.clientName}</span>
                            <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              inq.status === "Pending" ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            }`}>
                              {inq.status}
                            </span>
                          </div>
                          <span className="text-[10px] text-muted-foreground font-serif">{inq.service}</span>
                          <span className="text-[9px] text-muted-foreground font-sans font-medium">{inq.date}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: AI Drafting & Details (takes 8 columns) */}
                  <div className="lg:col-span-8 space-y-6">
                    {(() => {
                      const activeInq = inquiries.find(i => i.id === activeInquiryId);
                      if (!activeInq) return <div className="text-center py-8 text-xs text-muted-foreground">Select an inquiry to view details.</div>;

                      return (
                        <div className="bg-white border border-border rounded-3xl p-6 shadow-soft space-y-4">
                          <div className="flex justify-between items-center border-b border-border pb-3">
                            <div>
                              <h4 className="font-display text-lg font-bold text-primary">{activeInq.clientName}</h4>
                              <p className="text-[10px] text-muted-foreground font-serif uppercase tracking-wider">{activeInq.location} • Squad size: {activeInq.squadCount}</p>
                            </div>
                            <span className="bg-primary/10 text-primary text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-gold/10">
                              Inquiry
                            </span>
                          </div>

                          <div className="bg-rose/40 border border-gold/15 rounded-2xl p-4 space-y-1">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">Received Message</span>
                            <p className="text-xs text-foreground font-serif italic leading-relaxed">
                              "{activeInq.message}"
                            </p>
                          </div>

                          {/* Template Selector */}
                          <div className="space-y-2">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">Select AI Reply Tone Template</span>
                            <div className="flex gap-2">
                              {[
                                { id: "professional", label: "Polite & Professional" },
                                { id: "urgency", label: "Urgency / High Demand" },
                                { id: "discount", label: "Discount / Bundle Offer" }
                              ].map((t) => (
                                <button
                                  key={t.id}
                                  type="button"
                                  onClick={() => setSelectedTemplate(t.id as any)}
                                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                                    selectedTemplate === t.id
                                      ? "bg-primary text-white shadow-soft"
                                      : "bg-rose text-primary hover:bg-rose/80"
                                  }`}
                                >
                                  {t.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Suggested reply box */}
                          <div className="rounded-2xl border border-primary/30 bg-pearl/30 p-5 space-y-3 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-primary/15 text-primary text-[8px] uppercase tracking-widest font-bold px-3 py-1 rounded-bl-xl border-l border-b border-primary/20">
                              AI Suggested Response
                            </div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-primary block font-semibold">Suggested Response Editor</span>
                            
                            <textarea
                              value={editableDraft}
                              onChange={(e) => setEditableDraft(e.target.value)}
                              className="w-full min-h-[140px] rounded-xl border border-border bg-white p-3.5 text-xs text-foreground font-serif leading-relaxed outline-none focus:border-primary transition-all resize-none text-foreground"
                            />

                            <div className="flex gap-3 justify-end pt-2">
                              <button 
                                type="button"
                                onClick={() => {
                                  console.log("Reset Draft clicked for activeInq:", activeInq);
                                  toast.info("Draft reset to template values.");
                                  setEditableDraft(getDraftText(activeInq, selectedTemplate));
                                }}
                                className="rounded-full border border-border bg-white px-5 py-2 text-xs font-semibold text-foreground hover:bg-ivory transition-colors cursor-pointer"
                              >
                                Reset Draft
                              </button>
                              <button 
                                type="button"
                                onClick={() => {
                                  console.log("Approve & Send Draft clicked for activeInq:", activeInq);
                                  // Mark inquiry replied
                                  const updatedInqs = inquiries.map(i => 
                                    i.id === activeInq.id ? { ...i, status: "Replied" as const } : i
                                  );
                                  saveInquiries(updatedInqs);

                                  // Append to bookings
                                  const baseRate = activeInq.service.includes("Airbrush") ? baseBridalRate + 5000 : baseBridalRate;
                                  const groupDiscount = activeInq.squadCount >= 3 ? 0.9 : 1.0;
                                  const squadPrice = activeInq.squadCount * 6000 * groupDiscount;
                                  const totalPrice = baseRate + squadPrice;

                                  const newB = {
                                    id: `b-${Date.now()}`,
                                    clientName: activeInq.clientName,
                                    date: activeInq.date,
                                    service: activeInq.service,
                                    location: activeInq.location,
                                    amount: totalPrice,
                                    status: "Confirmed" as const
                                  };

                                  const updated = [...bookingsList, newB];
                                  saveBookings(updated);

                                  toast.success(`AI Response Sent! Booking for ${activeInq.clientName} created successfully.`);
                                }}
                                className="rounded-full bg-gradient-royal px-5 py-2 text-xs font-semibold text-pearl hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
                              >
                                <Send className="h-3.5 w-3.5" /> Approve & Send Draft
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: Edit Public Profile Settings */}
            {activeTab === "profile" && (
              <div className="rounded-[2.5rem] bg-pearl border border-border p-6 lg:p-8 shadow-luxe space-y-8 animate-in fade-in duration-300 text-left">
                <div>
                  <h3 className="font-display text-2xl text-foreground mb-1">Edit Public Profile Details</h3>
                  <p className="text-sm text-muted-foreground font-serif">
                    Update your public portfolio info, packages, Instagram handle, and vanity brands.
                  </p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(profile); }} className="space-y-6 bg-white border border-border rounded-3xl p-6 lg:p-8 shadow-soft">
                  
                  {/* Row 1: Name, Studio & Location */}
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground">Artist Public Name</label>
                      <input
                        type="text"
                        required
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full rounded-2xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-primary transition-all text-foreground"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground">Studio Name</label>
                      <input
                        type="text"
                        required
                        value={profile.studioName}
                        onChange={(e) => setProfile({ ...profile, studioName: e.target.value })}
                        className="w-full rounded-2xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-primary transition-all text-foreground"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground">Location Base</label>
                      <input
                        type="text"
                        required
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        className="w-full rounded-2xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-primary transition-all text-foreground"
                      />
                    </div>
                  </div>

                  {/* Row 2: Bio & Travel Radius */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground">Travel Policy (e.g. Travels globally)</label>
                      <input
                        type="text"
                        required
                        value={profile.travelRadius}
                        onChange={(e) => setProfile({ ...profile, travelRadius: e.target.value })}
                        className="w-full rounded-2xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-primary transition-all text-foreground"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground">Instagram Username (without @)</label>
                      <input
                        type="text"
                        required
                        value={profile.instagram}
                        onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                        className="w-full rounded-2xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-primary transition-all text-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Bio Description</label>
                    <textarea
                      required
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className="w-full min-h-[90px] rounded-2xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-primary transition-all text-foreground font-serif resize-none"
                    />
                  </div>

                  {/* Pricing Editor */}
                  <div className="space-y-3 border-t border-border pt-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Service Packages Pricing</h4>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground">Base Bridal Package (₹)</label>
                        <input
                          type="number"
                          required
                          value={profile.packages.bridal}
                          onChange={(e) => setProfile({
                            ...profile,
                            packages: { ...profile.packages, bridal: parseInt(e.target.value, 10) || 0 }
                          })}
                          className="w-full rounded-2xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-primary transition-all text-foreground"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground">Base Engagement Package (₹)</label>
                        <input
                          type="number"
                          required
                          value={profile.packages.engagement}
                          onChange={(e) => setProfile({
                            ...profile,
                            packages: { ...profile.packages, engagement: parseInt(e.target.value, 10) || 0 }
                          })}
                          className="w-full rounded-2xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-primary transition-all text-foreground"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground">Base Haldi Package (₹)</label>
                        <input
                          type="number"
                          required
                          value={profile.packages.haldi}
                          onChange={(e) => setProfile({
                            ...profile,
                            packages: { ...profile.packages, haldi: parseInt(e.target.value, 10) || 0 }
                          })}
                          className="w-full rounded-2xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-primary transition-all text-foreground"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Brand & Hygiene checklists */}
                  <div className="grid md:grid-cols-2 gap-8 border-t border-border pt-4">
                    {/* Brand Checklist */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Vanity Cosmetics Kit</h4>
                      <p className="text-[10px] text-muted-foreground">Select brands visible on your public portfolio page.</p>
                      <div className="grid grid-cols-2 gap-2">
                        {["Charlotte Tilbury", "MAC Cosmetics", "Huda Beauty", "NARS", "Dior Beauty", "Estee Lauder", "Chanel", "Fenty Beauty"].map(brand => {
                          const hasBrand = profile.brands.includes(brand);
                          return (
                            <label key={brand} className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={hasBrand}
                                onChange={() => {
                                  const updated = hasBrand ? profile.brands.filter((b: string) => b !== brand) : [...profile.brands, brand];
                                  setProfile({ ...profile, brands: updated });
                                }}
                                className="accent-primary"
                              />
                              {brand}
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Hygiene Checklist */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Hygiene Checklist</h4>
                      <p className="text-[10px] text-muted-foreground">Toggle verification checklist indicators.</p>
                      <div className="grid grid-cols-2 gap-2">
                        {["Sanitized Brushes", "Disposable Spoolies", "Disinfected Vanity Kit", "PPE & Masks", "Air Purifiers", "Single-use sponges"].map(item => {
                          const hasItem = profile.hygiene.includes(item);
                          return (
                            <label key={item} className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={hasItem}
                                onChange={() => {
                                  const updated = hasItem ? profile.hygiene.filter((h: string) => h !== item) : [...profile.hygiene, item];
                                  setProfile({ ...profile, hygiene: updated });
                                }}
                                className="accent-primary"
                              />
                              {item}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Profile and Cover Photo Upload Previews */}
                  <div className="grid md:grid-cols-3 gap-6 border-t border-border pt-4">
                    {/* Profile Pic Upload */}
                    <div className="space-y-2 text-left">
                      <span className="text-xs font-semibold text-muted-foreground block">Profile Headshot</span>
                      <div className="flex items-center gap-3">
                        <div className="h-14 w-14 rounded-full overflow-hidden border border-border bg-pearl flex-shrink-0">
                          {profile.profilePic ? (
                            <img src={profile.profilePic} alt="Profile preview" className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground font-serif">Empty</div>
                          )}
                        </div>
                        <label className="cursor-pointer bg-pearl border border-border hover:bg-rose/40 rounded-full px-4 py-2 text-[10px] font-bold text-foreground">
                          Upload Headshot
                          <input type="file" accept="image/*" className="hidden" onChange={handleProfilePicUpload} />
                        </label>
                      </div>
                    </div>

                    {/* Cover Pic Upload */}
                    <div className="space-y-2 text-left">
                      <span className="text-xs font-semibold text-muted-foreground block">Backdrop Cover Photo</span>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-20 rounded-lg overflow-hidden border border-border bg-pearl flex-shrink-0">
                          {profile.coverPic ? (
                            <img src={profile.coverPic} alt="Cover preview" className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-[10px] text-muted-foreground font-serif">Empty</div>
                          )}
                        </div>
                        <label className="cursor-pointer bg-pearl border border-border hover:bg-rose/40 rounded-full px-4 py-2 text-[10px] font-bold text-foreground">
                          Upload Cover
                          <input type="file" accept="image/*" className="hidden" onChange={handleCoverPicUpload} />
                        </label>
                      </div>
                    </div>

                    {/* New Portfolio Photo Upload */}
                    <div className="space-y-2 text-left">
                      <span className="text-xs font-semibold text-muted-foreground block">Add to Public Gallery</span>
                      <label className="cursor-pointer bg-pearl border border-dashed border-border hover:bg-rose/40 rounded-2xl p-4 flex flex-col items-center justify-center text-[10px] font-bold text-foreground text-center">
                        📸 Click to Upload Photo
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              if (event.target?.result) {
                                setProfile(prev => ({
                                  ...prev,
                                  portfolioPics: [event.target.result as string, ...prev.portfolioPics]
                                }));
                                toast.success("Photo added to public portfolio gallery!");
                              }
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Save Changes Button */}
                  <div className="border-t border-border pt-6 flex justify-end">
                    <button
                      type="submit"
                      className="rounded-full bg-gradient-royal px-8 py-3 text-xs font-bold text-pearl hover:shadow transition-all cursor-pointer uppercase tracking-wider"
                    >
                      Save Profile & Publish
                    </button>
                  </div>
                </form>
              </div>
            )}

          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
