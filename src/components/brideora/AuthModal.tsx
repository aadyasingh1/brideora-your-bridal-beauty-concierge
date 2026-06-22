import { useState } from "react";
import { X, Mail, Phone, Lock, Sparkles, User, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "login" | "signup";
  initialRole?: "user" | "artist";
}

export function AuthModal({ isOpen, onClose, initialTab = "login", initialRole = "user" }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">(initialTab);
  const [role, setRole] = useState<"user" | "artist">(initialRole);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      toast.success("Demo OTP sent! Use verification code '123456'.");
    }, 800);
  };

  const triggerUserReturnWebhook = async (userEmail: string, userName: string) => {
    try {
      await fetch("/api/n8n/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "notification",
          path: "user-return",
          data: {
            userEmail,
            userName,
            role,
            timestamp: new Date().toISOString(),
          },
        }),
      });
      console.log("User Return webhook triggered successfully");
    } catch (err) {
      console.error("Failed to trigger User Return webhook:", err);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== "123456") {
      toast.error("Invalid verification code. Use '123456' for testing.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const label = role === "artist" ? "Artist Partner" : "Client";
      toast.success(`Success! Logged in as ${label}.`);
      triggerUserReturnWebhook(phone + "@brideora-mobile.com", label);
      onClose();
    }, 800);
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "login") {
      if (!email || !password) {
        toast.error("Please enter email and password.");
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        toast.success(`Welcome back! Logged in successfully.`);
        triggerUserReturnWebhook(email, email.split("@")[0]);
        onClose();
      }, 800);
    } else {
      if (!name || !email || !password) {
        toast.error("Please fill in all registration fields.");
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        toast.success(`Welcome to Brideora, ${name}! Your account is ready.`);
        triggerUserReturnWebhook(email, name);
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-[2.5rem] bg-pearl border border-gold/20 p-8 shadow-luxe animate-in fade-in zoom-in-95 duration-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 rounded-full p-2 text-muted-foreground hover:bg-rose hover:text-foreground transition-all cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-6">
          <div className="divider-ornament text-[10px] uppercase tracking-[0.25em] text-gold-soft mb-2">
            Secure Portal
          </div>
          <h3 className="font-display text-3xl text-foreground">
            {activeTab === "login" ? "Welcome Back" : "Join Brideora"}
          </h3>
          <p className="text-sm text-muted-foreground font-serif mt-1">
            {activeTab === "login" 
              ? "Access your dashboard, booking requests and profile."
              : "Discover elite artists or grow your bridal business."
            }
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex rounded-full bg-ivory p-1 border border-border/80 mb-6">
          <button
            onClick={() => { setActiveTab("login"); setOtpSent(false); }}
            className={`flex-1 rounded-full py-2 text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "login" 
                ? "bg-gradient-royal text-primary-foreground shadow" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setActiveTab("signup"); setOtpSent(false); }}
            className={`flex-1 rounded-full py-2 text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "signup" 
                ? "bg-gradient-royal text-primary-foreground shadow" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Selector (Role Choice) */}
        {activeTab === "signup" && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => setRole("user")}
              className={`rounded-2xl border p-3.5 text-center transition-all cursor-pointer ${
                role === "user" 
                  ? "border-primary bg-rose/20 text-primary" 
                  : "border-border bg-white text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="h-5 w-5 mx-auto mb-1.5" />
              <div className="text-xs font-semibold">I am a Bride / Client</div>
            </button>
            <button
              onClick={() => setRole("artist")}
              className={`rounded-2xl border p-3.5 text-center transition-all cursor-pointer ${
                role === "artist" 
                  ? "border-primary bg-rose/20 text-primary" 
                  : "border-border bg-white text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="h-5 w-5 mx-auto mb-1.5" />
              <div className="text-xs font-semibold">I am an Artist / Salon</div>
            </button>
          </div>
        )}

        {/* Mobile OTP Flow */}
        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Mobile Number</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-sm font-medium text-muted-foreground">+91</span>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="9876543210"
                  className="w-full rounded-2xl border border-border bg-white pl-14 pr-4 py-2.5 text-sm outline-none focus:border-primary transition-all"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-gradient-royal py-3.5 text-sm font-semibold text-primary-foreground shadow-soft hover:shadow-luxe transition-all flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
            >
              <Phone className="h-4 w-4" />
              {isLoading ? "Sending OTP..." : "Get OTP via SMS"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Enter Verification Code</label>
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-[10px] font-bold text-primary hover:underline"
                >
                  Change Number
                </button>
              </div>
              <div className="relative flex items-center">
                <ShieldCheck className="absolute left-3.5 h-4 w-4 text-muted-foreground/60" />
                <input
                  type="text"
                  required
                  pattern="[0-9]{6}"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  className="w-full rounded-2xl border border-border bg-white pl-10 pr-4 py-2.5 text-sm tracking-[0.25em] font-semibold outline-none focus:border-primary transition-all text-center"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-gradient-royal py-3.5 text-sm font-semibold text-primary-foreground shadow-soft hover:shadow-luxe transition-all flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
            >
              {isLoading ? "Verifying..." : "Verify & Continue"}
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-border/80"></div>
          </div>
          <span className="relative bg-pearl px-3 text-xs text-muted-foreground font-serif">Or continue with Email</span>
        </div>

        {/* Email Credentials Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          {activeTab === "signup" && (
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Full Name</label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 h-4 w-4 text-muted-foreground/60" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sophia Sen"
                  className="w-full rounded-2xl border border-border bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 h-4 w-4 text-muted-foreground/60" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sophia@example.com"
                className="w-full rounded-2xl border border-border bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 h-4 w-4 text-muted-foreground/60" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-border bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full border border-primary text-primary hover:bg-rose/10 py-3 text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
          >
            {activeTab === "login" 
              ? (isLoading ? "Logging in..." : "Login with Email") 
              : (isLoading ? "Creating Account..." : "Create Account with Email")
            }
          </button>
        </form>
      </div>
    </div>
  );
}
