interface Props {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger" | "ghost";
  disabled?: boolean;
  className?: string;
}

// Stilizim me klasa utility të Tailwind (vlerat e temës vijnë nga CSS variables → ruhet dark mode).
const variantClasses: Record<NonNullable<Props["variant"]>, string> = {
  primary: "bg-[var(--accent)] text-white border-0 shadow-[0_12px_26px_-12px_rgba(189,90,45,.7)]",
  secondary: "bg-[var(--surface)] text-[var(--ink)] border border-[var(--border-2)]",
  danger: "bg-[var(--danger)] text-white border-0",
  ghost: "bg-transparent text-[var(--accent)] border border-[var(--accent)]",
};

const Button = ({ text, onClick, type = "button", variant = "primary", disabled = false, className }: Props) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rj-lift rounded-xl px-[22px] py-[13px] text-[14.5px] font-semibold font-[inherit] ${
        disabled ? "cursor-not-allowed opacity-[.55]" : "cursor-pointer opacity-100"
      } ${variantClasses[variant]}${className ? ` ${className}` : ""}`}
    >
      {text}
    </button>
  );
};

export default Button;
