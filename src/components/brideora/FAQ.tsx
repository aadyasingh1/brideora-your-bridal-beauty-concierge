import { Plus } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    q: "How does Brideora verify artists?",
    a: "Every artist on Brideora goes through a 4-step verification: identity & business proof, portfolio review by our editorial team, real-bride reference checks, and an in-person quality audit for Premium listings.",
  },
  {
    q: "Do you offer home bridal services?",
    a: "Yes. Filter for home-service artists across every Delhi locality. Travel charges are shown upfront on each profile — no surprise fees.",
  },
  {
    q: "How does payment work?",
    a: "Pay a small advance to confirm your booking via Razorpay. The balance is paid directly to your artist on the day. Full refund within 48 hours of cancellation per our policy.",
  },
  {
    q: "What is Brideora AI?",
    a: "Our AI bridal concierge powered by Gemini understands your budget, function type, lehenga colour and date, and recommends the best-matched artists, packages and looks.",
  },
  {
    q: "Are you available outside Delhi?",
    a: "Brideora launches in Delhi NCR first, with Mumbai, Bangalore and Hyderabad rolling out through 2026.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-20 lg:py-28 bg-ivory">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <div className="divider-ornament text-xs uppercase tracking-[0.3em]">FAQ</div>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl">
            Questions, <span className="italic text-gradient-royal">answered</span>
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((f, i) => (
            <div
              key={f.q}
              className="rounded-2xl border border-border bg-pearl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left"
              >
                <span className="font-display text-lg text-foreground">{f.q}</span>
                <Plus
                  className={`h-5 w-5 text-primary shrink-0 transition-transform ${
                    open === i ? "rotate-45" : ""
                  }`}
                />
              </button>
              {open === i && (
                <div className="px-6 pb-6 text-muted-foreground leading-relaxed font-serif">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
