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
    return {
        title: 'SPIT | Document',
        description: 'Xem tài liệu của bạn một cách dễ dàng và nhanh chóng',
    };
}

export default function AuthLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>): JSX.Element {
    return <>{children}</>;
}