import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tài khoản bị cấm - SPIT Document",
    description: "Tài khoản của bạn đã bị tạm khóa do vi phạm chính sách cộng đồng SPIT Document. Tìm hiểu cách khôi phục tài khoản và tuân thủ quy định.",
    keywords: [
        'tài khoản bị khóa',
        'vi phạm chính sách',
        'khôi phục tài khoản',
        'quy định SPIT Document'
    ],
    openGraph: {
        title: "Tài khoản bị cấm - SPIT Document",
        description: "Tài khoản của bạn đã bị tạm khóa do vi phạm chính sách cộng đồng",
        type: 'website',
    },
    robots: {
        index: false,
        follow: false,
    },
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return children
}