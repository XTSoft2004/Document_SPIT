import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Quản lý danh mục - SPIT Admin",
    description: "Quản lý danh mục và phân loại tài liệu trong hệ thống SPIT Document. Tạo, chỉnh sửa và tổ chức các danh mục tài liệu học tập.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function CategoryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
