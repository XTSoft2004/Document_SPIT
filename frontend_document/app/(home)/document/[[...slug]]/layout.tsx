import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tài liệu học tập - SPIT Document",
    description: "Khám phá thư viện tài liệu học tập phong phú với bài giảng, đề thi, slide và tài liệu tham khảo từ các môn học tại Khoa CNTT HUSC. Tìm kiếm và tải về miễn phí.",
    keywords: [
        'tài liệu học tập',
        'thư viện tài liệu CNTT',
        'bài giảng đại học',
        'đề thi CNTT HUSC',
        'slide bài học',
        'tài liệu tham khảo'
    ],
    openGraph: {
        title: "Tài liệu học tập - SPIT Document",
        description: "Khám phá thư viện tài liệu học tập phong phú từ Khoa CNTT HUSC",
        type: 'website',
        url: 'https://document.spit-husc.io.vn/document',
    },
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return children
}