import { useState, useEffect, useRef } from "react";
import { Sparkles, Send, X, MessageCircle, Calendar } from "lucide-react";

interface Message {
  sender: "user" | "bot";
  text: string;
  action?: {
    label: string;
    payload: any;
    type: "booking" | "navigation";
  };
}

const chips = [
  "Under ₹15k in Dwarka",
  "HD makeup for reception",
  "Mehendi artist in Rohini",
  "Pastel bridal look",
];

const mockArtists = {
  dwarka: {
    name: "Aanya Kapoor",
    speciality: "HD Bridal Makeup",
    location: "Dwarka, Delhi",
    price: "₹18,000",
    rating: 4.9,
    reviews: 124,
    badge: "Top Rated",
  },
  saket: {
    name: "Meher Studio",
    speciality: "Airbrush & Engagement",
    location: "Saket, South Delhi",
    price: "₹22,000",
    rating: 4.8,
    reviews: 98,
    badge: "Verified",
  },
  rohini: {
    name: "Riya Sehgal",
    speciality: "Hair Styling & Updos",
    location: "Rohini, Delhi",
    price: "₹9,500",
    rating: 4.9,
    reviews: 156,
    badge: "Premium",
  }
};

export function AIChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Namaste! I am your Brideora Concierge. Tell me your wedding date, venue, budget, or preferred look, and I'll match you with the perfect artists instantly!",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Listen to remote trigger event
  useEffect(() => {
    const handleOpenConcierge = (e: Event) => {
      const customEvent = e as CustomEvent;
      setOpen(true);
      if (customEvent.detail?.query) {
        handleSendMessage(customEvent.detail.query);
      }
    };
    window.addEventListener("open-concierge", handleOpenConcierge);
    return () => window.removeEventListener("open-concierge", handleOpenConcierge);
  }, []);

  const generateResponse = (userText: string): Message => {
    const text = userText.toLowerCase();
    
    if (text.includes("dwarka") || text.includes("aanya")) {
      return {
        sender: "bot",
        text: "Lovely! In Dwarka, I highly recommend Aanya Kapoor. She is a Top-Rated specialist in HD Bridal Makeup, starting from ₹18,000. She has high customer reviews (4.9⭐). Would you like to check her booking availability?",
        action: {
          label: "Book Aanya Kapoor",
          payload: mockArtists.dwarka,
          type: "booking"
        }
      };
    }
    
    if (text.includes("saket") || text.includes("meher") || text.includes("south delhi")) {
      return {
        sender: "bot",
        text: "Perfect! In Saket/South Delhi, Meher Studio is an excellent choice for Airbrush & Engagement makeup, starting from ₹22,000. Verified rating: 4.8⭐. Would you like to lock in your date with her?",
        action: {
          label: "Book Meher Studio",
          payload: mockArtists.saket,
          type: "booking"
        }
      };
    }
    
    if (text.includes("rohini") || text.includes("riya") || text.includes("hair") || text.includes("styling")) {
      return {
        sender: "bot",
        text: "Great styling search! In Rohini, Riya Sehgal is a Premium hair and bridal styling expert, starting at just ₹9,500. She has 156+ reviews (4.9⭐). Would you like to book a deposit reservation with Riya?",
        action: {
          label: "Book Riya Sehgal",
          payload: mockArtists.rohini,
          type: "booking"
        }
      };
    }

    if (text.includes("pastel") || text.includes("reception") || text.includes("look")) {
      return {
        sender: "bot",
        text: "For a modern pastel or reception bridal look, soft HD makeup by Aanya Kapoor or airbrush glam by Meher Studio matches beautifully. I can initiate a deposit booking for either artist!",
        action: {
          label: "View Featured Artists",
          payload: "vendors",
          type: "navigation"
        }
      };
    }

    return {
      sender: "bot",
      text: "I've searched our directory of 850+ artists. I recommend starting with our featured experts: Aanya Kapoor (Dwarka - ₹18k), Meher Studio (Saket - ₹22k), or Riya Sehgal (Rohini - ₹9.5k). What neighborhood or price level fits you best?",
      action: {
        label: "Browse All Featured",
        payload: "vendors",
        type: "navigation"
      }
    };
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInput("");
    setIsTyping(true);

    // Simulate concierge typing response
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, generateResponse(text)]);
    }, 900);
  };

  const handleActionClick = (action: Message["action"]) => {
    if (!action) return;
    if (action.type === "booking") {
      // Dispatch global booking trigger
      window.dispatchEvent(
        new CustomEvent("open-booking-modal", {
          detail: { vendor: action.payload }
        })
      );
      setOpen(false);
    } else if (action.type === "navigation") {
      const el = document.getElementById(action.payload);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      setOpen(false);
    }
  };

  return (
    <>
      {/* Floating Chat Widget */}
      {open && (
        <div className="fixed bottom-20 right-6 w-96 max-w-[calc(100vw-2rem)] rounded-[2.5rem] bg-pearl p-2 shadow-luxe border border-gold/30 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="rounded-[2.1rem] bg-ivory p-6 h-[500px] flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-gradient-gold flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-pearl animate-pulse" />
                </div>
                <div>
                  <div className="font-display text-base text-primary">Brideora Concierge</div>
                  <div className="text-[11px] text-muted-foreground">Live · responds instantly</div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 my-4 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
              {messages.map((m, i) => (
                <div key={i} className="space-y-2">
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      m.sender === "user"
                        ? "ml-auto bg-gradient-royal text-primary-foreground rounded-tr-sm"
                        : "bg-pearl border border-border text-foreground rounded-tl-sm"
                    }`}
                    dangerouslySetInnerHTML={{ __html: m.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                  />
                  {m.sender === "bot" && m.action && (
                    <div className="pl-2">
                      <button
                        onClick={() => handleActionClick(m.action)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-foreground hover:bg-primary text-pearl text-xs font-semibold px-4 py-2 shadow-soft transition-all cursor-pointer"
                      >
                        <Calendar className="h-3.5 w-3.5" />
                        {m.action.label}
                      </button>
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="bg-pearl border border-border text-foreground rounded-2xl rounded-tl-sm max-w-[50px] px-3.5 py-2.5 flex justify-center gap-1 items-center">
                  <span className="h-1.5 w-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-1.5 w-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-1.5 w-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* suggestion Chips & Input */}
            <div className="space-y-3">
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-1.5">
                  {chips.map((c) => (
                    <button
                      key={c}
                      onClick={() => handleSendMessage(c)}
                      className="rounded-full border border-gold/50 bg-pearl px-3 py-1.5 text-xs text-primary hover:bg-rose transition-colors cursor-pointer"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
              
              <div className="flex items-center gap-2 rounded-full border border-border bg-pearl px-4 py-2.5">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage(input)}
                  placeholder="Ask about your bridal look..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60 text-foreground"
                />
                <button
                  onClick={() => handleSendMessage(input)}
                  className="h-8 w-8 rounded-full bg-gradient-royal flex items-center justify-center text-pearl hover:shadow-luxe transition-all cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        data-ai-chat-trigger
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-royal flex items-center justify-center text-pearl shadow-luxe hover:shadow-luxe transition-all z-50 cursor-pointer ${
          open ? "hidden" : ""
        }`}
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </>
  );
}
