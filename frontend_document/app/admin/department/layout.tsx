import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Quản lý khoa - SPIT Admin",
    description: "Quản lý thông tin các khoa và ngành học trong hệ thống SPIT Document. Tổ chức cấu trúc giáo dục cho sinh viên CNTT HUSC.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function DepartmentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
