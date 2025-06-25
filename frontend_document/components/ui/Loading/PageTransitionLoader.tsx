'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function PageTransitionLoader() {
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const pathname = usePathname();

    useEffect(() => {
        setIsLoading(true);
        setProgress(0);

        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 300);
                    return 100;
                }
                return prev + 12;
            });
        }, 50);

        return () => {
            clearInterval(progressInterval);
        };
    }, [pathname]);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    exit={{ scaleX: 1, opacity: 0, transition: { duration: 0.3 } }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="fixed top-0 left-0 right-0 h-1 z-[9999] origin-left"
                >
                    {/* Background Bar */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300" />

                    {/* Progress Bar */}
                    <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.1, ease: "easeOut" }}
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg"
                    />

                    {/* Glowing Effect */}
                    <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.1, ease: "easeOut" }}
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 blur-sm opacity-60"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
