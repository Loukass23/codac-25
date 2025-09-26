import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { CodacLogo } from "@/components/codac-brand/codac-logo";
import { cn } from "@/lib/utils";

const brandHeaderVariants = cva(
    "flex items-center gap-4",
    {
        variants: {
            variant: {
                default: "",
                gradient: "bg-gradient-codac-soft p-6 rounded-lg",
                diamond: "bg-gradient-codac p-8 rounded-xl shadow-lg",
                minimal: "border-b border-codac-pink/20 pb-4",
            },
            size: {
                sm: "py-2",
                md: "py-4",
                lg: "py-6",
                xl: "py-8",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "md",
        },
    }
);

export interface BrandHeaderProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof brandHeaderVariants> {
    title?: string;
    subtitle?: string;
    showLogo?: boolean;
    logoSize?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
}

const BrandHeader = React.forwardRef<HTMLDivElement, BrandHeaderProps>(
    ({ className, variant, size, title, subtitle, showLogo = true, logoSize = "md", ...props }, ref) => (
        <div
            ref={ref}
            className={cn(brandHeaderVariants({ variant, size, className }))}
            {...props}
        >
            {showLogo && (
                <div className="flex-shrink-0">
                    <CodacLogo
                        size={logoSize}
                        useGradient={variant === "gradient" || variant === "diamond"}
                    />
                </div>
            )}
            {(title || subtitle) && (
                <div className="flex-1">
                    {title && (
                        <h1 className={cn(
                            "font-codac-brand font-bold tracking-tight uppercase",
                            variant === "diamond" && "text-white text-3xl",
                            variant === "gradient" && "text-2xl",
                            !variant && "text-2xl"
                        )}>
                            {title}
                        </h1>
                    )}
                    {subtitle && (
                        <p className={cn(
                            "mt-1 text-sm",
                            variant === "diamond" && "text-white/90",
                            variant === "gradient" && "text-muted-foreground",
                            !variant && "text-muted-foreground"
                        )}>
                            {subtitle}
                        </p>
                    )}
                </div>
            )}
        </div>
    )
);
BrandHeader.displayName = "BrandHeader";

export { BrandHeader, brandHeaderVariants };
