import React from "react";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export default function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div {...props} className={`rounded-md border border-gray-200 bg-white p-4 shadow-sm ${className}`}>
      {children}
    </div>
  );
}
