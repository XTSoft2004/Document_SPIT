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
import MoonLoading from '@/components/ui/MoonLoading';

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
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -100 }} // Bắt đầu từ trái
            animate={{ opacity: 1, x: 0 }}    // Trượt sang phải đến đúng vị trí
            transition={{ duration: 0.4, ease: 'easeOut' }}
            exit={{ opacity: 0, x: 100 }}
        >
            {loading ? (
                <MoonLoading />
            ) : (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5 min-h-[150px] transition-all duration-300 ease-in-out"
                >
                    <CustomTextField
                        control={control}
                        errors={errors}
                        name="username"
                        placeholder="Tên đăng nhập"
                        icon={<CircleUser size={25} />}
                    />
                    <CustomTextField
                        control={control}
                        errors={errors}
                        name="password"
                        type="password"
                        placeholder="Mật khẩu"
                        icon={<KeyRound size={25} />}
                    />
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="mt-3 w-full h-12 text-lg font-bold rounded-[16px]"
                        >
                            Đăng nhập
                        </Button>
                    </motion.div>
                </form>
            )}
        </motion.div>
    );
}