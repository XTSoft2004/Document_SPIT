import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Profile người dùng - SPIT Document",
    description: "Xem thông tin profile và tài liệu đóng góp của người dùng trên SPIT Document.",
    robots: {
        index: true,
        follow: true,
    },
};

export default function UserProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
