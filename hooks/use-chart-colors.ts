'use client';

import { useEffect, useState } from 'react';

type ChartColors = {
    chart1: string;
    chart2: string;
    chart3: string;
    chart4: string;
    chart5: string;
    primary: string;
    background: string;
    foreground: string;
    muted: string;
    mutedForeground: string;
    border: string;
};

/**
 * Hook to get theme-aware chart colors from CSS variables
 * Returns computed OKLCH values that work with Recharts
 */
export function useChartColors(): ChartColors {
    const [colors, setColors] = useState<ChartColors>({
        chart1: 'oklch(0.646 0.222 41.116)',
        chart2: 'oklch(0.6 0.118 184.704)',
        chart3: 'oklch(0.398 0.07 227.392)',
        chart4: 'oklch(0.828 0.189 84.429)',
        chart5: 'oklch(0.769 0.188 70.08)',
        primary: 'oklch(0.21 0.006 285.885)',
        background: 'oklch(1 0 0)',
        foreground: 'oklch(0.141 0.005 285.823)',
        muted: 'oklch(0.967 0.001 286.375)',
        mutedForeground: 'oklch(0.552 0.016 285.938)',
        border: 'oklch(0.92 0.004 286.32)',
    });

    useEffect(() => {
        // Get computed styles from document root
        const updateColors = () => {
            const root = document.documentElement;
            const computedStyle = getComputedStyle(root);

            setColors({
                chart1: computedStyle.getPropertyValue('--chart-1').trim() || colors.chart1,
                chart2: computedStyle.getPropertyValue('--chart-2').trim() || colors.chart2,
                chart3: computedStyle.getPropertyValue('--chart-3').trim() || colors.chart3,
                chart4: computedStyle.getPropertyValue('--chart-4').trim() || colors.chart4,
                chart5: computedStyle.getPropertyValue('--chart-5').trim() || colors.chart5,
                primary: computedStyle.getPropertyValue('--primary').trim() || colors.primary,
                background: computedStyle.getPropertyValue('--background').trim() || colors.background,
                foreground: computedStyle.getPropertyValue('--foreground').trim() || colors.foreground,
                muted: computedStyle.getPropertyValue('--muted').trim() || colors.muted,
                mutedForeground: computedStyle.getPropertyValue('--muted-foreground').trim() || colors.mutedForeground,
                border: computedStyle.getPropertyValue('--border').trim() || colors.border,
            });
        };

        // Initial update
        updateColors();

        // Listen for theme changes (class changes on html element)
        const observer = new MutationObserver(updateColors);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class', 'data-theme'],
        });

        return () => observer.disconnect();
    }, []);

    return colors;
}

