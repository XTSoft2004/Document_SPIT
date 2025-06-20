'use client';
import { loginAccount } from '@/actions/auth.actions';
import { ILoginRequest } from '@/types/auth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { FaApple as Apple, FaFacebook as Facebook } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import PageLogin from './login/page';
import PageRegister from './register/page';
export default function PageAuth() {
    const [isSignIn, setIsSignIn] = useState(true);

    const handleTabChange = (tab: string) => {
        setIsSignIn(tab === 'login');
        console.log(`Switched to ${tab} tab`);
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Section (Login Form) */}
            <div className="w-full md:w-1/2 flex items-center justify-center px-8">
                <div className="w-full max-w-md">
                    <div className="flex items-center space-x-2 mb-8 justify-center">
                        <span
                            className="text-3xl font-extrabold"
                            style={{
                                background: 'linear-gradient(to right, #3b82f6, #a855f7)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            SPIT Document
                        </span>
                        {/* <svg
                            className="w-7 h-7"
                            fill="none"
                            stroke="url(#gradient)"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                                    <stop offset="100%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
                                </linearGradient>
                            </defs>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg> */}
                    </div>

                    <h2 className="text-3xl font-bold mb-2 text-gray-800 text-center">Welcome Back</h2>
                    <p className="text-gray-500 mb-8 text-center">
                        {isSignIn ? 'Please enter your details to continue' : 'Please enter your details to sign up'}
                    </p>

                    {/* Tab Buttons - Fixed Position */}
                    <div className="flex mb-6 space-x-2 bg-gray-100 p-1 rounded-xl justify-center sticky top-0 z-10 w-full relative">
                        <motion.div
                            layout
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-white shadow-sm"
                            style={{
                                left: isSignIn ? '4px' : 'calc(50% + 2px)',
                            }}
                        />
                        <button
                            onClick={() => handleTabChange('login')}
                            className={`flex-1 px-4 py-2 font-semibold rounded-lg relative z-10 transition-all duration-200 ease-in-out ${isSignIn ? 'text-blue-900 bg-transparent' : 'text-gray-500'
                                } focus:outline-none`}
                            aria-selected={isSignIn}
                            role="tab"
                            tabIndex={0}
                            style={{ boxShadow: 'none' }}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => handleTabChange('register')}
                            className={`flex-1 px-4 py-2 font-semibold rounded-lg relative z-10 transition-all duration-200 ease-in-out ${!isSignIn ? 'text-blue-900 bg-transparent' : 'text-gray-500'
                                } focus:outline-none`}
                            aria-selected={!isSignIn}
                            role="tab"
                            tabIndex={0}
                            style={{ boxShadow: 'none' }}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Khu vực chứa form với chiều cao tối thiểu */}
                    <div className="min-h-[300px] flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isSignIn ? 'signIn' : 'signUp'}
                                initial={{ opacity: 0, x: isSignIn ? 50 : -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: isSignIn ? -50 : 50 }}
                                transition={{ duration: 0.3 }}
                                className="w-full"
                            >
                                {isSignIn ? <PageLogin /> : <PageRegister />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            {/* Right Section (Background Image) */}
            <div className="hidden md:flex w-1/2 items-center justify-center relative overflow-hidden">
                <Image
                    src="/images/backgrounds/bg_login.png"
                    alt="Finance background"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="opacity-90"
                    priority
                />
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(to right, rgba(255, 255, 255, 0.9), transparent 30%)',
                        filter: 'blur(10px)',
                        pointerEvents: 'none',
                    }}
                />
            </div>
        </div>
    );
}