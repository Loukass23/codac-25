import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const brandButtonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-gradient-codac text-white hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-200",
                outline: "border-2 border-codac-pink text-codac-pink hover:bg-codac-pink hover:text-white transition-all duration-200",
                ghost: "text-codac-pink hover:bg-codac-pink/10 hover:text-codac-pink-dark transition-all duration-200",
                gradient: "bg-gradient-codac-horizontal text-white hover:shadow-lg hover:shadow-codac-pink/25 transition-all duration-300 animate-gradient-shift",
                teal: "bg-codac-teal text-white hover:bg-codac-teal-dark transition-all duration-200",
                pink: "bg-codac-pink text-white hover:bg-codac-pink-dark transition-all duration-200",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface BrandButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof brandButtonVariants> {
    asChild?: boolean;
}

const BrandButton = React.forwardRef<HTMLButtonElement, BrandButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(brandButtonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
BrandButton.displayName = "BrandButton";

export { BrandButton, brandButtonVariants };
