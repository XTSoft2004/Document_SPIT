import '@/app/globals.css'
import type { Metadata } from 'next'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import AppInitializer from '@/components/ui/Loading/AppInitializer'
import PageTransitionLoader from '@/components/ui/Loading/PageTransitionLoader'
import Header from '@/layout/Header'
import Footer from '@/layout/Footer'
import React, { useState, useEffect } from 'react'
import { AuthProvider } from '@/context/AuthContext'

export const metadata: Metadata = {
  title: 'Trang chủ - SPIT Document',
  description:
    'Khám phá hàng ngàn tài liệu học tập chất lượng cao từ sinh viên Khoa CNTT HUSC. Chia sẻ bài giảng, đề thi, slide và kiến thức để cùng nhau phát triển.',
  keywords: [
    'trang chủ SPIT',
    'tài liệu CNTT HUSC',
    'chia sẻ kiến thức',
    'học tập trực tuyến',
    'cộng đồng sinh viên CNTT'
  ],
  openGraph: {
    title: 'Trang chủ - SPIT Document',
    description: 'Khám phá hàng ngàn tài liệu học tập chất lượng cao từ sinh viên Khoa CNTT HUSC',
    type: 'website',
    url: 'https://document.spit-husc.io.vn/',
  },
  icons: {
    icon: '/logo/logo-500x500.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Không sử dụng useEffect trong layout, nên loại bỏ logic isMobile
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <AppInitializer>
            <PageTransitionLoader />
            <AuthProvider>
              <div
                className="sticky top-0 z-10 flex-shrink-0"
                style={{
                  background:
                    'linear-gradient(to bottom right, #f8fafc , #eff6ff , #e0e7ff)',
                }}
              >
                <Header />
                {children}
                <Footer />
              </div>
            </AuthProvider>
          </AppInitializer>
        </AntdRegistry>
      </body>
    </html>
  )
}
