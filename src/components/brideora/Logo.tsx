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
  const dim = size === "sm" ? "h-14 w-14" : size === "lg" ? "h-24 w-24" : "h-[64px] w-[64px]";
  const text = size === "sm" ? "text-[26px]" : size === "lg" ? "text-[44px]" : "text-[32px]";
  return (
    <div className="flex items-center gap-2">
      <Logo className={dim} />
      <span className={`font-display ${text} text-primary tracking-tight`}>
        Brideora
      </span>
    </div>
  );
}
