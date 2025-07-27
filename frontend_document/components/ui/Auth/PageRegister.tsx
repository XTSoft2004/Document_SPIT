'use client';
import { useForm } from 'react-hook-form';
import { Button } from 'antd';
import { CustomTextField } from '@/components/ui/Input/CustomTextField';
import { CircleUser, KeyRound, SquareUserRound } from 'lucide-react';
import { IRegisterRequest } from '@/types/auth';
import { registerAccount } from '@/actions/auth.actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ModernAuthLoading from '@/components/ui/Loading/ModernAuthLoading';
import NotificationService from '@/components/ui/Notification/NotificationService';
import { motion } from 'framer-motion';

export default function PageRegister({ setIsSignIn }: { setIsSignIn: (value: boolean) => void }) {
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
            NotificationService.success({
                message: 'Đăng ký thành công',
                description: `Chào mừng bạn ${data.username} đã đăng ký thành công!`,
            });
            setLoading(false);
            setIsSignIn(true);
            return;
        }
        setLoading(false);
        NotificationService.error({
            message: register.message || 'Đăng ký thất bại',
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full h-full flex flex-col justify-center"
        >
            <div className="flex flex-col justify-center space-y-4">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-3"
                >
                    <div className="space-y-3">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                        >
                            <CustomTextField
                                control={control}
                                errors={errors}
                                name="username"
                                placeholder="Nhập tên đăng nhập"
                                icon={<CircleUser size={18} className="text-gray-400" />}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.3 }}
                        >
                            <CustomTextField
                                control={control}
                                errors={errors}
                                name="fullname"
                                type="text"
                                placeholder="Nhập họ và tên"
                                icon={<SquareUserRound size={18} className="text-gray-400" />}
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
                                placeholder="Tạo mật khẩu"
                                icon={<KeyRound size={18} className="text-gray-400" />}
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
                        >                                <Button
                            type="primary"
                            htmlType="submit"
                            disabled={loading}
                            className="w-full h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 border-none shadow-md hover:shadow-lg transition-all duration-300"
                            style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)', fontSize: 16, height: 48, borderRadius: '16px' }}
                        >
                                {loading ? (
                                    <span className="text-white flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Đang đăng ký...</span>
                                    </span>
                                ) : (
                                    'Đăng ký'
                                )}
                            </Button>
                        </motion.div>
                    </motion.div>
                </form>

                {/* Terms and conditions */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                    className="text-center text-xs text-gray-500 pt-1"
                >
                    <p className="leading-relaxed">
                        Bằng việc tạo tài khoản, bạn đồng ý với{' '}
                        <a href="#" className="text-blue-600 hover:underline">Điều khoản dịch vụ</a>
                        {' '}và{' '}
                        <a href="#" className="text-blue-600 hover:underline">Chính sách bảo mật</a>
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
}