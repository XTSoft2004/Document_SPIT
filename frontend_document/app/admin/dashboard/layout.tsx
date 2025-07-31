import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Dashboard - SPIT Admin",
    description: "Dashboard tổng quan thống kê và quản lý hệ thống SPIT Document. Xem số liệu người dùng, tài liệu và hoạt động của nền tảng.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
