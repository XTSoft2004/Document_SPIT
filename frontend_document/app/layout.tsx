import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
    title: 'Nền tảng chia sẻ tài liệu học tập chất lượng',
    description:
        'Nơi chia sẻ bài giảng, đề thi, slide, bài tập lớn và nhiều tài liệu học tập hữu ích khác. Cùng nhau lan tỏa tri thức!',
    metadataBase: new URL('http://document.spit-husc.io.vn/'),
    openGraph: {
        type: 'website',
        url: 'http://document.spit-husc.io.vn/',
        title: 'Nền tảng chia sẻ tài liệu học tập chất lượng',
        description:
            'Nơi chia sẻ bài giảng, đề thi, slide, bài tập lớn và nhiều tài liệu học tập hữu ích khác. Cùng nhau lan tỏa tri thức!',
        siteName: 'Tài liệu học tập',
        images: [
            {
                url: 'thumbnail.png',
                width: 1200,
                height: 630,
                alt: 'Ảnh chia sẻ tài liệu học tập',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Nền tảng chia sẻ tài liệu học tập chất lượng',
        description:
            'Nơi chia sẻ bài giảng, đề thi, slide, bài tập lớn và nhiều tài liệu học tập hữu ích khác. Cùng nhau lan tỏa tri thức!',
        images: ['thumbnail.png'],
    },
    icons: {
        icon: '/favicon.ico',
    },
    themeColor: '#ffffff',
    viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
    },
}

export default function AuthLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>): JSX.Element {
    return <>{children}</>;
}