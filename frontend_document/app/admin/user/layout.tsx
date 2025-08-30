import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Quản lý người dùng - SPIT Admin",
    description: "Quản lý tài khoản người dùng và phân quyền trong hệ thống SPIT Document. Theo dõi hoạt động và đảm bảo an toàn cộng đồng.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
