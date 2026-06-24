import { useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { LogoLockup } from "./Logo";

const links = [
  { label: "Salons", href: "/salons", isRoute: true },
  { label: "Locations", href: "/#locations", isRoute: false },
  { label: "How it Works", href: "/#how", isRoute: false },
];

interface NavbarProps {
  onSignInClick?: (tab?: "login" | "signup", role?: "user" | "artist") => void;
}

export function Navbar({ onSignInClick }: NavbarProps) {
  const [open, setOpen] = useState(false);

  const handleConciergeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-concierge"));
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-pearl/80 border-b border-border/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2">
        <Link to="/" className="flex items-center">
          <LogoLockup size="sm" />
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {links.map((l) =>
            l.isRoute ? (
              <Link
                key={l.href}
                to={l.href}
                className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.href}
                href={l.href}
                className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {l.label}
              </a>
            )
          )}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <a
            href="#ai"
            onClick={handleConciergeClick}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-lg font-medium text-primary hover:bg-rose transition-colors cursor-pointer"
          >
            <Sparkles className="h-4.5 w-4.5 text-gold" />
            Bridal Concierge
          </a>
          <a
            href="#vendor"
            onClick={(e) => {
              e.preventDefault();
              onSignInClick?.("signup", "artist");
            }}
            className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors cursor-pointer"
          >
            For Artists
          </a>
          <button
            onClick={() => onSignInClick?.("login", "user")}
            className="rounded-full bg-gradient-royal px-6 py-3 text-lg font-medium text-primary-foreground shadow-soft hover:shadow-luxe transition-all cursor-pointer"
          >
            Sign in
          </button>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden rounded-full p-2 hover:bg-rose"
          aria-label="Menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>
      {open && (
        <div className="lg:hidden border-t border-border/60 bg-pearl animate-in slide-in-from-top duration-200">
          <div className="px-6 py-4 flex flex-col gap-3">
            {links.map((l) =>
              l.isRoute ? (
                <Link
                  key={l.href}
                  to={l.href}
                  className="py-2 text-base font-medium"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.href}
                  href={l.href}
                  className="py-2 text-base font-medium"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              )
            )}
            <a
              href="#ai"
              onClick={(e) => {
                handleConciergeClick(e);
                setOpen(false);
              }}
              className="inline-flex items-center gap-2 py-2 text-base font-medium text-primary cursor-pointer"
            >
              <Sparkles className="h-4.5 w-4.5 text-gold" /> Bridal Concierge
            </a>
            <a
              href="#vendor"
              onClick={(e) => {
                e.preventDefault();
                onSignInClick?.("signup", "artist");
                setOpen(false);
              }}
              className="py-2 text-base font-medium text-foreground/80 cursor-pointer"
            >
              For Artists
            </a>
            <button
              onClick={() => {
                onSignInClick?.("login", "user");
                setOpen(false);
              }}
              className="mt-2 rounded-full bg-gradient-royal px-5 py-3 text-center text-base font-medium text-primary-foreground cursor-pointer"
            >
              Sign in
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
