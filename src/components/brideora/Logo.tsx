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
  const dim = size === "sm" ? "h-20 w-20" : size === "lg" ? "h-[165px] w-[165px]" : "h-[120px] w-[120px]";
  const text = size === "sm" ? "text-[36px]" : size === "lg" ? "text-[80px]" : "text-[60px]";
  return (
    <div className="flex items-center gap-2">
      <Logo className={dim} />
      <span className={`font-display ${text} text-primary tracking-tight`}>
        Brideora
      </span>
    </div>
  );
}
