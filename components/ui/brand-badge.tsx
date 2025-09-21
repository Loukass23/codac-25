import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/utils";

const brandBadgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
                secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
                outline: "text-foreground",
                gradient: "border-transparent bg-gradient-codac text-white shadow-sm",
                pink: "border-transparent bg-codac-pink text-white hover:bg-codac-pink-dark",
                teal: "border-transparent bg-codac-teal text-white hover:bg-codac-teal-dark",
                outlinePink: "border-codac-pink text-codac-pink hover:bg-codac-pink hover:text-white",
                outlineTeal: "border-codac-teal text-codac-teal hover:bg-codac-teal hover:text-white",
                soft: "border-transparent bg-codac-pink/10 text-codac-pink hover:bg-codac-pink/20",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface BrandBadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof brandBadgeVariants> { }

function BrandBadge({ className, variant, ...props }: BrandBadgeProps) {
    return (
        <div className={cn(brandBadgeVariants({ variant }), className)} {...props} />
    );
}

export { BrandBadge, brandBadgeVariants };
