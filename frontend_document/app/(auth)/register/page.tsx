'use client';
import { useForm } from 'react-hook-form';
import { LockOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { CustomTextField } from '@/components/ui/Input/CustomTextField';
import { CircleUser, CircleUserRound, KeyRound, SquareUserRound } from 'lucide-react';
import { IRegisterRequest } from '@/types/auth';
import { registerAccount } from '@/actions/auth.actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import MoonLoading from '@/components/ui/Loading/MoonLoading';
import ModernAuthLoading from '@/components/ui/Loading/ModernAuthLoading';
import NotificationService from '@/components/ui/Notification/NotificationService';
import { motion } from 'framer-motion'; // Thêm Framer Motion   

export default function PageRegister() {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: any) => {
        setLoading(true);
        const registerRequest: IRegisterRequest = {
            username: data.username,
            password: data.password,
            fullname: data.fullname,
        };

        const register = await registerAccount(registerRequest);
        if (register.ok) {
            router.push('/login');
            NotificationService.success({
                message: 'Đăng ký thành công',
                description: `Chào mừng bạn ${data.username} đã đăng ký thành công!`,
            });
            return;
        }
        setLoading(false);
        NotificationService.error({
            message: register.message || 'Đăng ký thất bại',
        });
    }; return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full"
            style={{ height: 320 }} // Chiều dài cố định
        >
            {loading ? (
                <ModernAuthLoading />
            ) : (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-5">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                        >                            <CustomTextField
                                control={control}
                                errors={errors}
                                name="username"
                                placeholder="Choose a username"
                                label="Username"
                                icon={<CircleUser size={20} className="text-gray-400" />}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.3 }}
                        >                            <CustomTextField
                                control={control}
                                errors={errors}
                                name="password"
                                type="password"
                                placeholder="Create a password"
                                label="Password"
                                icon={<KeyRound size={20} className="text-gray-400" />}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.3 }}
                        >                            <CustomTextField
                                control={control}
                                errors={errors}
                                name="fullname"
                                type="text"
                                placeholder="Enter your full name"
                                label="Full Name"
                                icon={<SquareUserRound size={20} className="text-gray-400" />}
                            />
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                        className="pt-2"
                    >
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full"
                        >
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="w-full h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 border-none shadow-lg hover:shadow-xl transition-all duration-300"
                                style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)' }}
                            >
                                Create Account
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Terms and conditions */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.3 }}
                        className="text-center text-xs text-gray-500 pt-4"
                    >
                        <p>
                            By creating an account, you agree to our{' '}
                            <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                            {' '}and{' '}
                            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                        </p>
                    </motion.div>
                </form>
            )}
        </motion.div>
    );
}