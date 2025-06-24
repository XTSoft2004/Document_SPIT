'use client';
import { loginAccount } from '@/actions/auth.actions';
import { ILoginRequest } from '@/types/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import PageRegister from './register/page';
import RotatingText from '@/components/animations/TextAnimations/RotatingText/RotatingText';
import PageLogin from './login/page';
export default function PageAuth() {
    const [isSignIn, setIsSignIn] = useState(true);

    const handleTabChange = (tab: string) => {
        setIsSignIn(tab === 'login');
        console.log(`Switched to ${tab} tab`);
    }; return (
        <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Left Section (Login Form) */}
            <div className="w-full md:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
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
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="flex items-center justify-center space-x-3 mb-6"
                        >
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    SPIT Document
                                </h1>
                                <div className="h-6 overflow-hidden">
                                    <RotatingText
                                        texts={['Technology', 'Fast', 'Easy to use', 'Efficient']}
                                        mainClassName="text-sm text-gray-500 font-medium"
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
                            <h2 className="text-3xl font-bold mb-3 text-gray-800">
                                {isSignIn ? 'Welcome Back!' : 'Create Account'}
                            </h2>
                            <p className="text-gray-600 text-sm">
                                {isSignIn
                                    ? 'Sign in to continue to your dashboard'
                                    : 'Fill in the information below to get started'
                                }
                            </p>
                        </motion.div>
                    </div>                    {/* Modern Tab Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="flex mb-2 space-x-1 bg-gray-100/80 backdrop-blur-sm p-1.5 rounded-2xl justify-center relative shadow-inner"
                    >
                        <motion.div
                            layout
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-xl bg-white shadow-lg border border-white/20"
                            style={{
                                left: isSignIn ? '6px' : 'calc(50% + 2px)',
                            }}
                        />
                        <button
                            onClick={() => handleTabChange('login')}
                            className={`flex-1 px-6 py-3 font-semibold rounded-xl relative z-10 transition-all duration-300 ease-out ${isSignIn
                                ? 'text-blue-700 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                            aria-selected={isSignIn}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => handleTabChange('register')}
                            className={`flex-1 px-6 py-3 font-semibold rounded-xl relative z-10 transition-all duration-300 ease-out ${!isSignIn
                                ? 'text-blue-700 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                            aria-selected={!isSignIn}
                        >
                            Sign Up
                        </button>
                    </motion.div>                    {/* Form Container with Glass Effect */}
                    <div className="min-h-[400px] flex items-center justify-center">
                        <div className="w-full bg-white/50 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={isSignIn ? 'signIn' : 'signUp'}
                                    initial={{ opacity: 0, x: isSignIn ? 50 : -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: isSignIn ? -50 : 50 }}
                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                    className="w-full"
                                >
                                    {isSignIn ? <PageLogin /> : <PageRegister />}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </div>            {/* Right Section (Enhanced Background) */}
            <div className="hidden md:flex w-1/2 items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    {/* Floating shapes */}
                    <motion.div
                        className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"
                        animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
                        transition={{ duration: 6, repeat: Infinity }}
                    />
                    <motion.div
                        className="absolute bottom-32 right-16 w-24 h-24 bg-white/15 rounded-full blur-xl"
                        animate={{ y: [0, 15, 0], scale: [1, 0.9, 1] }}
                        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                    />
                    <motion.div
                        className="absolute top-1/2 right-32 w-16 h-16 bg-white/20 rounded-full blur-lg"
                        animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
                        transition={{ duration: 5, repeat: Infinity, delay: 2 }}
                    />
                </div>

                {/* Main Content */}
                <div className="relative z-10 text-white text-center p-8 max-w-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                    >
                        <div className="mb-8">
                            <div className="w-20 h-20 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 3a1 1 0 011-1h6a1 1 0 010 2H7a1 1 0 01-1-1zm1 3a1 1 0 000 2h6a1 1 0 000-2H7z" />
                                </svg>
                            </div>
                            <h3 className="text-3xl font-bold mb-4">
                                Manage Documents
                                <br />
                                <span className="text-xl font-normal text-white/80">Efficiently</span>
                            </h3>
                            <p className="text-white/70 leading-relaxed">
                                Streamline your document workflow with our powerful management system.
                                Organize, share, and collaborate seamlessly.
                            </p>
                        </div>

                        {/* Feature highlights */}
                        <div className="space-y-3 text-left">
                            <motion.div
                                className="flex items-center space-x-3"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.2, duration: 0.5 }}
                            >
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <span className="text-sm text-white/80">Secure cloud storage</span>
                            </motion.div>
                            <motion.div
                                className="flex items-center space-x-3"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.4, duration: 0.5 }}
                            >
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                <span className="text-sm text-white/80">Real-time collaboration</span>
                            </motion.div>
                            <motion.div
                                className="flex items-center space-x-3"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.6, duration: 0.5 }}
                            >
                                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                <span className="text-sm text-white/80">Advanced search & filters</span>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/5 to-black/10" />
            </div>
        </div>
    );
}