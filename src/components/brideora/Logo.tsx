import logo from "@/assets/brideora-logo.png";

export function Logo({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <img
      src={logo}
      alt="Brideora"
      className={className}
      width={120}
      height={120}
    />
  );
}

export function LogoLockup({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dim = size === "sm" ? "h-10 w-10" : size === "lg" ? "h-16 w-16" : "h-12 w-12";
  const text = size === "sm" ? "text-xl" : size === "lg" ? "text-3xl" : "text-2xl";
  return (
    <div className="flex items-center gap-2">
      <Logo className={dim} />
      <span className={`font-display ${text} text-primary tracking-tight`}>
        Brideora
      </span>
    </div>
  );
}
