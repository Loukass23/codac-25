import typography from '@tailwindcss/typography';
import type { Config } from "tailwindcss";

export default {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
        "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    plugins: [
        typography,
    ],
    theme: {
        extend: {
            fontFamily: {
                'codac-brand': ['var(--font-codac-brand)'],
            },
            backgroundImage: {
                'gradient-codac': 'linear-gradient(1.66deg, #E77096 1.52%, #52EACE 89.2%)',
                'gradient-codac-horizontal': 'linear-gradient(90deg, #E77096 0%, #52EACE 100%)',
                'gradient-codac-vertical': 'linear-gradient(180deg, #E77096 0%, #52EACE 100%)',
                'gradient-codac-diagonal': 'linear-gradient(135deg, #E77096 0%, #52EACE 100%)',
                'gradient-codac-soft': 'linear-gradient(1.66deg, rgba(231, 112, 150, 0.8) 1.52%, rgba(82, 234, 206, 0.8) 89.2%)',
            },
            colors: {
                'codac-pink': '#E77096',
                'codac-teal': '#52EACE',
                'codac-pink-dark': '#D65A7F',
                'codac-teal-dark': '#3DD4B8',
                'codac-pink-light': '#F4A5C1',
                'codac-teal-light': '#7EE8D6',
            },
            // Line clamp is now built-in to Tailwind CSS v3.3+
        }
    }
} satisfies Config; 