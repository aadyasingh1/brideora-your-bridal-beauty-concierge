import { useState, useEffect, useRef } from "react";
import { 
  Menu, X, Sparkles, Heart, MessageSquare, Calendar, ChevronDown, 
  LogOut, User, Settings, Send, Trash2, ShieldCheck, CheckCircle2, MessageCircle
} from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogoLockup } from "./Logo";
import { vendors, slugify } from "./FeaturedVendors";
import { toast } from "sonner";

interface NavbarProps {
  onSignInClick?: (tab?: "login" | "signup", role?: "user" | "artist") => void;
}

interface Session {
  role: "user" | "artist";
  name: string;
  email: string;
}

interface Booking {
  paymentId: string;
  orderId: string;
  vendorName: string;
  serviceName: string;
  date: string;
  userName: string;
  amount: string;
  timestamp?: string;
}

interface ChatMessage {
  sender: "user" | "artist";
  text: string;
  time: string;
}

export function Navbar({ onSignInClick }: NavbarProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [wishlistedArtists, setWishlistedArtists] = useState<typeof vendors>([]);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  
  // Drawer states
  const [activeDrawer, setActiveDrawer] = useState<"bookings" | "shortlist" | "messages" | null>(null);
  
  // Bookings list state
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Simulated Chat states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const categoriesRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync session and wishlist
  const syncSession = () => {
    const data = localStorage.getItem("brideora-session");
    if (data) {
      try {
        setSession(JSON.parse(data));
      } catch (err) {
        setSession(null);
      }
    } else {
      setSession(null);
    }
  };

  const syncWishlist = () => {
    const list: typeof vendors = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("wishlist-")) {
        const val = localStorage.getItem(key);
        if (val === "true") {
          const artistName = key.replace("wishlist-", "");
          const artist = vendors.find(v => v.name === artistName);
          if (artist) {
            list.push(artist);
          }
        }
      }
    }
    setWishlistedArtists(list);
    setWishlistCount(list.length);
  };

  const syncBookings = () => {
    const saved = localStorage.getItem("brideora-bookings");
    if (saved) {
      try {
        setBookings(JSON.parse(saved));
      } catch (err) {
        setBookings([]);
      }
    } else {
      setBookings([]);
    }
  };

  // Sync session and localstorage dependencies
  useEffect(() => {
    syncSession();
    syncWishlist();
    syncBookings();

    const handleSessionChange = () => {
      syncSession();
      syncBookings();
    };
    
    const handleWishlistChange = () => {
      syncWishlist();
    };

    window.addEventListener("session-changed", handleSessionChange);
    window.addEventListener("wishlist-changed", handleWishlistChange);
    window.addEventListener("storage", handleWishlistChange);

    return () => {
      window.removeEventListener("session-changed", handleSessionChange);
      window.removeEventListener("wishlist-changed", handleWishlistChange);
      window.removeEventListener("storage", handleWishlistChange);
    };
  }, []);

  // Sync and load chat messages from localStorage
  useEffect(() => {
    const savedChat = localStorage.getItem("brideora-chat-aanya");
    if (savedChat) {
      try {
        setChatMessages(JSON.parse(savedChat));
      } catch (err) {
        initDefaultChat();
      }
    } else {
      initDefaultChat();
    }
  }, []);

  const initDefaultChat = () => {
    const defaults: ChatMessage[] = [
      { sender: "artist", text: "Hi! Thanks for reaching out to Brideora. I'd love to help design your dream look. What date is your ceremony?", time: "10:30 AM" },
      { sender: "user", text: "Hi Aanya! It's on December 12th. I want a dewy, minimal aesthetic.", time: "10:32 AM" },
      { sender: "artist", text: "December 12th is available! I specialize in dewy finishes. Have you finalized your outfit color?", time: "10:33 AM" },
      { sender: "user", text: "Yes, it's a traditional ivory and gold lehenga.", time: "10:35 AM" },
      { sender: "artist", text: "Stunning! That will pair beautifully with a soft champagne eye and nude pink lip. Would you like to schedule a trial session?", time: "10:36 AM" }
    ];
    setChatMessages(defaults);
    localStorage.setItem("brideora-chat-aanya", JSON.stringify(defaults));
  };

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

  // Click outside handlers
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setCategoriesOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Hide the consumer navbar entirely if the logged in persona is an Artist
  if (session?.role === "artist") {
    return null;
  }

  const handleConciergeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-concierge"));
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("brideora-session");
    window.dispatchEvent(new CustomEvent("session-changed"));
    setProfileOpen(false);
    toast.success("Successfully logged out.");
    navigate({ to: "/" });
  };

  const toggleWishlistArtist = (name: string) => {
    localStorage.setItem(`wishlist-${name}`, "false");
    window.dispatchEvent(new CustomEvent("wishlist-changed"));
    toast.success(`Removed ${name} from wishlist.`);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMsg: ChatMessage = {
      sender: "user",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [...chatMessages, userMsg];
    setChatMessages(updated);
    localStorage.setItem("brideora-chat-aanya", JSON.stringify(updated));
    setNewMessage("");

    // Trigger simulated artist response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replies = [
        "That sounds like an absolute dream look! Let's connect on a brief video call tomorrow to discuss scheduling the makeup trial. Does 4 PM work for you?",
        "Beautiful choice! The ivory backdrop will really make the warm tones pop. Let me know if you'd like to reserve the slot with a 20% booking deposit.",
        "I'm so excited for this! For ivory outfits, I also suggest adding some fresh baby's breath to the hair updo. Should we add hair styling to your package?",
        "Wonderful! I've marked December 12th tentatively in my calendar. I'll send over my formal contract and details for the trial booking shortly."
      ];
      const replyText = replies[Math.floor(Math.random() * replies.length)];
      const artistMsg: ChatMessage = {
        sender: "artist",
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const finalMsgs = [...updated, artistMsg];
      setChatMessages(finalMsgs);
      localStorage.setItem("brideora-chat-aanya", JSON.stringify(finalMsgs));
    }, 1500);
  };

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-pearl/80 border-b border-border/60">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          
          {/* Left: Brand Identity */}
          <Link to="/" className="flex items-center shrink-0">
            <LogoLockup size="sm" />
          </Link>

          {/* Center: Consumer Discovery Links */}
          <div className="hidden lg:flex items-center gap-8 font-serif">
            <a
              href="#ai"
              onClick={handleConciergeClick}
              className="flex items-center gap-1.5 text-base font-semibold text-primary hover:text-vermillion transition-colors cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-gold fill-gold/20" />
              Concierge / AI Matcher
            </a>

            <Link
              to="/inspiration"
              className="text-base font-semibold text-foreground/80 hover:text-primary transition-colors"
            >
              Inspiration Hub
            </Link>

            {/* Categories Dropdown */}
            <div className="relative" ref={categoriesRef}>
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="flex items-center gap-1 text-base font-semibold text-foreground/80 hover:text-primary transition-colors cursor-pointer"
              >
                Categories
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${categoriesOpen ? "rotate-180" : ""}`} />
              </button>

              {categoriesOpen && (
                <div className="absolute left-0 mt-3 w-64 rounded-2xl bg-pearl border border-gold/15 p-2 shadow-luxe animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link
                    to="/artists"
                    search={{ specialty: "Bridal Makeup" }}
                    onClick={() => setCategoriesOpen(false)}
                    className="block rounded-xl px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-rose/40 hover:text-primary transition-colors"
                  >
                    Bridal Makeup
                  </Link>
                  <Link
                    to="/artists"
                    search={{ specialty: "Pre-Bridal Wellness & Grooming" }}
                    onClick={() => setCategoriesOpen(false)}
                    className="block rounded-xl px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-rose/40 hover:text-primary transition-colors"
                  >
                    Pre-Bridal Wellness
                  </Link>
                  <Link
                    to="/artists"
                    search={{ specialty: "Bridal Squad Services" }}
                    onClick={() => setCategoriesOpen(false)}
                    className="block rounded-xl px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-rose/40 hover:text-primary transition-colors"
                  >
                    Squad Styling
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right: Actions & Supply Side */}
          <div className="hidden lg:flex items-center gap-6">
            
            {/* Subtle "For Artists" link (Only shown if NOT logged in) */}
            {!session && (
              <a
                href="#vendor"
                onClick={(e) => {
                  e.preventDefault();
                  onSignInClick?.("signup", "artist");
                }}
                className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors cursor-pointer uppercase tracking-wider"
              >
                For Artists
              </a>
            )}

            {/* Shortlist Heart Icon (Visible for Brides or Logged-out state) */}
            <button
              onClick={() => setActiveDrawer("shortlist")}
              className="relative p-2 text-foreground/80 hover:text-primary hover:bg-rose/40 rounded-full transition-all cursor-pointer"
              title="View Wishlist"
            >
              <Heart className="h-5.5 w-5.5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-in zoom-in">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Session State Switcher */}
            {session ? (
              // Logged In B2C State
              <div className="relative font-serif" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 rounded-full border border-gold/25 p-1 pr-3 bg-pearl hover:bg-rose/20 transition-all cursor-pointer"
                >
                  <div className="h-9 w-9 rounded-full bg-gradient-royal text-primary-foreground flex items-center justify-center font-bold font-sans text-sm shadow-sm">
                    {session.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-foreground max-w-[100px] truncate">
                    {session.name}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-pearl border border-gold/15 p-2 shadow-luxe animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                    <div className="px-4 py-2 border-b border-border/60 mb-1">
                      <p className="text-xs text-muted-foreground">Logged in as</p>
                      <p className="text-sm font-bold truncate text-foreground">{session.name}</p>
                    </div>
                    
                    <button
                      onClick={() => { setActiveDrawer("bookings"); setProfileOpen(false); }}
                      className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-foreground hover:bg-rose/40 hover:text-primary transition-colors cursor-pointer"
                    >
                      <Calendar className="h-4.5 w-4.5 text-muted-foreground" />
                      My Bookings
                    </button>

                    <button
                      onClick={() => { setActiveDrawer("shortlist"); setProfileOpen(false); }}
                      className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-foreground hover:bg-rose/40 hover:text-primary transition-colors cursor-pointer"
                    >
                      <Heart className="h-4.5 w-4.5 text-muted-foreground" />
                      My Shortlist
                    </button>

                    <button
                      onClick={() => { setActiveDrawer("messages"); setProfileOpen(false); }}
                      className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-foreground hover:bg-rose/40 hover:text-primary transition-colors cursor-pointer"
                    >
                      <MessageSquare className="h-4.5 w-4.5 text-muted-foreground" />
                      Messages
                    </button>

                    <hr className="my-1 border-border/60" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                    >
                      <LogOut className="h-4.5 w-4.5" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Logged Out CTA Button
              <button
                onClick={() => onSignInClick?.("login", "user")}
                className="rounded-full bg-gradient-royal px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:shadow-luxe transition-all cursor-pointer font-serif"
              >
                Sign in
              </button>
            )}
          </div>

          {/* Mobile Navigation Trigger */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden rounded-full p-2 hover:bg-rose"
            aria-label="Menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile Dropdown Panel */}
        {open && (
          <div className="lg:hidden border-t border-border/60 bg-pearl animate-in slide-in-from-top duration-200">
            <div className="px-6 py-4 flex flex-col gap-3 font-serif">
              <a
                href="#ai"
                onClick={handleConciergeClick}
                className="inline-flex items-center gap-2 py-2 text-base font-semibold text-primary cursor-pointer"
              >
                <Sparkles className="h-4.5 w-4.5 text-gold" /> Concierge / AI Matcher
              </a>
              
              <Link
                to="/inspiration"
                className="py-2 text-base font-semibold text-foreground/80"
                onClick={() => setOpen(false)}
              >
                Inspiration Hub
              </Link>
              
              <div className="py-2">
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-sans font-bold">Categories</div>
                <div className="pl-4 flex flex-col gap-2">
                  <Link
                    to="/artists"
                    search={{ specialty: "Bridal Makeup" }}
                    className="py-1 text-sm font-semibold text-foreground/80"
                    onClick={() => setOpen(false)}
                  >
                    Bridal Makeup
                  </Link>
                  <Link
                    to="/artists"
                    search={{ specialty: "Pre-Bridal Wellness & Grooming" }}
                    className="py-1 text-sm font-semibold text-foreground/80"
                    onClick={() => setOpen(false)}
                  >
                    Pre-Bridal Wellness
                  </Link>
                  <Link
                    to="/artists"
                    search={{ specialty: "Bridal Squad Services" }}
                    className="py-1 text-sm font-semibold text-foreground/80"
                    onClick={() => setOpen(false)}
                  >
                    Squad Styling
                  </Link>
                </div>
              </div>

              <button
                onClick={() => { setActiveDrawer("shortlist"); setOpen(false); }}
                className="py-2 text-base font-semibold text-foreground/80 flex items-center gap-2 text-left cursor-pointer"
              >
                <Heart className="h-5 w-5 text-primary" /> My Shortlist ({wishlistCount})
              </button>

              {session ? (
                <>
                  <button
                    onClick={() => { setActiveDrawer("bookings"); setOpen(false); }}
                    className="py-2 text-base font-semibold text-foreground/80 flex items-center gap-2 text-left cursor-pointer"
                  >
                    <Calendar className="h-5 w-5 text-muted-foreground" /> My Bookings
                  </button>
                  <button
                    onClick={() => { setActiveDrawer("messages"); setOpen(false); }}
                    className="py-2 text-base font-semibold text-foreground/80 flex items-center gap-2 text-left cursor-pointer"
                  >
                    <MessageSquare className="h-5 w-5 text-muted-foreground" /> Messages
                  </button>
                  <button
                    onClick={handleLogout}
                    className="py-2 mt-2 text-base font-semibold text-destructive flex items-center gap-2 text-left cursor-pointer"
                  >
                    <LogOut className="h-5 w-5" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <a
                    href="#vendor"
                    onClick={(e) => {
                      e.preventDefault();
                      onSignInClick?.("signup", "artist");
                      setOpen(false);
                    }}
                    className="py-2 text-base font-semibold text-muted-foreground cursor-pointer"
                  >
                    For Artists
                  </a>
                  <button
                    onClick={() => {
                      onSignInClick?.("login", "user");
                      setOpen(false);
                    }}
                    className="mt-2 rounded-full bg-gradient-royal px-5 py-3 text-center text-base font-semibold text-primary-foreground cursor-pointer"
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* DRAWERS PANEL */}

      {/* Backdrop */}
      {activeDrawer && (
        <div 
          className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
          onClick={() => setActiveDrawer(null)}
        />
      )}

      {/* Main Drawer Container */}
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-full sm:max-w-md md:max-w-lg bg-pearl border-l border-gold/15 p-0 shadow-luxe transition-transform duration-300 transform flex flex-col ${
          activeDrawer ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-border/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {activeDrawer === "bookings" && <Calendar className="h-5 w-5 text-primary" />}
            {activeDrawer === "shortlist" && <Heart className="h-5 w-5 text-primary fill-primary/10" />}
            {activeDrawer === "messages" && <MessageSquare className="h-5 w-5 text-primary" />}
            <h3 className="font-display text-2xl text-foreground capitalize">
              {activeDrawer === "bookings" && "My Bookings"}
              {activeDrawer === "shortlist" && "My Shortlist"}
              {activeDrawer === "messages" && "Chat Assistant"}
            </h3>
          </div>
          <button
            onClick={() => setActiveDrawer(null)}
            className="p-2 rounded-full hover:bg-rose text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* 1. BOOKINGS DRAWER */}
          {activeDrawer === "bookings" && (
            <div className="space-y-6">
              {bookings.length === 0 ? (
                <div className="text-center py-10 space-y-4">
                  <div className="h-16 w-16 bg-rose/30 rounded-full flex items-center justify-center mx-auto text-primary">
                    <Calendar className="h-8 w-8" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-foreground">No bookings yet</h4>
                  <p className="text-sm text-muted-foreground font-serif max-w-xs mx-auto">
                    You haven't scheduled any appointments. Explore our elite artists to start booking.
                  </p>
                  <button
                    onClick={() => { setActiveDrawer(null); navigate({ to: "/artists" }); }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-gradient-royal px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow transition-all cursor-pointer font-serif"
                  >
                    Browse Artists <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div 
                      key={booking.paymentId} 
                      className="p-5 rounded-2xl bg-white border border-border/80 shadow-soft relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-2.5 h-full bg-gradient-royal" />
                      <div className="flex justify-between items-start mb-3 pl-2">
                        <div>
                          <h4 className="font-serif text-lg font-bold text-foreground">{booking.vendorName}</h4>
                          <p className="text-xs font-semibold text-primary">{booking.serviceName}</p>
                        </div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-success/15 text-[10px] font-bold text-success">
                          <ShieldCheck className="h-3 w-3" /> Confirmed
                        </span>
                      </div>
                      
                      <div className="pl-2 space-y-2 border-t border-dashed border-border/80 pt-3 text-xs text-muted-foreground font-serif">
                        <div className="flex justify-between">
                          <span>Appointment Date:</span>
                          <span className="font-semibold text-foreground">{booking.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Amount Paid:</span>
                          <span className="font-semibold text-foreground font-sans">₹{parseInt(booking.amount).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Receipt ID:</span>
                          <span className="font-mono text-[10px] select-all">{booking.paymentId}</span>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2 pl-2">
                        <button
                          onClick={() => { setActiveDrawer("messages"); }}
                          className="flex-1 rounded-xl bg-rose/40 hover:bg-rose/80 py-2 text-center text-xs font-semibold text-primary transition-all cursor-pointer"
                        >
                          Message Artist
                        </button>
                        <Link
                          to={`/artist/${slugify(booking.vendorName)}`}
                          onClick={() => setActiveDrawer(null)}
                          className="flex-1 rounded-xl border border-border bg-white text-center py-2 text-xs font-semibold text-foreground hover:bg-muted transition-all flex items-center justify-center"
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Sample/Historical Booking to fill space beautifully */}
              <div className="border-t border-border/60 pt-6 mt-6">
                <h5 className="text-[10px] font-bold uppercase tracking-wider text-gold-soft mb-3">Historical / Demo Booking</h5>
                <div className="p-4 rounded-xl bg-white border border-border/50 opacity-70 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold">
                    D
                  </div>
                  <div className="flex-1 min-w-0">
                    <h6 className="text-xs font-bold truncate text-foreground">Divya Sharma Studio</h6>
                    <p className="text-[10px] text-muted-foreground">Pre-Bridal Skincare Package</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Completed on May 15, 2026</p>
                  </div>
                  <span className="text-xs font-bold text-foreground">₹15,000</span>
                </div>
              </div>
            </div>
          )}

          {/* 2. SHORTLIST DRAWER */}
          {activeDrawer === "shortlist" && (
            <div className="space-y-6">
              {wishlistedArtists.length === 0 ? (
                <div className="text-center py-10 space-y-4">
                  <div className="h-16 w-16 bg-rose/30 rounded-full flex items-center justify-center mx-auto text-primary">
                    <Heart className="h-8 w-8" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-foreground">Your shortlist is empty</h4>
                  <p className="text-sm text-muted-foreground font-serif max-w-xs mx-auto">
                    Save profiles of bridal beauty experts to compare services, ratings, and price packages.
                  </p>
                  <button
                    onClick={() => { setActiveDrawer(null); navigate({ to: "/artists" }); }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-gradient-royal px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow transition-all cursor-pointer font-serif"
                  >
                    Explore Artists <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  
                  {/* Dynamic Compare At A Glance Section (When 2+ artists are shortlisted) */}
                  {wishlistedArtists.length >= 2 && (
                    <div className="rounded-2xl border border-gold/20 bg-pearl/40 p-4 shadow-soft">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gold-soft mb-3 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-gold" />
                        Compare At A Glance
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs font-serif">
                          <thead>
                            <tr className="border-b border-border/80">
                              <th className="py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Artist</th>
                              <th className="py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Rating</th>
                              <th className="py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Starting Price</th>
                              <th className="py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Locality</th>
                            </tr>
                          </thead>
                          <tbody>
                            {wishlistedArtists.map((artist) => (
                              <tr key={artist.name} className="border-b border-border/40 hover:bg-rose/10">
                                <td className="py-2 font-bold text-foreground truncate max-w-[100px]">{artist.name}</td>
                                <td className="py-2 font-sans text-foreground">★ {artist.rating}</td>
                                <td className="py-2 font-sans font-semibold text-primary">{artist.price}</td>
                                <td className="py-2 text-muted-foreground truncate max-w-[80px]">{artist.location.split(",")[0]}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* List of Wishlisted Artists */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Saved Artists</h4>
                    {wishlistedArtists.map((artist) => (
                      <div 
                        key={artist.name} 
                        className="flex gap-4 p-4 rounded-2xl bg-white border border-border/60 hover:border-gold/30 shadow-soft transition-all relative group"
                      >
                        {artist.img ? (
                          <img 
                            src={artist.img} 
                            alt={artist.name} 
                            className="h-16 w-16 rounded-xl object-cover shrink-0" 
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-xl bg-rose/30 flex items-center justify-center shrink-0">
                            <User className="h-8 w-8 text-primary" />
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0 font-serif">
                          <h5 className="font-bold text-base text-foreground leading-tight">{artist.name}</h5>
                          <p className="text-xs text-muted-foreground truncate">{artist.speciality}</p>
                          
                          <div className="flex items-center gap-3 mt-1.5 text-xs">
                            <span className="font-sans font-semibold text-primary">{artist.price}</span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground truncate">{artist.location.split(",")[0]}</span>
                          </div>
                        </div>

                        <div className="flex flex-col justify-between items-end shrink-0">
                          <button
                            onClick={() => toggleWishlistArtist(artist.name)}
                            className="p-1.5 rounded-full hover:bg-rose/60 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                            title="Remove from shortlist"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>

                          <Link
                            to={`/artist/${slugify(artist.name)}`}
                            onClick={() => setActiveDrawer(null)}
                            className="text-xs font-bold text-primary hover:underline hover:text-vermillion flex items-center gap-0.5"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. MESSAGES DRAWER */}
          {activeDrawer === "messages" && (
            <div className="flex flex-col h-full -mx-6 -my-6 bg-pearl">
              
              {/* Active Conversation Header */}
              <div className="px-6 py-3 border-b border-border/60 bg-white flex items-center gap-3">
                <div className="relative">
                  <div className="h-9 w-9 rounded-full bg-gradient-royal text-primary-foreground flex items-center justify-center font-bold text-xs">
                    AK
                  </div>
                  <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-success ring-2 ring-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground font-serif leading-tight">Aanya Kapoor</h4>
                  <p className="text-[10px] text-success font-semibold uppercase tracking-wider">Online • Bridal Expert</p>
                </div>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatMessages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                  >
                    <div 
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.sender === "user" 
                          ? "bg-gradient-royal text-primary-foreground rounded-tr-none" 
                          : "bg-white border border-border/80 text-foreground rounded-tl-none"
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                    <span className="text-[9px] text-muted-foreground mt-1 px-1">
                      {msg.time}
                    </span>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex flex-col items-start">
                    <div className="bg-white border border-border/80 text-foreground rounded-2xl rounded-tl-none px-4 py-2.5 text-sm flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce" />
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce delay-150" />
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce delay-300" />
                    </div>
                    <span className="text-[9px] text-muted-foreground mt-1 px-1">Aanya is typing...</span>
                  </div>
                )}
                
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-border/60 flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message to Aanya..."
                  className="flex-1 rounded-full border border-border bg-ivory/40 px-4 py-2.5 text-sm outline-none focus:border-primary transition-all font-serif"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-2.5 rounded-full bg-gradient-royal text-primary-foreground hover:shadow disabled:opacity-50 transition-all cursor-pointer shrink-0"
                >
                  <Send className="h-4.5 w-4.5" />
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

