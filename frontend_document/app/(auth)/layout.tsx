import type { Metadata } from 'next';
import { ReactNode } from 'react';

// Dynamic metadata based on the route
export async function generateMetadata({
    params,
    searchParams,
}: {
    params: any;
    searchParams: Record<string, string | string[] | undefined>;
}): Promise<Metadata> {
    // Since this is a layout for /login and /register, we can't directly access the pathname
    // We can use a fallback or check the route context
    // For simplicity, assume the route is inferred from the page being rendered
    // const isRegister = searchParams.isRegister === 'true'; // Optional: Pass isRegister via query param
    // if (isRegister) {
    //     return {
    //         title: 'Đăng ký tài khoản',
    //         description: 'Tạo tài khoản mới để bắt đầu sử dụng SPIT Document',
    //     };
    // }
    return {
        title: 'Đăng nhập tài khoản',
        description: 'Đăng nhập vào tài khoản của bạn',
    };
}

export default function AuthLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>): JSX.Element {
    return <>{children}</>;
}