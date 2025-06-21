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
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 100 }} // Bắt đầu từ phải (x: 100) => cuộn qua trái
            animate={{ opacity: 1, x: 0 }}   // Về vị trí ban đầu
            transition={{ duration: 0.4, ease: 'easeOut' }}
            exit={{ opacity: 0, x: -100 }}
        >
            {loading ? (
                <MoonLoading />
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 min-h-[150px] transition-all duration-300 ease-in-out">
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
                    <CustomTextField
                        control={control}
                        errors={errors}
                        name="fullname"
                        type="text"
                        placeholder="Họ và tên"
                        icon={<SquareUserRound size={25} />}
                    />
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="mt-3 w-full h-12 text-lg font-bold rounded-[16px]"
                        >
                            Đăng ký
                        </Button>
                    </motion.div>
                </form>
            )}
        </motion.div>
    );
}