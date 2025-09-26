'use client';

import { motion } from 'framer-motion';

import CodacLeftAngleBracket from './codac-left-angle-bracket';
import CodacRightAngleBracket from './codac-right-angle-bracket';

export function AnimatedLandingContent() {
    return (
        <div className="flex justify-center items-center h-full">
            <CodacLeftAngleBracket size="8xl" animated />
            <motion.div
                className="animate-diamond-pulse opacity-0"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 0.8,
                    delay: 0.5,
                    ease: [0, 0.71, 0.2, 1.01],
                }}
            >
                <h1 className="text-[10rem] uppercase font-codac-brand">codac</h1>
            </motion.div>
            <CodacRightAngleBracket size="8xl" animated />
        </div>
    );
}
