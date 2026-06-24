import i1 from "@/assets/insp-1.jpg";
import i2 from "@/assets/insp-2.jpg";
import i3 from "@/assets/insp-3.jpg";
import i4 from "@/assets/insp-4.jpg";
import hair1 from "@/assets/hair-new-1.jpg";
import hair2 from "@/assets/hair-new-2.jpg";

const items = [
  { src: i1, label: "Red Bridal", span: "row-span-2" },
  { src: i2, label: "Minimal Glam", span: "" },
  { src: hair1, label: "Traditional Braid", span: "" },
  { src: i3, label: "Punjabi Bridal", span: "row-span-2" },
  { src: i4, label: "Reception Look", span: "" },
  { src: hair2, label: "Gajra Braid Glam", span: "" },
];

export function Inspiration() {
  return (
    <section id="inspiration" className="py-20 lg:py-28 bg-ivory">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div className="max-w-xl">
            <div className="divider-ornament text-xs uppercase tracking-[0.3em]">Inspiration</div>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl">
              Bridal looks to <span className="italic text-gradient-royal">save & share</span>
            </h2>
          </div>
          <a href="#all-inspiration" className="text-sm font-medium text-primary hover:underline">
            Explore the inspiration hub →
          </a>
        </div>

        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 grid-rows-2 gap-4 lg:gap-5 auto-rows-[220px] lg:auto-rows-[260px]">
          {items.map((it) => (
            <a
              key={it.label}
              href="#"
              className={`group relative overflow-hidden rounded-2xl shadow-soft ${it.span}`}
            >
              <img
                src={it.src}
                alt={it.label}
                loading="lazy"
                width={800}
                height={1100}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-pearl">
                <div className="font-display text-xl">{it.label}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
