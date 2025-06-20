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
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Section (Login Form) */}
            <div className="w-full md:w-1/2 flex flex-col justify-center px-[11%]">
                <div className="flex items-center space-x-2 mb-8">
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
                    <svg
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
                    </svg>
                </div>

                <h2 className="text-3xl font-bold mb-2 text-gray-800">Welcome Back</h2>
                <p className="text-gray-500 mb-8">
                    {isSignIn ? 'Please enter your details to continue' : 'Please enter your details to sign up'}
                </p>

                {/* Tab Buttons - Fixed Position */}
                <div className="flex mb-6 space-x-2 bg-gray-100 p-1 rounded-xl justify-center sticky top-0 z-10 w-full">
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
                <div className="min-h-[400px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isSignIn ? 'signIn' : 'signUp'}
                            initial={{ opacity: 0, x: isSignIn ? 50 : -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: isSignIn ? -50 : 50 }}
                            transition={{ duration: 0.3 }}
                        >
                            {isSignIn ? <PageLogin /> : <PageRegister />}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* <div className="flex items-center my-6">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="mx-4 text-gray-400 text-sm">Or continue with</span>
                    <div className="flex-1 h-px bg-gray-200" />
                </div> */}

                {/* <div className="flex justify-center space-x-4 mb-6">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-12 h-12 bg-white hover:bg-gray-200 rounded-full flex items-center justify-center shadow-md transition-colors duration-200"
                    >
                        <FcGoogle size={24} />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-12 h-12 bg-black hover:bg-gray-800 rounded-full flex items-center justify-center shadow-md transition-colors duration-200"
                    >
                        <Apple size={24} className="text-white" />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-12 h-12 bg-[#1877F2] hover:bg-[#145DBF] rounded-full flex items-center justify-center shadow-md transition-colors duration-200"
                    >
                        <Facebook size={24} className="text-white" />
                    </motion.button>
                </div> */}
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