'use client';
import { motion } from 'framer-motion';

const HeroSection = () => {
    return (
        <motion.div 
            className="w-full lg:w-1/2 min-h-[250px] sm:min-h-[300px] lg:min-h-screen flex items-center justify-center relative overflow-hidden order-1 lg:order-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            style={{
                background: 'linear-gradient(-45deg, #3b82f6, #6366f1, #8b5cf6, #4f46e5, #2563eb)',
                backgroundSize: '400% 400%',
            }}
        >
            {/* Animated Background Overlay */}
            <motion.div
                className="absolute inset-0 opacity-60"
                animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{
                    background: 'linear-gradient(-45deg, rgba(59, 130, 246, 0.8), rgba(99, 102, 241, 0.6), rgba(139, 92, 246, 0.7), rgba(79, 70, 229, 0.8))',
                    backgroundSize: '400% 400%',
                }}
            />
            
            {/* Soft Breathing Effect */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-blue-900/10"
                animate={{
                    scale: [1, 1.02, 1],
                    opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            
            {/* Animated Text Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Floating Keywords */}
                <motion.div
                    className="absolute top-20 left-8 text-white/8 font-bold text-lg select-none"
                    animate={{ 
                        y: [0, -30, 0],
                        opacity: [0.08, 0.15, 0.08],
                        rotate: [0, 3, 0]
                    }}
                    transition={{ 
                        duration: 10, 
                        repeat: Infinity,
                        delay: 0,
                        ease: "easeInOut"
                    }}
                >
                    DOCUMENT
                </motion.div>
                
                <motion.div
                    className="absolute top-32 right-12 text-white/6 font-semibold text-sm select-none"
                    animate={{ 
                        y: [0, 25, 0],
                        x: [0, -10, 0],
                        opacity: [0.06, 0.12, 0.06],
                        rotate: [0, -2, 0]
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
                    className="absolute bottom-32 left-4 text-white/7 font-bold text-base select-none"
                    animate={{ 
                        y: [0, -20, 0],
                        opacity: [0.07, 0.14, 0.07],
                        scale: [1, 1.1, 1]
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

                <motion.div
                    className="absolute top-1/2 right-4 text-white/5 font-medium text-xs select-none"
                    animate={{ 
                        x: [0, 15, 0],
                        y: [0, -8, 0],
                        opacity: [0.05, 0.1, 0.05],
                        rotate: [0, 1, 0]
                    }}
                    transition={{ 
                        duration: 9, 
                        repeat: Infinity,
                        delay: 3,
                        ease: "easeInOut"
                    }}
                >
                    Quản lý
                </motion.div>

                <motion.div
                    className="absolute bottom-20 right-16 text-white/8 font-bold text-lg select-none"
                    animate={{ 
                        y: [0, 18, 0],
                        opacity: [0.08, 0.16, 0.08],
                        rotate: [0, -1, 0]
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

                <motion.div
                    className="absolute top-1/4 left-20 text-white/6 font-semibold text-sm select-none"
                    animate={{ 
                        x: [0, -12, 0],
                        y: [0, 10, 0],
                        opacity: [0.06, 0.12, 0.06],
                        scale: [1, 0.95, 1]
                    }}
                    transition={{ 
                        duration: 7, 
                        repeat: Infinity,
                        delay: 4,
                        ease: "easeInOut"
                    }}
                >
                    Tài liệu
                </motion.div>

                <motion.div
                    className="absolute bottom-1/4 left-1/3 text-white/5 font-medium text-xs select-none"
                    animate={{ 
                        y: [0, -15, 0],
                        x: [0, 8, 0],
                        opacity: [0.05, 0.1, 0.05],
                        rotate: [0, 2, 0]
                    }}
                    transition={{ 
                        duration: 13, 
                        repeat: Infinity,
                        delay: 2.5,
                        ease: "easeInOut"
                    }}
                >
                    Học tập
                </motion.div>

                <motion.div
                    className="absolute top-16 right-1/3 text-white/7 font-bold text-base select-none"
                    animate={{ 
                        y: [0, 22, 0],
                        opacity: [0.07, 0.14, 0.07],
                        rotate: [0, -3, 0]
                    }}
                    transition={{ 
                        duration: 14, 
                        repeat: Infinity,
                        delay: 0.5,
                        ease: "easeInOut"
                    }}
                >
                    SYSTEM
                </motion.div>

                <motion.div
                    className="absolute bottom-16 left-1/2 text-white/6 font-semibold text-sm select-none"
                    animate={{ 
                        x: [0, -18, 0],
                        opacity: [0.06, 0.12, 0.06],
                        scale: [1, 1.05, 1]
                    }}
                    transition={{ 
                        duration: 9, 
                        repeat: Infinity,
                        delay: 3.5,
                        ease: "easeInOut"
                    }}
                >
                    Nghiên cứu
                </motion.div>

                <motion.div
                    className="absolute top-40 left-1/4 text-white/5 font-medium text-xs select-none"
                    animate={{ 
                        y: [0, -12, 0],
                        x: [0, 6, 0],
                        opacity: [0.05, 0.1, 0.05],
                        rotate: [0, 1, 0]
                    }}
                    transition={{ 
                        duration: 10, 
                        repeat: Infinity,
                        delay: 1.8,
                        ease: "easeInOut"
                    }}
                >
                    Thông tin
                </motion.div>

                {/* Large Background Text */}
                <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/3 font-black text-6xl sm:text-7xl lg:text-8xl select-none pointer-events-none"
                    animate={{ 
                        scale: [1, 1.05, 1],
                        opacity: [0.03, 0.06, 0.03],
                        rotate: [0, 0.5, 0]
                    }}
                    transition={{ 
                        duration: 20, 
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    DOCS
                </motion.div>

                {/* Additional Floating Terms */}
                <motion.div
                    className="absolute top-24 right-1/4 text-white/4 font-semibold text-xs select-none"
                    animate={{ 
                        y: [0, -8, 0],
                        opacity: [0.04, 0.08, 0.04],
                        rotate: [0, 1, 0]
                    }}
                    transition={{ 
                        duration: 6, 
                        repeat: Infinity,
                        delay: 4.2,
                        ease: "easeInOut"
                    }}
                >
                    PDF
                </motion.div>

                <motion.div
                    className="absolute bottom-8 right-1/4 text-white/4 font-medium text-xs select-none"
                    animate={{ 
                        x: [0, 10, 0],
                        opacity: [0.04, 0.08, 0.04]
                    }}
                    transition={{ 
                        duration: 8, 
                        repeat: Infinity,
                        delay: 2.8,
                        ease: "easeInOut"
                    }}
                >
                    EXCEL
                </motion.div>

                <motion.div
                    className="absolute top-2/3 left-8 text-white/4 font-medium text-xs select-none"
                    animate={{ 
                        y: [0, 12, 0],
                        opacity: [0.04, 0.08, 0.04],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                        duration: 11, 
                        repeat: Infinity,
                        delay: 3.8,
                        ease: "easeInOut"
                    }}
                >
                    POWERPOINT
                </motion.div>

                <motion.div
                    className="absolute top-8 left-1/2 text-white/4 font-semibold text-xs select-none"
                    animate={{ 
                        x: [0, -6, 0],
                        y: [0, 8, 0],
                        opacity: [0.04, 0.08, 0.04]
                    }}
                    transition={{ 
                        duration: 7, 
                        repeat: Infinity,
                        delay: 1.2,
                        ease: "easeInOut"
                    }}
                >
                    WORD
                </motion.div>
            </div>

            {/* Floating Academic Elements */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Floating Book Icons */}
                <motion.div
                    className="absolute top-12 left-12 w-8 h-8 text-white/15"
                    animate={{ 
                        y: [0, -15, 0], 
                        rotate: [0, 8, 0],
                        opacity: [0.15, 0.35, 0.15]
                    }}
                    transition={{ 
                        duration: 6, 
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                    </svg>
                </motion.div>

                {/* Floating Search Icons */}
                <motion.div
                    className="absolute top-1/3 right-16 w-6 h-6 text-white/20"
                    animate={{ 
                        y: [0, 12, 0], 
                        scale: [1, 1.15, 1],
                        opacity: [0.2, 0.4, 0.2],
                        rotate: [0, -5, 0]
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
                    className="absolute bottom-1/4 left-8 w-5 h-5 text-yellow-300/25"
                    animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.3, 1],
                        opacity: [0.25, 0.55, 0.25]
                    }}
                    transition={{ 
                        duration: 8, 
                        repeat: Infinity,
                        delay: 1.5,
                        ease: "easeInOut"
                    }}
                >
                    <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                </motion.div>

                {/* Additional Floating Elements */}
                <motion.div
                    className="absolute top-1/2 left-4 w-4 h-4 text-white/10"
                    animate={{ 
                        x: [0, 8, 0],
                        y: [0, -6, 0],
                        opacity: [0.1, 0.3, 0.1],
                        scale: [1, 1.2, 1]
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
                    className="absolute top-20 right-20 w-20 h-20 bg-white/8 rounded-3xl"
                    animate={{ 
                        rotate: [0, 15, -10, 15, 0],
                        scale: [1, 1.08, 0.95, 1.05, 1],
                        opacity: [0.08, 0.15, 0.12, 0.18, 0.08]
                    }}
                    transition={{ 
                        duration: 12, 
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-16 right-8 w-16 h-16 bg-white/12 rounded-full"
                    animate={{ 
                        y: [0, -12, 4, -8, 0],
                        scale: [1, 0.9, 1.1, 0.95, 1],
                        opacity: [0.12, 0.25, 0.18, 0.22, 0.12]
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
                        y: [0, -20, 0],
                        x: [0, 5, 0],
                        opacity: [0.2, 0.6, 0.2],
                        scale: [1, 1.5, 1]
                    }}
                    transition={{ 
                        duration: 6, 
                        repeat: Infinity,
                        delay: 1,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-1/3 left-16 w-3 h-3 bg-blue-300/15 rounded-full"
                    animate={{ 
                        y: [0, 15, 0],
                        x: [0, -8, 0],
                        opacity: [0.15, 0.4, 0.15],
                        scale: [1, 1.3, 1]
                    }}
                    transition={{ 
                        duration: 8, 
                        repeat: Infinity,
                        delay: 2.5,
                        ease: "easeInOut"
                    }}
                />
            </div>

            {/* Main Content */}
            <div className="relative z-10 text-white text-center p-4 sm:p-6 lg:p-8 max-w-xs sm:max-w-sm lg:max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                >
                    {/* Main Icon and Title */}
                    <div className="mb-6 sm:mb-8 lg:mb-10">
                        <motion.div 
                            className="w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 mx-auto mb-4 sm:mb-6 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl border border-white/30"
                            whileHover={{ 
                                scale: 1.05,
                                backgroundColor: "rgba(255, 255, 255, 0.25)",
                                borderColor: "rgba(255, 255, 255, 0.4)"
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            <motion.svg 
                                className="w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12" 
                                fill="currentColor" 
                                viewBox="0 0 24 24"
                                whileHover={{ rotate: 5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                            </motion.svg>
                        </motion.div>
                        <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-3 sm:mb-4 leading-tight bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
                            Document SPIT
                            <br />
                            <span className="text-base sm:text-lg lg:text-xl font-normal text-white/90">Hệ Thống Quản Lý Tài Liệu</span>
                        </h3>
                        <p className="text-white/85 leading-relaxed text-sm sm:text-base lg:text-lg font-light max-w-sm mx-auto">
                            Tìm kiếm tài liệu một cách dễ dàng. Hệ thống hiện đại với giao diện thân thiện, giúp bạn truy cập thông tin nhanh chóng và hiệu quả. 🎓
                        </p>
                    </div>

                    {/* Feature Highlights */}
                    <div className="space-y-3 sm:space-y-4 text-left">
                        {[
                            { 
                                icon: (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                ),
                                color: 'bg-gradient-to-r from-emerald-400 to-emerald-500', 
                                text: '🔍 Tìm kiếm nâng cao',
                                desc: 'Tìm kiếm tài liệu theo nhiều tiêu chí'
                            },
                            { 
                                icon: (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                ),
                                color: 'bg-gradient-to-r from-green-400 to-emerald-400', 
                                text: '✅ Duyệt tự động',
                                desc: 'Hệ thống phê duyệt thông minh'
                            },
                            { 
                                icon: (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                ),
                                color: 'bg-gradient-to-r from-blue-400 to-cyan-400', 
                                text: '📚 Kho tài liệu phong phú',
                                desc: 'Đa dạng loại tài liệu, dễ dàng phân loại'
                            },
                            { 
                                icon: (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                ),
                                color: 'bg-gradient-to-r from-indigo-400 to-blue-400', 
                                text: '� Bảo mật cao',
                                desc: 'Hệ thống đăng nhập an toàn'
                            },
                        ].map((feature, index) => (
                            <motion.div
                                key={feature.text}
                                className="flex items-start space-x-3 bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/25 shadow-lg"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ 
                                    delay: 0.9 + index * 0.15, 
                                    duration: 0.6,
                                    ease: "easeOut"
                                }}
                                whileHover={{ 
                                    scale: 1.03,
                                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                                    borderColor: "rgba(255, 255, 255, 0.4)",
                                    y: -2,
                                    transition: { type: "spring", stiffness: 300, damping: 20 }
                                }}
                            >
                                <motion.div 
                                    className={`${feature.color} rounded-xl p-2.5 flex-shrink-0 shadow-lg border border-white/20`}
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                >
                                    {feature.icon}
                                </motion.div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm sm:text-base font-semibold text-white leading-tight">
                                        {feature.text}
                                    </div>
                                    <div className="text-xs sm:text-sm text-white/75 mt-1 leading-relaxed">
                                        {feature.desc}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Call to Action */}
                    <motion.div
                        className="mt-6 sm:mt-8 text-center space-y-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5, duration: 0.6 }}
                    >
                        <motion.div 
                            className="inline-flex items-center space-x-2 bg-gradient-to-r from-white/20 to-white/15 backdrop-blur-md rounded-full px-5 py-3 border border-white/30 shadow-lg"
                            whileHover={{ 
                                scale: 1.05,
                                backgroundColor: "rgba(255, 255, 255, 0.25)"
                            }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <motion.span 
                                className="w-2 h-2 bg-green-400 rounded-full"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <span className="text-sm font-semibold text-white">
                                Đã có hơn 10,000+ tài liệu chất lượng
                            </span>
                        </motion.div>
                        
                        <div className="text-white/75 text-xs font-medium">
                            ✨ Miễn phí cho tất cả cán bộ, giảng viên và sinh viên HUSC
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default HeroSection;
