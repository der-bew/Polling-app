import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "ghost";
};

export default function Button({
  children,
  className = "",
  variant = "default",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none";
  const variantClass =
    variant === "ghost"
      ? "bg-transparent hover:bg-gray-100"
      : "bg-sky-600 text-white hover:bg-sky-700";

  return (
    <button {...props} className={`${base} ${variantClass} ${className}`}>
      {children}
    </button>
  );
}
