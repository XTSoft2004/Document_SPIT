import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Tài liệu bị từ chối - SPIT Admin",
    description: "Danh sách tài liệu đã bị từ chối trong hệ thống SPIT Document. Quản lý và theo dõi nội dung không đạt yêu cầu.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function RejectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
