'use client';

import { motion } from 'framer-motion';

import CodacLeftAngleBracket from './codac-left-angle-bracket';
import CodacRightAngleBracket from './codac-right-angle-bracket';

export function AnimatedLandingContent() {
    return (
        <div className="flex justify-center items-center h-full">
            <CodacLeftAngleBracket size="8xl" animated />
            <motion.h1
                className="text-9xl uppercase font-codac-brand animate-diamond-pulse opacity-0"
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            >
                codac
            </motion.h1>
            <CodacRightAngleBracket size="8xl" animated />
        </div>
    );
}
