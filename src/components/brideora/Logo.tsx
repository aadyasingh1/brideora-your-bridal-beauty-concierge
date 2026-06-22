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
  const dim = size === "sm" ? "h-16 w-16" : size === "lg" ? "h-[110px] w-[110px]" : "h-[80px] w-[80px]";
  const text = size === "sm" ? "text-[32px]" : size === "lg" ? "text-[54px]" : "text-[40px]";
  return (
    <div className="flex items-center gap-2">
      <Logo className={dim} />
      <span className={`font-display ${text} text-primary tracking-tight`}>
        Brideora
      </span>
    </div>
  );
}
