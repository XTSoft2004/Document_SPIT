'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageRegister from './register/page';
import RotatingText from '@/components/animations/TextAnimations/RotatingText/RotatingText';
import PageLogin from './login/page';
import Image from 'next/image';
import HeroSection from '@/components/ui/Auth/HeroSection';

// Animation variants for better performance
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1,
        transition: { duration: 0.6, staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const tabSwitchVariants = {
    hidden: { opacity: 0, x: 50, scale: 0.95 },
    visible: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -50, scale: 0.95 }
};

export default function PageAuth() {
    const [isSignIn, setIsSignIn] = useState(true);

    const handleTabChange = useCallback((tab: string) => {
        setIsSignIn(tab === 'login');
    }, []);

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-x-hidden">
            {/* Left Section - Auth Form */}
            <motion.div 
                className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 xl:p-12 relative order-2 lg:order-1 min-h-screen lg:min-h-0"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Background Pattern - Optimized */}
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <div 
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `radial-gradient(circle, #3b82f6 1px, transparent 1px)`,
                            backgroundSize: '30px 30px'
                        }} 
                    />
                </div>

                <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg relative z-10">
                    {/* Header Section - Improved spacing */}
                    <motion.div className="text-center mb-4 sm:mb-6 lg:mb-8" variants={itemVariants}>
                        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3 mb-4 sm:mb-6">
                            <div className="relative flex-shrink-0">
                                <Image
                                    src="/logo/logo-500x500.png"
                                    alt="SPIT Document"
                                    width={40}
                                    height={40}
                                    className="sm:w-12 sm:h-12 rounded-xl shadow-lg"
                                    priority
                                />
                                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                            </div>

                            <div className="text-center sm:text-left">
                                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    SPIT Document
                                </h1>
                                <div className="h-4 sm:h-5 lg:h-6 overflow-hidden">
                                    <RotatingText
                                        texts={['Technology', 'Fast', 'Easy to use', 'Efficient']}
                                        mainClassName="text-xs sm:text-sm text-gray-500 font-medium"
                                        staggerFrom="last"
                                        initial={{ y: '100%' }}
                                        animate={{ y: 0 }}
                                        exit={{ y: '-120%' }}
                                        staggerDuration={0.03}
                                        splitLevelClassName="overflow-hidden"
                                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                        rotationInterval={2500}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 text-gray-800">
                                {isSignIn ? 'Welcome Back!' : 'Create Account'}
                            </h2>
                            <p className="text-gray-600 text-xs sm:text-sm lg:text-base">
                                {isSignIn
                                    ? 'Sign in to continue to your dashboard'
                                    : 'Fill in the information below to get started'
                                }
                            </p>
                        </div>
                    </motion.div>

                    {/* Tab Buttons - Improved responsive */}
                    <motion.div
                        className="flex mb-4 sm:mb-6 space-x-1 bg-gray-100/80 backdrop-blur-sm p-1 sm:p-1.5 rounded-xl sm:rounded-2xl justify-center relative shadow-inner"
                        variants={itemVariants}
                    >
                        <motion.div
                            layout
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            className="absolute top-1 sm:top-1.5 bottom-1 sm:bottom-1.5 w-[calc(50%-4px)] sm:w-[calc(50%-6px)] rounded-lg sm:rounded-xl bg-white shadow-lg border border-white/20"
                            style={{
                                left: isSignIn ? '4px' : 'calc(50% + 2px)',
                            }}
                        />
                        {['login', 'register'].map((tab, index) => (
                            <motion.button
                                key={tab}
                                onClick={() => handleTabChange(tab)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex-1 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl relative z-10 transition-all duration-300 ease-out"
                                aria-label={tab === 'login' ? 'Sign In' : 'Sign Up'}
                            >
                                {tab === 'login' ? 'Sign In' : 'Sign Up'}
                            </motion.button>
                        ))}
                    </motion.div>

                    {/* Form Container - Optimized height */}
                    <motion.div 
                        className="flex items-center justify-center"
                        variants={itemVariants}
                    >
                        <div className="w-full bg-white/50 backdrop-blur-sm rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-white/20">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={isSignIn ? 'signIn' : 'signUp'}
                                    variants={tabSwitchVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    transition={{
                                        duration: 0.4,
                                        ease: [0.25, 0.1, 0.25, 1],
                                    }}
                                    className="w-full"
                                >
                                    {isSignIn ? <PageLogin /> : <PageRegister />}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Right Section - Student Document Management System */}
            <HeroSection />
        </div>
    );
}