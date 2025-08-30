import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Đóng góp tài liệu - SPIT Document",
    description: "Đóng góp tài liệu học tập của bạn để giúp đỡ cộng đồng sinh viên CNTT HUSC. Upload bài giảng, đề thi, slide và nhận điểm thưởng từ hệ thống.",
    keywords: [
        'đóng góp tài liệu',
        'upload tài liệu',
        'chia sẻ kiến thức',
        'kiếm điểm thưởng',
        'đóng góp cộng đồng SPIT'
    ],
    openGraph: {
        title: "Đóng góp tài liệu - SPIT Document",
        description: "Đóng góp tài liệu học tập để giúp đỡ cộng đồng sinh viên CNTT HUSC",
        type: 'website',
        url: 'https://document.spit-husc.io.vn/contribute',
        images: [
            {
                url: 'https://document.spit-husc.io.vn/contribute.png',
                width: 1200,
                height: 630,
                alt: 'Đóng góp tài liệu SPIT Document',
            },
        ],
    },
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return children
}