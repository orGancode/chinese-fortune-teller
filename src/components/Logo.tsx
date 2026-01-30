import { Sparkles, Star } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  animated?: boolean;
  showSlogan?: boolean;
}

const sizeConfig = {
  sm: { icon: 20, text: "text-sm", container: "gap-1.5" },
  md: { icon: 28, text: "text-lg", container: "gap-2" },
  lg: { icon: 36, text: "text-xl", container: "gap-2.5" },
  xl: { icon: 48, text: "text-2xl", container: "gap-3" },
};

export function Logo({ size = "md", showText = true, animated = true, showSlogan = true }: LogoProps) {
  const config = sizeConfig[size];

  return (
    <div className={`flex items-center ${config.container}`}>
      <div
        className={`relative group cursor-pointer ${
          animated ? "animate-float" : ""
        }`}
        style={{ color: "var(--color-accent)" }}
      >
        <div
          className="relative rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110"
          style={{
            width: config.icon + 10,
            height: config.icon + 10,
            background: "linear-gradient(135deg, var(--color-accent) 0%, var(--color-gold) 100%)",
          }}
        >
          <Sparkles
            size={config.icon}
            color="white"
            strokeWidth={2}
            className="transition-transform duration-500 group-hover:rotate-180"
          />
          <div className="absolute -top-1 -right-1">
            <Star
              size={config.icon * 0.4}
              color="var(--color-gold)"
              fill="var(--color-gold)"
              className="animate-pulse-soft"
            />
          </div>
        </div>
        {animated && (
          <div
            className="absolute -inset-3 rounded-full opacity-15 shimmer"
            style={{
              background: "linear-gradient(90deg, transparent, var(--color-gold), transparent)",
            }}
          />
        )}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-bold tracking-wide gradient-text ${config.text}`}
          >
            易知命理
          </span>
          {showSlogan && size !== "sm" && (
            <span
              className="text-xs opacity-50 -mt-0.5 transition-opacity duration-300 hover:opacity-80"
              style={{ color: "var(--color-text-muted)" }}
            >
              传统智慧 · 现代演绎
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export function LogoIcon({ size = 32 }: { size?: number }) {
  return (
    <div
      className="relative group cursor-pointer animate-float"
      style={{ color: "var(--color-accent)" }}
    >
      <div
        className="relative rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110"
        style={{
          width: size + 10,
          height: size + 10,
          background: "linear-gradient(135deg, var(--color-accent) 0%, var(--color-gold) 100%)",
        }}
      >
        <Sparkles
          size={size}
          color="white"
          strokeWidth={2}
          className="transition-transform duration-500 group-hover:rotate-180"
        />
        <div className="absolute -top-1 -right-1 opacity-80">
          <Star
            size={size * 0.35}
            color="var(--color-gold)"
            fill="var(--color-gold)"
            className="animate-pulse-soft"
          />
        </div>
      </div>
      <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}

export function LogoCompact({ size = 24 }: { size?: number }) {
  return (
    <div
      className="relative animate-float"
      style={{ color: "var(--color-accent)" }}
    >
      <div
        className="rounded-lg flex items-center justify-center shadow-md"
        style={{
          width: size + 6,
          height: size + 6,
          background: "linear-gradient(135deg, var(--color-accent) 0%, var(--color-gold) 100%)",
        }}
      >
        <Sparkles size={size} color="white" strokeWidth={2} />
      </div>
    </div>
  );
}
