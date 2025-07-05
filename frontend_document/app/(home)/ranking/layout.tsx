import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Bảng xếp hạng chia sẻ tài liệu",
    description: "Document SPIT",
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return children
}