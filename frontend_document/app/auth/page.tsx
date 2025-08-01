'use client'
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import RotatingText from '@/components/animations/TextAnimations/RotatingText/RotatingText'
import Image from 'next/image'
import HeroSection from '@/components/ui/Auth/HeroSection'
import ResponsiveHeroSection from '@/components/ui/Auth/ResponsiveHeroSection'
import { useRouter } from 'next/navigation'
import PageLogin from '@/components/ui/Auth/PageLogin'
import PageRegister from '@/components/ui/Auth/PageRegister'
import globalConfig from '@/app.config'

// Animation variants for better performance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const tabSwitchVariants = {
  hidden: { opacity: 0, x: 50, scale: 0.95 },
  visible: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -50, scale: 0.95 },
}

export default function PageAuth() {
  const [isSignIn, setIsSignIn] = useState(true)
  const router = useRouter()

  const handleTabChange = useCallback((tab: string) => {
    setIsSignIn(tab === 'login')
  }, [])

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Mobile Hero Banner - Only visible on mobile */}
      {/* <div className="md:hidden w-full bg-gradient-to-r from-blue-600 to-purple-600 p-4 order-1">
                <motion.div
                    className="text-center text-white"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex items-center justify-center space-x-2 mb-2">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                            </svg>
                        </div>
                        <h2 className="text-lg font-bold">SPIT Document</h2>
                    </div>
                    <p className="text-white/90 text-sm">
                        🎓 Thư viện tài liệu học tập HUSC - Truy cập dễ dàng, học tập hiệu quả
                    </p>
                    <div className="flex justify-center space-x-4 mt-2 text-xs">
                        <span className="bg-white/20 px-2 py-1 rounded-full">📱 Xem trực tuyến</span>
                        <span className="bg-white/20 px-2 py-1 rounded-full">🔍 Tìm kiếm nhanh</span>
                        <span className="bg-white/20 px-2 py-1 rounded-full">⚡ Tải nhanh</span>
                    </div>
                </motion.div>
            </div> */}

      {/* Left Section - Auth Form */}
      <motion.div
        className="w-full md:w-1/2 flex items-center justify-center p-3 sm:p-4 lg:p-6 xl:p-8 relative order-2 md:order-1 min-h-screen md:h-screen"
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
              backgroundSize: '30px 30px',
            }}
          />
        </div>

        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg relative z-10">
          {/* Header Section - Improved spacing */}
          <motion.div
            className="text-center mb-2 sm:mb-4 lg:mb-6"
            variants={itemVariants}
          >
            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6 hover:cursor-pointer"
              onClick={() => {
                router.push('/')
              }}
            >
              <div className="relative flex-shrink-0 group">
                <Image
                  src="/logo/logo-500x500.png"
                  alt="SPIT Document"
                  width={48}
                  height={48}
                  className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-2xl shadow-xl border-2 border-blue-200 group-hover:scale-105 transition-transform duration-200"
                  priority
                />
                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 bg-gradient-to-tr from-green-400 to-green-600 rounded-full border-2 border-white animate-pulse shadow-md" />
              </div>
              <div className="text-center sm:text-left">
                <div className="flex flex-col items-center sm:items-start">
                  <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent drop-shadow-sm tracking-tight">
                      SPIT Document
                    </h1>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 animate-bounce">
                      v{globalConfig.version}
                    </span>
                  </div>
                  <div className="mb-2 h-5 sm:h-6 lg:h-7 overflow-hidden flex items-center justify-center sm:justify-start w-full">
                    <RotatingText
                      texts={[
                        'Nhanh chóng 🚀',
                        'Dễ sử dụng 🤗',
                        'Hiệu quả 📈',
                        'Công nghệ AI 🤖',
                        'Bảo mật 🔒',
                      ]}
                      mainClassName="text-xs sm:text-sm text-gray-500 font-medium"
                      staggerFrom="last"
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      exit={{ y: '-120%' }}
                      staggerDuration={0.04}
                      splitLevelClassName="overflow-hidden"
                      transition={{
                        type: 'spring',
                        damping: 22,
                        stiffness: 320,
                      }}
                      rotationInterval={2200}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-2 text-gray-800">
                {isSignIn ? 'Chào mừng bạn đã quay trở lại!' : 'Tạo tài khoản'}
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm lg:text-base">
                {isSignIn
                  ? 'Đăng nhập để tiếp tục đến bảng điều khiển của bạn'
                  : 'Điền thông tin bên dưới để bắt đầu hành trình của bạn với SPIT Document'}
              </p>
            </div>
          </motion.div>

          {/* Tab Buttons - Improved responsive */}
          <motion.div
            className="flex mb-3 sm:mb-4 space-x-1 bg-gray-100/80 backdrop-blur-sm p-1 sm:p-1.5 rounded-xl sm:rounded-2xl justify-center relative shadow-inner"
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
                {tab === 'login' ? 'Đăng nhập' : 'Đăng ký'}
              </motion.button>
            ))}
          </motion.div>

          {/* Form Container - Optimized height */}
          <motion.div
            className="flex items-center justify-center"
            variants={itemVariants}
          >
            <div className="w-full bg-white/50 backdrop-blur-sm rounded-xl sm:rounded-2xl lg:rounded-3xl p-3 sm:p-4 lg:p-6 shadow-xl border border-white/20">
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
                  {isSignIn ? (
                    <PageLogin />
                  ) : (
                    <PageRegister setIsSignIn={setIsSignIn} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Section - Student Document Management System */}
      <div className="hidden md:flex w-1/2 h-screen order-1 md:order-2 relative overflow-hidden">
        <ResponsiveHeroSection />
      </div>
    </div>
  )
}
