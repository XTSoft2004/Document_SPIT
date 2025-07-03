import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Banned",
    description: "Document SPIT",
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return children
}