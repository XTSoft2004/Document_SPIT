'use client';
import { motion } from 'framer-motion';

export default function ModernAuthLoading() {
    return (
        <div className="flex flex-col items-center justify-center space-y-6 py-8">
            {/* Modern Spinning Loader */}
            <div className="relative">
                {/* Outer ring */}
                <motion.div
                    className="w-16 h-16 border-4 border-blue-200 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />

                {/* Inner spinning ring */}
                <motion.div
                    className="absolute inset-2 w-12 h-12 border-4 border-transparent border-t-blue-600 border-r-purple-600 rounded-full"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />

                {/* Center dot */}
                <motion.div
                    className="absolute inset-6 w-4 h-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                />
            </div>

            {/* Animated text */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-2"
            >
                <motion.h3
                    className="text-lg font-semibold text-gray-700"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    Đang xử lý...
                </motion.h3>

                {/* Loading dots */}
                <div className="flex justify-center space-x-1">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 bg-blue-500 rounded-full"
                            animate={{ y: [0, -8, 0] }}
                            transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: i * 0.2,
                            }}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
