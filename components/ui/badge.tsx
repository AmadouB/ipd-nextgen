import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-brand-pasteur text-white",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-feedback-danger text-white",
        success: "border-transparent bg-feedback-success text-white",
        warning: "border-transparent bg-feedback-warning text-white",
        outline: "text-foreground",
        soft: "border-transparent bg-brand-pasteur/10 text-brand-pasteur",
        "soft-success": "border-transparent bg-feedback-success/10 text-feedback-success",
        "soft-warning": "border-transparent bg-feedback-warning/10 text-feedback-warning",
        "soft-danger": "border-transparent bg-feedback-danger/10 text-feedback-danger",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
