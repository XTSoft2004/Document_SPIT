import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Chính sách bảo mật - SPIT Document",
    description: "Chính sách bảo mật của SPIT Document. Bảo vệ thông tin cá nhân và dữ liệu người dùng.",
    keywords: [
        'chính sách bảo mật',
        'quyền riêng tư',
        'bảo vệ dữ liệu',
    ],
    openGraph: {
        title: "Chính sách bảo mật - SPIT Document",
        description: "Chính sách bảo mật của SPIT Document",
        type: 'website',
    },
};

export default function PrivacyPolicyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
