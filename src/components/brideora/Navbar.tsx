import { useState } from "react";
import { Menu, X, Search, Sparkles } from "lucide-react";
import { LogoLockup } from "./Logo";

const links = [
  { label: "Artists", href: "#vendors" },
  { label: "Locations", href: "#locations" },
  { label: "Inspiration", href: "#inspiration" },
  { label: "How it Works", href: "#how" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-pearl/80 border-b border-border/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center">
          <LogoLockup size="sm" />
        </a>

        <div className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href="#ai"
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-primary hover:bg-rose transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            Brideora AI
          </a>
          <a
            href="#vendor"
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            For Artists
          </a>
          <a
            href="#login"
            className="rounded-full bg-gradient-royal px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-soft hover:shadow-luxe transition-all"
          >
            Sign in
          </a>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden rounded-full p-2 hover:bg-rose"
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>
      {open && (
        <div className="lg:hidden border-t border-border/60 bg-pearl">
          <div className="px-6 py-4 flex flex-col gap-3">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="py-2 text-sm font-medium">
                {l.label}
              </a>
            ))}
            <a
              href="#ai"
              className="inline-flex items-center gap-2 py-2 text-sm font-medium text-primary"
            >
              <Sparkles className="h-4 w-4" /> Brideora AI
            </a>
            <a
              href="#login"
              className="mt-2 rounded-full bg-gradient-royal px-5 py-2.5 text-center text-sm font-medium text-primary-foreground"
            >
              Sign in
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
