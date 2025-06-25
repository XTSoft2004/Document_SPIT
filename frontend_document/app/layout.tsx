import "./globals.css";
import type { Metadata } from "next";
import { AntdRegistry } from '@ant-design/nextjs-registry'
import Header from "@/layout/Header";

export const metadata: Metadata = {
  title: "Trang chủ SPIT",
  description: "Trang chủ của SPIT - Nơi chia sẻ tài liệu học tập và đóng góp kiến thức",
  icons: {
    icon: "/logo/logo-500x500.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          {children}
        </AntdRegistry>
      </body>
    </html >
  );
}
