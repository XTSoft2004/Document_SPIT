'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface RouterLoadingProps {
    isVisible: boolean;
    duration?: number;
}

const RouterLoading = ({ isVisible, duration = 800 }: RouterLoadingProps) => {
    const [showText, setShowText] = useState(false);

    useEffect(() => {
        if (isVisible) {
            const textTimer = setTimeout(() => {
                setShowText(true);
            }, 200);

            return () => clearTimeout(textTimer);
        } else {
            setShowText(false);
        }
    }, [isVisible]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[9999] bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center overflow-hidden"
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `radial-gradient(circle, #3b82f6 1px, transparent 1px)`,
                            backgroundSize: '50px 50px'
                        }} />
                    </div>

                    {/* Main Animation Container */}
                    <div className="relative flex items-center justify-center w-full h-full">
                        {/* Logo Animation */}
                        <motion.div
                            initial={{
                                scale: 0.3,
                                opacity: 0,
                                rotate: -180,
                                x: 0
                            }}
                            animate={{
                                scale: showText ? 0.8 : 1,
                                opacity: 1,
                                rotate: 360,
                                x: showText ? -60 : 0
                            }}
                            transition={{
                                duration: 1.2,
                                ease: [0.25, 0.1, 0.25, 1],
                                rotate: {
                                    duration: 1.5,
                                    ease: "easeInOut"
                                },
                                x: {
                                    duration: 0.8,
                                    delay: 0.5,
                                    ease: [0.25, 0.1, 0.25, 1]
                                },
                                scale: {
                                    duration: 0.8,
                                    delay: 0.5,
                                    ease: [0.25, 0.1, 0.25, 1]
                                }
                            }}
                            className="relative"
                        >
                            {/* Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse" />

                            {/* Logo */}
                            <div className="relative w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40">
                                <Image
                                    src="/logo/logo-500x500.png"
                                    alt="SPIT Logo"
                                    fill
                                    className="object-contain drop-shadow-2xl"
                                    priority
                                />
                            </div>
                        </motion.div>

                        {/* Text Animation */}
                        <AnimatePresence>
                            {showText && (
                                <motion.div
                                    initial={{
                                        x: 300,
                                        opacity: 0,
                                        scale: 0.5
                                    }}
                                    animate={{
                                        x: 40,
                                        opacity: 1,
                                        scale: 1
                                    }}
                                    exit={{
                                        x: 300,
                                        opacity: 0,
                                        scale: 0.5
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        ease: [0.25, 0.1, 0.25, 1]
                                    }}
                                    className="absolute"
                                >
                                    <div className="text-white font-bold text-2xl sm:text-3xl lg:text-4xl">
                                        <motion.span
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2, duration: 0.6 }}
                                            className="inline-block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                                        >
                                            SPIT
                                        </motion.span>
                                        <motion.span
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4, duration: 0.6 }}
                                            className="inline-block ml-3 text-white/90"
                                        >
                                            TEAM
                                        </motion.span>
                                    </div>

                                    {/* Underline Animation */}
                                    <motion.div
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ delay: 0.6, duration: 0.8 }}
                                        className="h-1 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full mt-2 origin-left"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Loading Dots */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.5 }}
                        className="absolute bottom-20 flex space-x-2"
                    >
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.3, 1, 0.3]
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: i * 0.2
                                }}
                                className="w-2 h-2 bg-white/60 rounded-full"
                            />
                        ))}
                    </motion.div>

                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: duration / 1000, ease: "easeInOut" }}
                            className="h-full bg-gradient-to-r from-blue-400 to-purple-600 origin-left"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default RouterLoading;