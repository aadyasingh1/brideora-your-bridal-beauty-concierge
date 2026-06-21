const localities = [
  { name: "Dwarka", count: 142 },
  { name: "Rohini", count: 118 },
  { name: "Saket", count: 96 },
  { name: "Pitampura", count: 87 },
  { name: "Janakpuri", count: 74 },
  { name: "Rajouri Garden", count: 68 },
  { name: "Punjabi Bagh", count: 61 },
  { name: "Lajpat Nagar", count: 58 },
  { name: "Vasant Kunj", count: 52 },
  { name: "Karol Bagh", count: 49 },
  { name: "Model Town", count: 44 },
  { name: "Paschim Vihar", count: 41 },
];

interface LocationsProps {
  onLocationClick?: (loc: string) => void;
}

export function Locations({ onLocationClick }: LocationsProps) {
  return (
    <section id="locations" className="py-20 lg:py-28 bg-gradient-ivory">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="divider-ornament text-xs uppercase tracking-[0.3em] text-gold-soft">Delhi Coverage</div>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl text-foreground">
            From Dwarka to <span className="italic text-gradient-royal">South Delhi</span>
          </h2>
          <p className="mt-4 text-muted-foreground font-serif text-lg">
            Verified artists across every neighbourhood, with home-service availability.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 lg:gap-4">
          {localities.map((l) => (
            <a
              key={l.name}
              href={`#loc-${l.name}`}
              onClick={(e) => {
                e.preventDefault();
                onLocationClick?.(l.name);
              }}
              className="group rounded-2xl border border-border bg-pearl p-5 hover:border-gold hover:shadow-soft transition-all cursor-pointer"
            >
              <div className="font-display text-xl text-foreground group-hover:text-primary transition-colors">
                {l.name}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {l.count} artists
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
