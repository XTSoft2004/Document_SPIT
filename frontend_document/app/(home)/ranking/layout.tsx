import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Bảng xếp hạng - SPIT Document",
    description: "Xem bảng xếp hạng những người đóng góp tài liệu nhiều nhất tại SPIT Document. Theo dõi điểm số và thành tích chia sẻ kiến thức của cộng đồng CNTT HUSC.",
    keywords: [
        'bảng xếp hạng',
        'top đóng góp',
        'điểm thưởng',
        'thành tích chia sẻ',
        'cộng đồng SPIT'
    ],
    openGraph: {
        title: "Bảng xếp hạng đóng góp - SPIT Document",
        description: "Xem bảng xếp hạng những người đóng góp tài liệu nhiều nhất",
        type: 'website',
        url: 'https://document.spit-husc.io.vn/ranking',
    },
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return children
}