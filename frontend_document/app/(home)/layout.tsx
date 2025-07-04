import '@/app/globals.css';
import type { Metadata } from "next";
import { AntdRegistry } from '@ant-design/nextjs-registry'
import AppInitializer from "@/components/ui/Loading/AppInitializer";
import PageTransitionLoader from "@/components/ui/Loading/PageTransitionLoader";
import Header from "@/layout/Header";
import Footer from "@/layout/Footer";
import React, { useState, useEffect } from "react";

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
  // Không sử dụng useEffect trong layout, nên loại bỏ logic isMobile
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <AppInitializer>
            <PageTransitionLoader />
            <div className="sticky top-0 z-10 flex-shrink-0"
              style={{
                background: 'linear-gradient(to bottom right, #f8fafc , #eff6ff , #e0e7ff)',
              }}>
              <Header />
              {children}
              <Footer />
            </div>
          </AppInitializer>
        </AntdRegistry>
      </body>
    </html>
  );
}
