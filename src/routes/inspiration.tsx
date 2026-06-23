import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/brideora/Navbar";
import { Footer } from "@/components/brideora/Footer";
import { Inspiration } from "@/components/brideora/Inspiration";
import { useState } from "react";
import { AuthModal } from "@/components/brideora/AuthModal";
import { InfoModal } from "@/components/brideora/InfoModal";

export const Route = createFileRoute("/inspiration")({
  head: () => ({
    meta: [
      { title: "Brideora Inspiration Hub — Latest Bridal Trends" },
      { name: "description", content: "Explore verified bridal hair styling, HD makeup, and traditional lehenga inspirations saved by Delhi brides." },
    ],
  }),
  component: InspirationHubPage,
});

function InspirationHubPage() {
  const [authModal, setAuthModal] = useState<{ open: boolean; tab: "login" | "signup"; role: "user" | "artist" }>({
    open: false,
    tab: "login",
    role: "user"
  });
  const [infoModal, setInfoModal] = useState<{ open: boolean; type: string }>({ open: false, type: "" });

  const handleSignInClick = (tab?: "login" | "signup", role?: "user" | "artist") => {
    setAuthModal({
      open: true,
      tab: tab || "login",
      role: role || "user"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSignInClick={handleSignInClick} />
      <main className="py-12">
        <div className="mx-auto max-w-7xl px-6 text-left mb-6">
          <div className="divider-ornament text-xs uppercase tracking-[0.3em] text-gold-soft mb-2">Shop the Look</div>
          <h1 className="font-display text-4xl sm:text-5xl text-foreground">Inspiration Hub</h1>
          <p className="text-sm font-serif text-muted-foreground mt-1 max-w-xl">
            Browse real, unedited portfolios and saved bridal looks trending this season across Delhi NCR.
          </p>
        </div>
        <Inspiration />
      </main>
      <Footer 
        onServiceClick={() => {}} 
        onLocationClick={() => {}} 
        onInfoClick={(type) => setInfoModal({ open: true, type })}
        onSignInClick={handleSignInClick}
      />
      <AuthModal
        isOpen={authModal.open}
        onClose={() => setAuthModal({ ...authModal, open: false })}
        initialTab={authModal.tab}
        initialRole={authModal.role}
      />
      <InfoModal
        isOpen={infoModal.open}
        onClose={() => setInfoModal({ ...infoModal, open: false })}
        type={infoModal.type}
      />
    </div>
  );
}
