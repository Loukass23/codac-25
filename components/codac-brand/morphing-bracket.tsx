'use client';

import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

interface MorphingBracketProps {
    className?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '8xl';
    morphType?: 'diamond' | 'angle-bracket' | 'circle' | 'square';
    autoMorph?: boolean;
    morphDuration?: number;
    direction?: 'left' | 'right';
}

const sizeConfig = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
    '2xl': 'w-24 h-24',
    '8xl': 'w-96 h-96',
};

// Shape definitions
const shapes = {
    diamond: {
        left: "M100 20L20 100L100 180L180 100L100 20Z",
        right: "M100 20L180 100L100 180L20 100L100 20Z"
    },
    'angle-bracket': {
        // Original diamond shapes from CodacLeftAngleBracket and CodacRightAngleBracket
        // Scaled to fit 200x200 viewBox
        // Left diamond (from original left component)
        left: "M207.33 2.35L108.82 100.72L207.33 199.09L10.59 100.72L207.33 2.35Z",
        // Right diamond (from original right component) 
        right: "M100 20L180 100L100 180L20 100L100 20Z"
    },
    circle: {
        left: "M100 20A80 80 0 0 1 100 180A80 80 0 0 1 100 20Z",
        right: "M100 20A80 80 0 0 0 100 180A80 80 0 0 0 100 20Z"
    },
    square: {
        left: "M50 50L50 150L150 150L150 50L50 50Z",
        right: "M150 50L150 150L50 150L50 50L150 50Z"
    }
};

export const MorphingBracket: React.FC<MorphingBracketProps> = ({
    className,
    size = 'sm',
    morphType = 'angle-bracket',
    autoMorph = false,
    morphDuration = 2,
    direction = 'left',
}) => {
    const [currentShape, setCurrentShape] = useState(morphType);
    const [morphProgress, setMorphProgress] = useState(0);

    // Auto morphing logic
    useEffect(() => {
        if (autoMorph) {
            const morphSequence = ['diamond', 'angle-bracket', 'circle', 'square'] as const;
            let currentIndex = morphSequence.indexOf(morphType);

            const interval = setInterval(() => {
                currentIndex = (currentIndex + 1) % morphSequence.length;
                setCurrentShape(morphSequence[currentIndex]);
            }, morphDuration * 1000);

            return () => clearInterval(interval);
        }
    }, [autoMorph, morphType, morphDuration]);

    // Get the current path based on direction and shape
    const getCurrentPath = () => {
        return shapes[currentShape][direction];
    };

    const SvgComponent = (
        <svg
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn(sizeConfig[size], className)}
        >
            <motion.g
                initial={false}
                animate={{
                    d: getCurrentPath(),
                    transition: {
                        duration: morphDuration,
                        ease: "easeInOut"
                    }
                }}
            >
                <motion.path
                    d={getCurrentPath()}
                    fill="url(#morph-gradient)"
                    animate={{
                        d: getCurrentPath(),
                        transition: {
                            duration: morphDuration,
                            ease: "easeInOut"
                        }
                    }}
                />
                <motion.path
                    d={getCurrentPath()}
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinejoin="round"
                    fill="none"
                    animate={{
                        d: getCurrentPath(),
                        transition: {
                            duration: morphDuration,
                            ease: "easeInOut"
                        }
                    }}
                />
            </motion.g>
            <defs>
                <linearGradient
                    id="morph-gradient"
                    x1="20"
                    y1="20"
                    x2="180"
                    y2="180"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#E77096" />
                    <stop offset="1" stopColor="#52EACE" />
                </linearGradient>
            </defs>
        </svg>
    );

    return (
        <motion.div
            initial={{ opacity: 0, x: direction === 'left' ? -100 : 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: direction === 'left' ? 0.2 : 0.6, ease: "easeOut" }}
        >
            {SvgComponent}
        </motion.div>
    );
};

export default MorphingBracket;
