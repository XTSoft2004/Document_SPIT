import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tài liệu học tập",
    description: "Đây là nơi bạn có thể tìm kiếm và đóng góp tài liệu học tập cho cộng đồng SPIT.",
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return children
}