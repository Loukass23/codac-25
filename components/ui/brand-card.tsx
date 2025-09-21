import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/utils";

const brandCardVariants = cva(
    "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200",
    {
        variants: {
            variant: {
                default: "border-border",
                gradient: "border-transparent bg-gradient-codac-soft shadow-lg hover:shadow-xl",
                outline: "border-codac-pink/20 hover:border-codac-pink/40 hover:shadow-md hover:shadow-codac-pink/10",
                teal: "border-codac-teal/20 bg-codac-teal/5 hover:bg-codac-teal/10",
                pink: "border-codac-pink/20 bg-codac-pink/5 hover:bg-codac-pink/10",
                diamond: "border-transparent bg-gradient-codac shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-transform duration-200 hover-lift brand-shadow",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface BrandCardProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof brandCardVariants> { }

const BrandCard = React.forwardRef<HTMLDivElement, BrandCardProps>(
    ({ className, variant, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(brandCardVariants({ variant, className }))}
            {...props}
        />
    )
);
BrandCard.displayName = "BrandCard";

const BrandCardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
    />
));
BrandCardHeader.displayName = "BrandCardHeader";

const BrandCardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn(
            "text-2xl font-semibold leading-none tracking-tight",
            className
        )}
        {...props}
    />
));
BrandCardTitle.displayName = "BrandCardTitle";

const BrandCardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
));
BrandCardDescription.displayName = "BrandCardDescription";

const BrandCardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
BrandCardContent.displayName = "BrandCardContent";

const BrandCardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
    />
));
BrandCardFooter.displayName = "BrandCardFooter";

export {
    BrandCard,
    BrandCardHeader,
    BrandCardFooter,
    BrandCardTitle,
    BrandCardDescription,
    BrandCardContent,
};
