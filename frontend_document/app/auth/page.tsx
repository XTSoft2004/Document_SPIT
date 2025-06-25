'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageRegister from './register/page';
import RotatingText from '@/components/animations/TextAnimations/RotatingText/RotatingText';
import PageLogin from './login/page';
import Image from 'next/image';

export default function PageAuth() {
    const [isSignIn, setIsSignIn] = useState(true);

    const handleTabChange = (tab: string) => {
        setIsSignIn(tab === 'login');
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Left Section - Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative order-2 lg:order-1">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle, #3b82f6 1px, transparent 1px)`,
                        backgroundSize: '30px 30px'
                    }} />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md relative z-10"
                >
                    {/* Header Section */}
                    <div className="text-center mb-6 sm:mb-8">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="flex items-center justify-center space-x-3 mb-4 sm:mb-6"
                        >
                            <div className="relative">
                                <Image
                                    src="/logo/logo-500x500.png"
                                    alt="SPIT Document"
                                    width={48}
                                    height={48}
                                    className="rounded-xl shadow-lg"
                                    priority
                                />
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                            </div>

                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    SPIT Document
                                </h1>
                                <div className="h-5 sm:h-6 overflow-hidden">
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
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-gray-800">
                                {isSignIn ? 'Welcome Back!' : 'Create Account'}
                            </h2>
                            <p className="text-gray-600 text-sm">
                                {isSignIn
                                    ? 'Sign in to continue to your dashboard'
                                    : 'Fill in the information below to get started'
                                }
                            </p>
                        </motion.div>
                    </div>

                    {/* Tab Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="flex mb-6 space-x-1 bg-gray-100/80 backdrop-blur-sm p-1.5 rounded-2xl justify-center relative shadow-inner"
                    >
                        <motion.div
                            layout
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-xl bg-white shadow-lg border border-white/20"
                            style={{
                                left: isSignIn ? '6px' : 'calc(50% + 2px)',
                            }}
                        />
                        <motion.button
                            onClick={() => handleTabChange('login')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold rounded-xl relative z-10 transition-all duration-300 ease-out"
                        >
                            Sign In
                        </motion.button>
                        <motion.button
                            onClick={() => handleTabChange('register')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold rounded-xl relative z-10 transition-all duration-300 ease-out"
                        >
                            Sign Up
                        </motion.button>
                    </motion.div>

                    {/* Form Container */}
                    <div className="min-h-[400px] sm:min-h-[480px] flex items-center justify-center">
                        <div className="w-full bg-white/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={isSignIn ? 'signIn' : 'signUp'}
                                    initial={{ opacity: 0, x: isSignIn ? 50 : -50, scale: 0.95 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: isSignIn ? -50 : 50, scale: 0.95 }}
                                    transition={{
                                        duration: 0.5,
                                        ease: [0.25, 0.1, 0.25, 1],
                                    }}
                                    className="w-full"
                                >
                                    {isSignIn ? <PageLogin /> : <PageRegister />}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right Section - Hero */}
            <div className="w-full lg:w-1/2 min-h-[300px] lg:min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 order-1 lg:order-2">
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    <motion.div
                        className="absolute top-10 sm:top-20 left-10 sm:left-20 w-20 sm:w-32 h-20 sm:h-32 bg-white/10 rounded-full blur-xl"
                        animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
                        transition={{ duration: 6, repeat: Infinity }}
                    />
                    <motion.div
                        className="absolute bottom-16 sm:bottom-32 right-8 sm:right-16 w-16 sm:w-24 h-16 sm:h-24 bg-white/15 rounded-full blur-xl"
                        animate={{ y: [0, 15, 0], scale: [1, 0.9, 1] }}
                        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                    />
                </div>

                {/* Main Content */}
                <div className="relative z-10 text-white text-center p-6 sm:p-8 max-w-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                    >
                        <div className="mb-6 sm:mb-8">
                            <div className="w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-4 sm:mb-6 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                <svg className="w-8 sm:w-10 h-8 sm:h-10" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 3a1 1 0 011-1h6a1 1 0 010 2H7a1 1 0 01-1-1zm1 3a1 1 0 000 2h6a1 1 0 000-2H7z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
                                Manage Documents
                                <br />
                                <span className="text-lg sm:text-xl font-normal text-white/80">Efficiently</span>
                            </h3>
                            <p className="text-white/70 leading-relaxed text-sm sm:text-base">
                                Streamline your document workflow with our powerful management system.
                                Organize, share, and collaborate seamlessly.
                            </p>
                        </div>

                        {/* Feature highlights */}
                        <div className="space-y-2 sm:space-y-3 text-left">
                            {[
                                { color: 'bg-green-400', text: 'Secure cloud storage' },
                                { color: 'bg-blue-400', text: 'Real-time collaboration' },
                                { color: 'bg-purple-400', text: 'Advanced search & filters' },
                            ].map((feature, index) => (
                                <motion.div
                                    key={feature.text}
                                    className="flex items-center space-x-3"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1.2 + index * 0.2, duration: 0.5 }}
                                >
                                    <div className={`w-2 h-2 ${feature.color} rounded-full`}></div>
                                    <span className="text-xs sm:text-sm text-white/80">{feature.text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}