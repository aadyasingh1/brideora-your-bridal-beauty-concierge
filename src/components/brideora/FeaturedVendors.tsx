import { useState } from "react";
import { Star, MapPin, Award, Heart } from "lucide-react";
import a1 from "@/assets/artist-1.jpg";
import a2 from "@/assets/artist-2.jpg";
import a3 from "@/assets/artist-3.jpg";
import { BookingModal } from "./BookingModal";

const vendors = [
  {
    name: "Aanya Kapoor",
    speciality: "HD Bridal Makeup",
    location: "Dwarka, Delhi",
    price: "₹18,000",
    rating: 4.9,
    reviews: 124,
    img: a1,
    badge: "Top Rated",
  },
  {
    name: "Meher Studio",
    speciality: "Airbrush & Engagement",
    location: "Saket, South Delhi",
    price: "₹22,000",
    rating: 4.8,
    reviews: 98,
    img: a2,
    badge: "Verified",
  },
  {
    name: "Riya Sehgal",
    speciality: "Hair Styling & Updos",
    location: "Rohini, Delhi",
    price: "₹9,500",
    rating: 4.9,
    reviews: 156,
    img: a3,
    badge: "Premium",
  },
];

export function FeaturedVendors() {
  const [selectedVendor, setSelectedVendor] = useState<typeof vendors[0] | null>(null);

  return (
    <section id="vendors" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div className="max-w-xl">
            <div className="divider-ornament text-xs uppercase tracking-[0.3em]">
              Handpicked
            </div>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl text-foreground">
              Featured artists this week
            </h2>
          </div>
          <a href="#all" className="text-sm font-medium text-primary hover:underline">
            View all 850+ artists →
          </a>
        </div>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {vendors.map((v) => (
            <article
              key={v.name}
              className="group rounded-3xl bg-card overflow-hidden shadow-soft hover:shadow-luxe transition-all duration-500 border border-border/60"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={v.img}
                  alt={v.name}
                  loading="lazy"
                  width={800}
                  height={1000}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-pearl/90 backdrop-blur px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                  <Award className="h-3 w-3 text-gold" />
                  {v.badge}
                </div>
                <button
                  className="absolute top-4 right-4 h-9 w-9 rounded-full bg-pearl/90 backdrop-blur flex items-center justify-center hover:bg-pearl transition-colors"
                  aria-label="Save"
                >
                  <Heart className="h-4 w-4 text-primary" />
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-2xl text-foreground">{v.name}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{v.speciality}</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-rose px-2.5 py-1 text-xs font-semibold text-primary">
                    <Star className="h-3 w-3 fill-gold text-gold" />
                    {v.rating}
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> {v.location}
                </div>
                <div className="mt-5 flex items-end justify-between pt-5 border-t border-border">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Starting from</div>
                    <div className="font-display text-2xl text-primary">{v.price}</div>
                  </div>
                  <button
                    onClick={() => setSelectedVendor(v)}
                    className="rounded-full bg-foreground px-5 py-2.5 text-xs font-semibold text-pearl hover:bg-primary transition-colors cursor-pointer"
                  >
                    Book Artist
                  </button>
                </div>
                <div className="mt-3 text-xs text-muted-foreground">{v.reviews} reviews</div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {selectedVendor && (
        <BookingModal
          isOpen={!!selectedVendor}
          onClose={() => setSelectedVendor(null)}
          vendor={selectedVendor}
        />
      )}
    </section>
  );
}
