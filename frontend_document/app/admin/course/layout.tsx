import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Quản lý khóa học - SPIT Admin",
    description: "Quản lý thông tin khóa học và môn học trong hệ thống SPIT Document. Thêm, chỉnh sửa và tổ chức các khóa học cho sinh viên CNTT HUSC.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function CourseLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
