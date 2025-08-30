'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface Loading1Props {
    onLoadingComplete: () => void;
    duration?: number;
}

const Loading1 = ({ onLoadingComplete, duration = 1000 }: Loading1Props) => {
    const [showText, setShowText] = useState(false);
    const [animationStage, setAnimationStage] = useState<'logo' | 'text' | 'collision'>('logo');

    useEffect(() => {
        const logoTimer = setTimeout(() => {
            setAnimationStage('text');
            setShowText(true);
        }, 400);

        const collisionTimer = setTimeout(() => {
            setAnimationStage('collision');
        }, 900);

        const loadingTimer = setTimeout(() => {
            onLoadingComplete();
        }, duration);

        return () => {
            clearTimeout(logoTimer);
            clearTimeout(collisionTimer);
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
                    backgroundSize: '40px 40px'
                }} />
            </div>

            {/* Floating Elements */}
            <motion.div
                className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"
                animate={{
                    y: [0, -50, 0],
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
                className="absolute bottom-32 right-16 w-24 h-24 bg-white/15 rounded-full blur-xl"
                animate={{
                    y: [0, 20, 0],
                    scale: [1, 0.8, 1],
                    opacity: [0.2, 0.5, 0.2]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            />

            {/* Main Content */}
            <div className="relative flex items-center justify-center min-h-screen z-10">
                {/* Logo Animation */}
                <motion.div
                    initial={{
                        scale: 0.2,
                        opacity: 0,
                        rotate: 0
                    }}
                    animate={{
                        scale: animationStage === 'collision' ? 0.8 : 1,
                        opacity: 1,
                        rotate: 360,
                        x: animationStage === 'collision' ? -100 : 0
                    }}
                    transition={{
                        scale: { duration: 1.5, ease: "easeOut" },
                        opacity: { duration: 1.5, ease: "easeOut" },
                        rotate: { duration: 2, ease: "easeInOut", delay: 0.2 },
                        x: animationStage === 'collision' ? { duration: 0.8, ease: "easeOut", delay: 0 } : {}
                    }}
                    className="relative"
                >
                    {/* Glow Effect */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full blur-2xl opacity-60"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />

                    {/* Logo */}
                    <div className="relative w-28 h-28 lg:w-36 lg:h-36">
                        <Image
                            src="/logo/logo-500x500.png"
                            alt="SPIT Logo"
                            fill
                            className="object-contain drop-shadow-2xl"
                            priority
                        />
                    </div>
                </motion.div>

                {/* SPIT Text Animation */}
                <AnimatePresence>
                    {showText && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute flex items-center space-x-2 mb-12"
                        >
                            {['S', 'P', 'I', 'T'].map((char, index) => (
                                <motion.span
                                    key={`spit-${index}`}
                                    initial={{ x: 300, opacity: 0 }}
                                    animate={{
                                        x: animationStage === 'collision' ? 70 + (index * 5) : 200 + (index * 5),
                                        opacity: 1
                                    }}
                                    transition={{
                                        x: { duration: 0.6, ease: "easeOut", delay: index * 0.1 },
                                        opacity: { duration: 0.6, delay: index * 0.1 }
                                    }}
                                    className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                                    style={{
                                        textShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
                                        fontFamily: 'system-ui, -apple-system, sans-serif'
                                    }}
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* DOCUMENT Text Animation */}
                <AnimatePresence>
                    {showText && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute flex items-center space-x-2 mt-14"
                        >
                            {['D', 'O', 'C', 'U', 'M', 'E', 'N', 'T'].map((char, index) => (
                                <motion.span
                                    key={`doc-${index}`}
                                    initial={{ x: 300, opacity: 0 }}
                                    animate={{
                                        x: animationStage === 'collision' ? 130 + (index * 5) : 260 + (index * 5),
                                        opacity: 1
                                    }}
                                    transition={{
                                        x: { duration: 0.6, ease: "easeOut", delay: index * 0.1 },
                                        opacity: { duration: 0.6, delay: index * 0.1 }
                                    }}
                                    className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white"
                                    style={{
                                        textShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
                                        fontFamily: 'system-ui, -apple-system, sans-serif'
                                    }}
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default Loading1;
