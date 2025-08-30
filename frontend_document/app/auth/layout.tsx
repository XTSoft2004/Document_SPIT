import '@/app/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Đăng nhập - SPIT Document",
    description: "Đăng nhập hoặc tạo tài khoản mới để truy cập đầy đủ các tính năng của SPIT Document. Chia sẻ tài liệu, tích lũy điểm thưởng và kết nối với cộng đồng CNTT HUSC.",
    keywords: [
        'đăng nhập SPIT',
        'đăng ký tài khoản',
        'tài khoản học tập',
        'truy cập SPIT Document'
    ],
    openGraph: {
        title: "Đăng nhập & Đăng ký - SPIT Document",
        description: "Đăng nhập hoặc tạo tài khoản mới để truy cập đầy đủ các tính năng của SPIT Document",
        type: 'website',
        url: 'https://document.spit-husc.io.vn/auth',
    },
    robots: {
        index: false,
        follow: true,
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html>
            <body>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
