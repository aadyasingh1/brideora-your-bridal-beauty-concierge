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
    links: ["About", "For Artists", "Bridal Concierge", "Inspiration", "Blog", "Press"],
  },
  {
    title: "Support",
    links: ["Help Centre", "Contact", "Privacy", "Terms", "Refunds", "Trust & Safety"],
  },
];

interface FooterProps {
  onServiceClick?: (service: string) => void;
  onLocationClick?: (location: string) => void;
  onInfoClick?: (type: string) => void;
  onSignInClick?: (tab?: "login" | "signup", role?: "user" | "artist") => void;
}

export function Footer({ onServiceClick, onLocationClick, onInfoClick, onSignInClick }: FooterProps) {
  const handleLinkClick = (e: React.MouseEvent, colTitle: string, link: string) => {
    e.preventDefault();
    if (colTitle === "Services") {
      onServiceClick?.(link);
    } else if (colTitle === "Locations") {
      onLocationClick?.(link);
    } else if (colTitle === "Brideora") {
      if (link === "Bridal Concierge") {
        window.dispatchEvent(new CustomEvent("open-concierge"));
      } else if (link === "For Artists") {
        onSignInClick?.("signup", "artist");
      } else if (link === "About") {
        document.getElementById("top")?.scrollIntoView({ behavior: "smooth" });
      } else if (link === "Inspiration") {
        document.getElementById("inspiration")?.scrollIntoView({ behavior: "smooth" });
      } else {
        onInfoClick?.(link.toLowerCase());
      }
    } else if (colTitle === "Support") {
      onInfoClick?.(link.toLowerCase());
    }
  };

  return (
    <footer className="bg-foreground text-pearl">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <LogoLockup size="md" />
            <p className="mt-5 text-lg text-pearl/70 font-serif max-w-md leading-relaxed">
              India's hyperlocal bridal beauty marketplace. Discover, compare and book trusted artists in under five minutes.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="https://instagram.com/brideora"
                target="_blank"
                rel="noreferrer"
                className="h-11 w-11 rounded-full bg-pearl/10 hover:bg-gradient-gold transition-colors flex items-center justify-center cursor-pointer"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com/brideora"
                target="_blank"
                rel="noreferrer"
                className="h-11 w-11 rounded-full bg-pearl/10 hover:bg-gradient-gold transition-colors flex items-center justify-center cursor-pointer"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="mailto:support@brideora.com"
                className="h-11 w-11 rounded-full bg-pearl/10 hover:bg-gradient-gold transition-colors flex items-center justify-center cursor-pointer"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {cols.map((c) => (
              <div key={c.title}>
                <div className="font-display text-xl text-gold-soft">{c.title}</div>
                <ul className="mt-4 space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l}>
                      <a
                        href={`#${l.toLowerCase().replace(/\s+/g, "-")}`}
                        onClick={(e) => handleLinkClick(e, c.title, l)}
                        className="text-lg text-pearl/70 hover:text-pearl transition-colors cursor-pointer"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-pearl/15 flex flex-wrap items-center justify-between gap-4 text-base text-pearl/60">
          <div>© {new Date().getFullYear()} Brideora. Crafted with love in Delhi.</div>
          <div>Made for India's brides.</div>
        </div>
      </div>
    </footer>
  );
}
