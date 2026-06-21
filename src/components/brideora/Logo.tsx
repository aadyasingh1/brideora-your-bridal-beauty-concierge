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
  const dim = size === "sm" ? "h-11 w-11" : size === "lg" ? "h-18 w-18" : "h-[50px] w-[50px]";
  const text = size === "sm" ? "text-[22px]" : size === "lg" ? "text-[36px]" : "text-[26px]";
  return (
    <div className="flex items-center gap-2">
      <Logo className={dim} />
      <span className={`font-display ${text} text-primary tracking-tight`}>
        Brideora
      </span>
    </div>
  );
}
