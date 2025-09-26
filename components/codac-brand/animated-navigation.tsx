'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export function AnimatedNavigation() {
    return (
        <motion.nav
            className="fixed top-0 left-0 right-0 z-50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <div className="w-full mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    >
                        <Button variant="outline" asChild>
                            <Link href="/auth/signin">Sign In</Link>
                        </Button>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                    >
                        <Button variant="outline" asChild>
                            <Link href="/home">Get Started</Link>
                        </Button>
                    </motion.div>
                </div>
            </div>
        </motion.nav>
    );
}
