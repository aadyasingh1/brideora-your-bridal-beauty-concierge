import { Instagram, Facebook, Mail } from "lucide-react";
import { LogoLockup } from "./Logo";

const cols = [
  {
    title: "Services",
    links: ["Bridal Makeup", "Party Makeup", "Hair Styling", "Mehendi", "Nail Art", "Pre-Bridal"],
  },
  {
    title: "Locations",
    links: ["Dwarka", "Rohini", "Saket", "South Delhi", "Pitampura", "Janakpuri"],
  },
  {
    title: "Brideora",
    links: ["About", "For Artists", "Brideora AI", "Inspiration", "Blog", "Press"],
  },
  {
    title: "Support",
    links: ["Help Centre", "Contact", "Privacy", "Terms", "Refunds", "Trust & Safety"],
  },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-pearl">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <LogoLockup size="md" />
            <p className="mt-5 text-sm text-pearl/70 font-serif max-w-sm">
              India's hyperlocal bridal beauty marketplace. Discover, compare and book trusted artists in under five minutes.
            </p>
            <div className="mt-6 flex gap-3">
              {[Instagram, Facebook, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-10 w-10 rounded-full bg-pearl/10 hover:bg-gradient-gold transition-colors flex items-center justify-center"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {cols.map((c) => (
              <div key={c.title}>
                <div className="font-display text-base text-gold-soft">{c.title}</div>
                <ul className="mt-4 space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-sm text-pearl/70 hover:text-pearl">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-pearl/15 flex flex-wrap items-center justify-between gap-4 text-xs text-pearl/60">
          <div>© {new Date().getFullYear()} Brideora. Crafted with love in Delhi.</div>
          <div>Made for India's brides.</div>
        </div>
      </div>
    </footer>
  );
}
