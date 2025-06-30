import "./globals.css";
import type { Metadata } from "next";
import { AntdRegistry } from '@ant-design/nextjs-registry'
import AppInitializer from "@/components/ui/Loading/AppInitializer";
import PageTransitionLoader from "@/components/ui/Loading/PageTransitionLoader";

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
          <AppInitializer>
            <PageTransitionLoader />
            {children}
          </AppInitializer>
        </AntdRegistry>
      </body>
    </html >
  );
}
