import bridal from "@/assets/cat-bridal-makeup.jpg";
import party from "@/assets/cat-party.jpg";
import hair from "@/assets/cat-hair.jpg";
import mehendi from "@/assets/cat-mehendi.jpg";
import nails from "@/assets/cat-nails.jpg";
import prebridal from "@/assets/cat-prebridal.jpg";

const cats = [
  { name: "Bridal Makeup", count: "320+ artists", img: bridal },
  { name: "Party Makeup", count: "180+ artists", img: party },
  { name: "Hair Styling", count: "210+ stylists", img: hair },
  { name: "Mehendi", count: "140+ designers", img: mehendi },
  { name: "Nail Art", count: "90+ artists", img: nails },
  { name: "Pre-Bridal", count: "75+ packages", img: prebridal },
];

export function Categories() {
  return (
    <section className="py-20 lg:py-28 bg-ivory">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="divider-ornament text-xs uppercase tracking-[0.3em]">Services</div>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl text-foreground">
            Every look, <span className="italic text-gradient-royal">one platform</span>
          </h2>
          <p className="mt-4 text-muted-foreground font-serif text-lg">
            From dewy reception glam to intricate mehendi — discover specialists
            curated for every ceremony.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 md:grid-cols-3 gap-5 lg:gap-6">
          {cats.map((c) => (
            <a
              key={c.name}
              href="#vendors"
              className="group relative overflow-hidden rounded-2xl aspect-[4/5] bg-card shadow-soft hover:shadow-luxe transition-all duration-500"
            >
              <img
                src={c.img}
                alt={c.name}
                loading="lazy"
                width={800}
                height={1000}
                className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 lg:p-6 text-pearl">
                <div className="font-display text-xl lg:text-2xl">{c.name}</div>
                <div className="text-xs text-pearl/80 mt-1">{c.count}</div>
              </div>
              <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-pearl/90 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-primary text-sm font-bold">
                →
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
