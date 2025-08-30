import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Profile - SPIT Document",
    description: "Trang cá nhân người dùng SPIT Document. Xem thông tin cá nhân, tài liệu đã đóng góp và thành tích của bạn.",
    keywords: [
        'profile người dùng',
        'trang cá nhân',
        'thông tin tài khoản',
        'tài liệu đã đóng góp'
    ],
    openGraph: {
        title: "Profile - SPIT Document",
        description: "Trang cá nhân người dùng SPIT Document",
        type: 'profile',
    },
};

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
