import type { Metadata } from 'next';
import { ReactNode } from 'react';

// Dynamic metadata based on the route
export async function generateMetadata({
    params,
    searchParams,
}: {
    params: any;
    searchParams: Record<string, string | string[] | undefined>;
}): Promise<Metadata> {
    // Since this is a layout for /, we can set static metadata
    return {
        title: 'Trang chủ',
        description: 'SPIT Document',
    };
}

export default function HomeLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>): JSX.Element {
    return <>{children}</>;
}