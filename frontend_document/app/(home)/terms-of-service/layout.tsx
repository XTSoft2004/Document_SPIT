import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Điều khoản dịch vụ - SPIT Document",
    description: "Điều khoản dịch vụ của SPIT Document. Bảo vệ thông tin cá nhân và dữ liệu người dùng.",
    keywords: [
        'điều khoản dịch vụ',
        'quyền riêng tư',
        'bảo vệ dữ liệu',
    ],
    openGraph: {
        title: "Điều khoản dịch vụ - SPIT Document",
        description: "Điều khoản dịch vụ của SPIT Document",
        type: 'website',
    },
};

export default function TermsOfServiceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
