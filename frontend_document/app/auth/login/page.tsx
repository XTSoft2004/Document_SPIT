'use client';
import { useForm } from 'react-hook-form';
import { Button } from 'antd';
import { CustomTextField } from '@/components/ui/Input/CustomTextField';
import { CircleUser, KeyRound } from 'lucide-react';
import { ILoginRequest } from '@/types/auth';
import { loginAccount } from '@/actions/auth.actions';
import { getOrCreateDeviceId } from '@/utils/deviceId';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import NotificationService from '@/components/ui/Notification/NotificationService';
import { motion } from 'framer-motion';
import ModernAuthLoading from '@/components/ui/Loading/ModernAuthLoading';

export default function PageLogin() {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: any) => {
        setLoading(true);
        const deviceId = getOrCreateDeviceId();
        const loginRequest: ILoginRequest = {
            username: data.username,
            password: data.password,
            deviceId: deviceId,
        };

        const login = await loginAccount(loginRequest);
        if (login.ok) {
            router.push('/admin/dashboard');
            NotificationService.success({
                message: 'Đăng nhập thành công',
                description: `Chào mừng bạn ${data.username} đã đăng nhập thành công!`,
            });
            return;
        }
        setLoading(false);
        NotificationService.error({
            message: login.message || 'Đăng nhập thất bại',
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full h-full flex flex-col justify-center"
        >
            {loading ? (
                <div className="flex items-center justify-center flex-1">
                    <ModernAuthLoading />
                </div>
            ) : (
                <div className="flex flex-col justify-center space-y-6">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-5"
                    >
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.3 }}
                            >
                                <CustomTextField
                                    control={control}
                                    errors={errors}
                                    name="username"
                                    placeholder="Enter your username"
                                    icon={<CircleUser size={18} className="text-gray-400" />}
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.3 }}
                            >
                                <CustomTextField
                                    control={control}
                                    errors={errors}
                                    name="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    icon={<KeyRound size={18} className="text-gray-400" />}
                                />
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.3 }}
                            className="pt-4"
                        >
                            <motion.div
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="w-full"
                            >
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="w-full h-14 text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 border-none shadow-md hover:shadow-lg transition-all duration-300"
                                    style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', fontSize: '18px', height: '56px', borderRadius: '16px' }}
                                >
                                    Sign In
                                </Button>
                            </motion.div>
                        </motion.div>
                    </form>

                    {/* Forgot Password */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                        className="text-center pt-4"
                    >
                        <a href="#" className="text-sm text-blue-600 hover:underline">
                            Forgot your password?
                        </a>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}