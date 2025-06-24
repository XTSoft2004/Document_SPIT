'use client';
import { useForm } from 'react-hook-form';
import { LockOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { CustomTextField } from '@/components/ui/Input/CustomTextField';
import { CircleUser, KeyRound } from 'lucide-react';
import { ILoginRequest } from '@/types/auth';
import { loginAccount } from '@/actions/auth.actions';
import { getOrCreateDeviceId } from '@/utils/deviceId';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import NotificationService from '@/components/ui/Notification/NotificationService';
import { motion } from 'framer-motion'; // Thêm Framer Motion
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
            router.push('/dashboard');
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
    }; return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
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
                                placeholder="Enter your username"
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
                                placeholder="Enter your password"
                                icon={<KeyRound size={20} className="text-gray-400" />}
                            />
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.3 }}
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
                                className="w-full h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 border-none shadow-lg hover:shadow-xl transition-all duration-300"
                                style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }}
                            >
                                Sign In
                            </Button>
                        </motion.div>
                    </motion.div>
                </form>
            )}
        </motion.div>
    );
}