'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface Loading2Props {
    onLoadingComplete: () => void;
    duration?: number;
}

const Loading2 = ({ onLoadingComplete, duration = 1000 }: Loading2Props) => {
    const [showText, setShowText] = useState(false);

    useEffect(() => {
        const textTimer = setTimeout(() => {
            setShowText(true);
        }, 400);

        const loadingTimer = setTimeout(() => {
            onLoadingComplete();
        }, duration);

        return () => {
            clearTimeout(textTimer);
            clearTimeout(loadingTimer);
        };
    }, [duration, onLoadingComplete]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[9999] bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center overflow-hidden"
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle, #3b82f6 1px, transparent 1px)`,
                    backgroundSize: '30px 30px'
                }} />
            </div>

            {/* Floating Elements */}
            <motion.div
                className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"
                animate={{
                    y: [0, -30, 0],
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
                className="absolute bottom-20 right-10 w-16 h-16 bg-white/15 rounded-full blur-xl"
                animate={{
                    y: [0, 15, 0],
                    scale: [1, 0.8, 1],
                    opacity: [0.2, 0.5, 0.2]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            />

            {/* Main Content */}
            <div className="relative flex flex-col items-center justify-center min-h-screen z-10 px-4">
                {/* Logo Animation */}
                <motion.div
                    initial={{
                        scale: 0.3,
                        opacity: 0,
                        rotate: 0
                    }}
                    animate={{
                        scale: 1,
                        opacity: 1,
                        rotate: 360
                    }}
                    transition={{
                        scale: { duration: 1.5, ease: "easeOut" },
                        opacity: { duration: 1.5, ease: "easeOut" },
                        rotate: { duration: 2, ease: "easeInOut", delay: 0.2 }
                    }}
                    className="relative mb-8"
                >
                    {/* Glow Effect */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full blur-xl opacity-60"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />

                    {/* Logo */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                        <Image
                            src="/logo/logo-500x500.png"
                            alt="SPIT Logo"
                            fill
                            className="object-contain drop-shadow-2xl"
                            priority
                        />
                    </div>
                </motion.div>

                {/* Text Animation - Mobile Layout */}
                <AnimatePresence>
                    {showText && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center space-y-2"
                        >
                            {/* SPIT DOCUMENT as one line */}
                            <div className="flex items-center justify-center gap-1">
                                {['S', 'P', 'I', 'T'].map((char, index) => (
                                    <motion.span
                                        key={`spit-${index}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            opacity: { duration: 0.6, delay: index * 0.1 },
                                            y: { duration: 0.6, delay: index * 0.1 }
                                        }}
                                        className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                                        style={{
                                            textShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
                                            fontFamily: 'system-ui, -apple-system, sans-serif'
                                        }}
                                    >
                                        {char}
                                    </motion.span>
                                ))}

                                <span className="text-2xl sm:text-3xl font-bold text-white/90"> </span>

                                {['D', 'O', 'C', 'U', 'M', 'E', 'N', 'T'].map((char, index) => (
                                    <motion.span
                                        key={`doc-${index}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            opacity: { duration: 0.6, delay: 0.5 + (index * 0.08) },
                                            y: { duration: 0.6, delay: 0.5 + (index * 0.08) }
                                        }}
                                        className="text-2xl sm:text-3xl font-bold text-white/90"
                                        style={{
                                            textShadow: '0 0 15px rgba(255, 255, 255, 0.3)',
                                            fontFamily: 'system-ui, -apple-system, sans-serif'
                                        }}
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};
export default Loading2;
