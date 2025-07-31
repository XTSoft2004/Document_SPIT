import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Quản lý tài liệu - SPIT Admin",
    description: "Quản lý, duyệt và kiểm duyệt tài liệu trong hệ thống SPIT Document. Đảm bảo chất lượng và tính phù hợp của nội dung học tập.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function DocumentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
