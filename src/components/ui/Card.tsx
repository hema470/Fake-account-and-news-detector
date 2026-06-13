import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("glass rounded-2xl p-6 shadow-2xl shadow-black/50 relative overflow-hidden", className)}
      {...props}
    />
  )
);
Card.displayName = "Card";
