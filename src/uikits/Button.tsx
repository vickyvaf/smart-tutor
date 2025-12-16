import { cn } from "../lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "indigo" | "yellow";
  children: React.ReactNode;
};

export function Button({
  children,
  className,
  variant = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "px-6 py-2 rounded-xl duration-200 cursor-pointer font-semibold transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
        variant === "default" &&
          "bg-blue-400 text-white shadow-[0_6px_0_#2B6CB0] active:shadow-none active:translate-y-1 disabled:active:translate-y-0 disabled:active:shadow-[0_6px_0_#2B6CB0]",
        variant === "indigo" &&
          "bg-indigo-600 text-white shadow-[0_6px_0_#3730a3] active:shadow-none active:translate-y-1 disabled:active:translate-y-0 disabled:active:shadow-[0_6px_0_#3730a3]",
        variant === "yellow" &&
          "bg-amber-200 text-amber-900 shadow-[0_6px_0_#CA8A04] active:shadow-none active:translate-y-1 disabled:active:translate-y-0 disabled:active:shadow-[0_6px_0_#CA8A04]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
