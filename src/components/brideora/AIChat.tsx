import { useState } from "react";
import { Sparkles, Send, X, MessageCircle } from "lucide-react";

const chips = [
  "Under ₹15k in Dwarka",
  "HD makeup for reception",
  "Mehendi artist next Saturday",
  "Pastel bridal look",
];

export function AIChat() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Widget */}
      {open && (
        <div className="fixed bottom-20 right-6 w-96 max-w-[calc(100vw-2rem)] rounded-[2rem] bg-pearl p-2 shadow-luxe border border-gold/30 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="rounded-[1.6rem] bg-ivory p-6 max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-gradient-gold flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-pearl" />
                </div>
                <div>
                  <div className="font-display text-base text-primary">Brideora Concierge</div>
                  <div className="text-[11px] text-muted-foreground">Live · responds instantly</div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="mt-5 space-y-3 flex-1 overflow-y-auto max-h-[400px]">
              <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-gradient-royal px-4 py-3 text-sm text-pearl">
                I'm getting married in March in Dwarka. Budget ₹15,000 for HD makeup.
              </div>
              <div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-pearl border border-border px-4 py-3 text-sm text-foreground">
                Lovely! I found <strong>14 artists</strong> in Dwarka under ₹15k with March availability. Here are the top 3 matches with 4.8+ ratings…
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {chips.map((c) => (
                  <button
                    key={c}
                    className="rounded-full border border-gold/50 bg-pearl px-3 py-1.5 text-xs text-primary hover:bg-rose transition-colors"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="mt-5 flex items-center gap-2 rounded-full border border-border bg-pearl px-4 py-2.5">
              <input
                placeholder="Ask anything about your bridal look…"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
              />
              <button className="h-8 w-8 rounded-full bg-gradient-royal flex items-center justify-center text-pearl hover:shadow-luxe transition-all">
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        data-ai-chat-trigger
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-royal flex items-center justify-center text-pearl shadow-luxe hover:shadow-luxe transition-all z-50 ${
          open ? "hidden" : ""
        }`}
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </>
  );
}
