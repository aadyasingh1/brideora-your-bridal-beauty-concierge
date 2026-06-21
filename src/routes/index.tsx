import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/brideora/Navbar";
import { Hero } from "@/components/brideora/Hero";
import { Categories } from "@/components/brideora/Categories";
import { FeaturedVendors } from "@/components/brideora/FeaturedVendors";
import { Locations } from "@/components/brideora/Locations";
import { HowItWorks } from "@/components/brideora/HowItWorks";
import { AIPreview } from "@/components/brideora/AIPreview";
import { Inspiration } from "@/components/brideora/Inspiration";
import { Testimonials } from "@/components/brideora/Testimonials";
import { FAQ } from "@/components/brideora/FAQ";
import { Footer } from "@/components/brideora/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Brideora — Find Your Perfect Bridal Beauty Expert in Delhi" },
      {
        name: "description",
        content:
          "Discover, compare and book trusted bridal makeup artists, mehendi designers and hair stylists across Delhi. Powered by Brideora AI.",
      },
      { property: "og:title", content: "Brideora — Bridal Beauty Marketplace" },
      {
        property: "og:description",
        content:
          "India's hyperlocal bridal beauty marketplace. Book trusted artists in under 5 minutes.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Categories />
        <FeaturedVendors />
        <Locations />
        <HowItWorks />
        <AIPreview />
        <Inspiration />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
