'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const HeroSection = () => {
    // Add responsiveness tracking for dynamic element display
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);

    useEffect(() => {
        const checkSize = () => {
            setIsSmallScreen(window.innerWidth < 768);
            // Check if zoom level is greater than 110% (empirically catches 125% zoom)
            setIsZoomed(window.outerWidth / window.innerWidth < 0.9);
        };

        checkSize();
        window.addEventListener('resize', checkSize);
        return () => window.removeEventListener('resize', checkSize);
    }, []);

    return (
        <motion.div
            className="w-full h-full flex items-center justify-center relative overflow-hidden max-h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            style={{
                background: 'linear-gradient(-45deg, #3b82f6, #6366f1, #8b5cf6, #4f46e5, #2563eb)',
                backgroundSize: '400% 400%',
            }}
        >
            {/* Animated Background Overlay - Simplified */}
            <motion.div
                className="absolute inset-0 opacity-60"
                animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                    duration: 15, // Slower animation to reduce CPU usage
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{
                    background: 'linear-gradient(-45deg, rgba(59, 130, 246, 0.8), rgba(99, 102, 241, 0.6), rgba(139, 92, 246, 0.7), rgba(79, 70, 229, 0.8))',
                    backgroundSize: '300% 300%', // Smaller background size for better performance
                }}
            />

            {/* Soft Breathing Effect - Simplified */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-blue-900/10"
                animate={{
                    opacity: [0.3, 0.5, 0.3] // Removed scale to prevent overflow
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Animated Text Background - Conditional rendering based on screen size and zoom */}
            {!isZoomed && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {/* Primary floating keywords - reduced in number */}
                    <motion.div
                        className="absolute top-20 left-8 text-white/8 font-bold text-sm md:text-base select-none"
                        animate={{
                            y: [0, -15, 0], // Reduced animation range
                            opacity: [0.08, 0.12, 0.08],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        DOCUMENT
                    </motion.div>

                    {/* Only show on larger screens */}
                    {!isSmallScreen && (
                        <>
                            <motion.div
                                className="absolute top-32 right-12 text-white/6 font-semibold text-xs md:text-sm select-none"
                                animate={{
                                    y: [0, 15, 0], // Reduced animation range
                                    opacity: [0.06, 0.1, 0.06],
                                }}
                                transition={{
                                    duration: 8,
                                    repeat: Infinity,
                                    delay: 1,
                                    ease: "easeInOut"
                                }}
                            >
                                Tìm kiếm
                            </motion.div>

                            <motion.div
                                className="absolute bottom-20 right-12 text-white/8 font-bold text-sm md:text-base select-none"
                                animate={{
                                    y: [0, 10, 0], // Reduced animation range
                                    opacity: [0.08, 0.12, 0.08],
                                }}
                                transition={{
                                    duration: 11,
                                    repeat: Infinity,
                                    delay: 1.5,
                                    ease: "easeInOut"
                                }}
                            >
                                HUSC
                            </motion.div>
                        </>
                    )}

                    {/* Center DOCS text - smaller on small screens and when zoomed */}
                    <motion.div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/3 font-black text-5xl md:text-6xl lg:text-7xl select-none pointer-events-none"
                        animate={{
                            opacity: [0.03, 0.05, 0.03],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        DOCS
                    </motion.div>

                    {/* Minimal additional terms - only on larger screens */}
                    {!isSmallScreen && (
                        <motion.div
                            className="absolute bottom-16 left-16 text-white/7 font-bold text-sm md:text-base select-none"
                            animate={{
                                opacity: [0.07, 0.1, 0.07],
                            }}
                            transition={{
                                duration: 12,
                                repeat: Infinity,
                                delay: 2,
                                ease: "easeInOut"
                            }}
                        >
                            SPIT
                        </motion.div>
                    )}
                </div>
            )}

            {/* Floating Academic Elements */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Floating Book Icons */}
                <motion.div
                    className="absolute top-12 left-12 w-6 h-6 text-white/15"
                    animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, 0],
                        opacity: [0.15, 0.25, 0.15]
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                    </svg>
                </motion.div>

                {/* Floating Search Icons */}
                <motion.div
                    className="absolute top-1/3 right-16 w-5 h-5 text-white/20"
                    animate={{
                        y: [0, 8, 0],
                        scale: [1, 1.1, 1],
                        opacity: [0.2, 0.3, 0.2],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        delay: 0.8,
                        ease: "easeInOut"
                    }}
                >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </motion.div>

                {/* Floating Star Rating */}
                <motion.div
                    className="absolute bottom-1/4 left-8 w-4 h-4 text-yellow-300/25"
                    animate={{
                        rotate: [0, 360],
                        scale: [1, 1.2, 1],
                        opacity: [0.25, 0.4, 0.25]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        delay: 1.5,
                        ease: "easeInOut"
                    }}
                >
                    <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                </motion.div>

                {/* Additional Floating Elements */}
                <motion.div
                    className="absolute top-1/2 left-4 w-4 h-4 text-white/10"
                    animate={{
                        x: [0, 5, 0],
                        y: [0, -4, 0],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{
                        duration: 7,
                        repeat: Infinity,
                        delay: 2,
                        ease: "easeInOut"
                    }}
                >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </motion.div>

                {/* Background Geometric Shapes - More Fluid */}
                <motion.div
                    className="absolute top-20 right-20 w-16 h-16 bg-white/8 rounded-2xl"
                    animate={{
                        rotate: [0, 10, -5, 10, 0],
                        scale: [1, 1.05, 0.95, 1.02, 1],
                        opacity: [0.08, 0.12, 0.1, 0.14, 0.08]
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-16 right-8 w-12 h-12 bg-white/10 rounded-full"
                    animate={{
                        y: [0, -8, 3, -5, 0],
                        scale: [1, 0.9, 1.05, 0.95, 1],
                        opacity: [0.1, 0.2, 0.15, 0.18, 0.1]
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        delay: 3,
                        ease: "easeInOut"
                    }}
                />

                {/* Soft Particle Effects */}
                <motion.div
                    className="absolute top-16 right-4 w-2 h-2 bg-white/20 rounded-full"
                    animate={{
                        y: [0, -15, 0],
                        x: [0, 3, 0],
                        opacity: [0.2, 0.4, 0.2],
                        scale: [1, 1.3, 1]
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        delay: 1,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-1/3 left-16 w-2 h-2 bg-blue-300/15 rounded-full"
                    animate={{
                        y: [0, 10, 0],
                        x: [0, -5, 0],
                        opacity: [0.15, 0.3, 0.15],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        delay: 2.5,
                        ease: "easeInOut"
                    }}
                />
            </div>

            {/* Main Content - Optimized for responsive layout */}
            <div className="relative z-10 text-white text-center p-2 sm:p-3 lg:p-4 max-w-[90%] sm:max-w-sm lg:max-w-md overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="flex flex-col items-center justify-center"
                >
                    {/* Main Icon and Title - Enhanced for student document focus */}
                    <div className="mb-3 sm:mb-4 lg:mb-6">
                        <motion.div
                            className="w-10 sm:w-14 lg:w-16 h-10 sm:h-14 lg:h-16 mx-auto mb-2 sm:mb-3 bg-white/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl border border-white/30"
                            whileHover={{
                                scale: 1.05,
                                backgroundColor: "rgba(255, 255, 255, 0.25)",
                                borderColor: "rgba(255, 255, 255, 0.4)"
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            <motion.svg
                                className="w-5 sm:w-7 lg:w-8 h-5 sm:h-7 lg:h-8"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                whileHover={{ rotate: 5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                            </motion.svg>
                        </motion.div>
                        <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold mb-2 sm:mb-3 leading-tight bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
                            Tài Liệu Học Tập HUSC
                            <br />
                            <span className="text-sm sm:text-base lg:text-lg font-normal text-white/90">Thư Viện Số Cho Sinh Viên</span>
                        </h3>
                        <p className="text-white/85 leading-relaxed text-xs sm:text-sm lg:text-base font-light max-w-xs sm:max-w-sm mx-auto">
                            Nền tảng học tập hiện đại giúp sinh viên truy cập tài liệu ngay tức thì, có thể xem trực tiếp trên web, dễ dàng tìm kiếm và tải xuống. Tiết kiệm thời gian và nâng cao hiệu quả học tập. 📚
                        </p>
                    </div>

                    {/* Feature Highlights - Improved for student document system */}
                    <div className="space-y-2 sm:space-y-3 text-left">
                        {[
                            {
                                icon: (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                ),
                                color: 'bg-gradient-to-r from-emerald-400 to-emerald-500',
                                text: '🔍 Tìm kiếm thông minh',
                                desc: 'Tìm kiếm nhanh chóng và chính xác theo nhiều tiêu chí'
                            },
                            {
                                icon: (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                ),
                                color: 'bg-gradient-to-r from-blue-400 to-cyan-400',
                                text: '📄 Xem tài liệu trực tuyến',
                                desc: 'Xem trực tiếp trên website không cần tải xuống'
                            },
                            {
                                icon: (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                ),
                                color: 'bg-gradient-to-r from-purple-400 to-indigo-400',
                                text: '📚 Thư viện học thuật',
                                desc: 'Đa dạng tài liệu học tập chất lượng cho sinh viên'
                            },
                            {
                                icon: (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                ),
                                color: 'bg-gradient-to-r from-orange-400 to-pink-400',
                                text: '⚡ Truy cập nhanh chóng',
                                desc: 'Dễ dàng tải xuống và chia sẻ tài liệu học tập'
                            },
                        ].map((feature, index) => (
                            <motion.div
                                key={feature.text}
                                className="flex items-start space-x-2 bg-white/15 backdrop-blur-md rounded-xl p-2 sm:p-3 border border-white/25 shadow-lg"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                    delay: 0.9 + index * 0.15,
                                    duration: 0.6,
                                    ease: "easeOut"
                                }}
                                whileHover={{
                                    scale: 1.02,
                                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                                    borderColor: "rgba(255, 255, 255, 0.4)",
                                    y: -1,
                                    transition: { type: "spring", stiffness: 300, damping: 20 }
                                }}
                            >
                                <motion.div
                                    className={`${feature.color} rounded-lg p-2 flex-shrink-0 shadow-lg border border-white/20`}
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                >
                                    {feature.icon}
                                </motion.div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs sm:text-sm font-semibold text-white leading-tight">
                                        {feature.text}
                                    </div>
                                    <div className="text-[10px] sm:text-xs text-white/75 mt-0.5 leading-relaxed">
                                        {feature.desc}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Call to Action - Enhanced with more student-focused benefits */}
                    <motion.div
                        className="mt-3 sm:mt-5 text-center space-y-1.5"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5, duration: 0.6 }}
                    >
                        <motion.div
                            className="inline-flex items-center space-x-2 bg-gradient-to-r from-white/20 to-white/15 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/30 shadow-lg"
                            whileHover={{
                                scale: 1.03,
                                backgroundColor: "rgba(255, 255, 255, 0.25)"
                            }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <motion.span
                                className="w-1.5 h-1.5 bg-green-400 rounded-full"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <span className="text-xs font-semibold text-white">
                                Hơn 10,000+ tài liệu học tập chất lượng cao
                            </span>
                        </motion.div>

                        <div className="flex flex-col space-y-1">
                            <div className="text-white/80 text-[10px] sm:text-xs font-medium">
                                ✨ Miễn phí cho tất cả sinh viên, giảng viên và cán bộ HUSC
                            </div>
                            <div className="text-white/80 text-[10px] sm:text-xs font-medium">
                                💡 Cập nhật liên tục với tài liệu học tập mới nhất
                            </div>
                            <div className="text-white/80 text-[10px] sm:text-xs font-medium">
                                🎓 Hỗ trợ học tập và nghiên cứu hiệu quả
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default HeroSection;
