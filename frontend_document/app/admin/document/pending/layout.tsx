import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Tài liệu chờ duyệt - SPIT Admin",
    description: "Danh sách tài liệu đang chờ được duyệt trong hệ thống SPIT Document. Kiểm tra và phê duyệt nội dung từ cộng đồng.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function PendingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
