import { Link } from "react-router-dom";
import type { CSSProperties } from "react";
import logoSrc from "@/assets/frendly-logo.png";

type Size = "sm" | "md" | "lg" | "xl";
type Tone = "light" | "dark";

const sizes: Record<Size, { mark: string; text: string; gap: string; dot: string }> = {
  sm: { mark: "size-8", text: "text-[20px]", gap: "gap-2", dot: "size-1.5" },
  md: { mark: "size-11", text: "text-[26px]", gap: "gap-2.5", dot: "size-2" },
  lg: { mark: "size-16", text: "text-[40px]", gap: "gap-3", dot: "size-2.5" },
  xl: { mark: "size-24", text: "text-[60px]", gap: "gap-4", dot: "size-3" },
};

const wordmarkStyles: Record<Tone, CSSProperties> = {
  light: {
    fontFamily: '"Sora", "Plus Jakarta Sans", system-ui, sans-serif',
    background: "linear-gradient(180deg, #ffffff 0%, #ede9fe 55%, #c4b5fd 100%)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
  },
  dark: {
    fontFamily: '"Sora", "Plus Jakarta Sans", system-ui, sans-serif',
    background: "linear-gradient(180deg, #6d28d9 0%, #4c1d95 58%, #24104f 100%)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
  },
};

export function LogoMark({ size = "md", className = "" }: { size?: Size; className?: string }) {
  const s = sizes[size];
  return (
    <span
      className={"relative inline-block rounded-[28%] overflow-hidden " + s.mark + " " + className}
      aria-hidden
      style={{
        boxShadow:
          "0 10px 28px -10px rgba(124,77,251,.55), 0 0 0 1px rgba(255,255,255,.06)",
      }}
    >
      <img
        src={logoSrc}
        alt=""
        className="absolute inset-0 size-full object-cover"
        draggable={false}
      />
    </span>
  );
}

export function Logo({
  size = "md",
  to,
  className = "",
  showMark = true,
  tone = "light",
}: {
  size?: Size;
  to?: string;
  className?: string;
  showMark?: boolean;
  tone?: Tone;
}) {
  const s = sizes[size];

  const inner = (
    <span className={"inline-flex items-center " + s.gap + " " + className}>
      {showMark && <LogoMark size={size} />}
      <span className="relative inline-flex items-baseline">
        <span
          className={"font-semibold tracking-[-0.045em] leading-none " + s.text}
          style={wordmarkStyles[tone]}
        >
          frendly
        </span>
        <span
          className={"ml-[0.12em] rounded-full bg-lime " + s.dot}
          style={{
            boxShadow: "0 0 12px color-mix(in oklab, var(--color-lime) 70%, transparent)",
          }}
        />
      </span>
    </span>
  );

  if (to) {
    return (
      <Link to={to} aria-label="Frendly">
        {inner}
      </Link>
    );
  }
  return inner;
}
