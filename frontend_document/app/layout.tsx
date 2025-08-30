import type { Metadata } from "next";
import { ReactNode } from "react";
import Script from "next/script";
import GlobalClickTracker from "@/components/analytics/GlobalClickTracker";
import AnalyticsTracker from "@/components/analytics/AnalyticsTracker";

export const metadata: Metadata = {
    title: "SPIT Document - Nền tảng chia sẻ tài liệu CNTT HUSC",
    description:
        "SPIT Document là nền tảng chia sẻ bài giảng, đề thi, slide, bài tập lớn và nhiều tài liệu học tập chất lượng khác. Giúp sinh viên Khoa CNTT HUSC học tập hiệu quả và lan tỏa tri thức.",
    keywords: [
        "SPIT",
        "Spit-Husc",
        "SPIT Document",
        "chia sẻ tài liệu",
        "tài liệu học tập",
        "Khoa CNTT HUSC",
        "bài giảng",
        "đề thi",
        "slide bài học",
        "bài tập lớn",
        "tài liệu đại học",
        "câu lạc bộ lập trình",
        "SPIT HUSC",
        "CLB CNTT",
        "CLB SPIT",
        "CLB Lập trình",
        "spit-husc.io.vn",
        "document.spit-husc.io.vn",
    ],
    metadataBase: new URL("https://document.spit-husc.io.vn/"),
    openGraph: {
        type: "website",
        url: "https://document.spit-husc.io.vn/",
        title:
            "SPIT Document – Nền tảng chia sẻ tài liệu học tập | Khoa CNTT HUSC",
        description:
            "Chia sẻ bài giảng, đề thi, slide, bài tập lớn và nhiều tài liệu học tập hữu ích khác cho sinh viên tại Khoa Công nghệ Thông tin – Đại học Khoa học Huế.",
        siteName: "SPIT Document",
        images: [
            {
                url: "https://document.spit-husc.io.vn/thumbnail.png",
                width: 1200,
                height: 630,
                alt: "Trang chủ của SPIT Document",
            },
            {
                url: "https://document.spit-husc.io.vn/contribute.png",
                width: 1200,
                height: 630,
                alt: "Trang đóng góp tài liệu của SPIT Document",
            },
        ],
        locale: "vi_VN",
    },
    twitter: {
        card: "summary_large_image",
        title:
            "SPIT Document – Nền tảng chia sẻ tài liệu học tập | Khoa CNTT HUSC",
        description:
            "Truy cập SPIT Document để tìm kiếm và chia sẻ tài liệu học tập chất lượng dành cho sinh viên CNTT HUSC.",
        images: ["https://document.spit-husc.io.vn/thumbnail.png"],
    },
    icons: {
        icon: "/favicon.ico",
    },
    themeColor: "#ffffff",
    viewport: {
        width: "device-width",
        initialScale: 1,
        maximumScale: 1,
    },
};

// Component nhỏ để dùng hook Analytics trong client moved to components/analytics/AnalyticsTracker

export default function RootLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <html lang="vi">
            <head>
                {/* Google tag (gtag.js) */}
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-VCV719T3K1"
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-VCV719T3K1', {
                        page_path: window.location.pathname,
                        });
                    `}
                </Script>
            </head>
            <body>
                {/* Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            name: "SPIT Document",
                            url: "https://document.spit-husc.io.vn/",
                            description:
                                "Chia sẻ bài giảng, đề thi, slide, tài liệu học tập chất lượng cho sinh viên HUSC.",
                            sameAs: [
                                "https://www.facebook.com/clbhtlt.ithusc",
                                "https://discord.gg/nEH7uvsBA4",
                                "https://it.husc.edu.vn/",
                            ],
                        }),
                    }}
                />

                {/* Track pageview khi đổi route */}
                <AnalyticsTracker />

                {/* Track click link tự động */}
                <GlobalClickTracker />

                {children}
            </body>
        </html>
    );
}
