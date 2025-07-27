import type { Metadata } from 'next';
import { ReactNode } from 'react';

export default function AuthLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>): JSX.Element {
    return <>{children}</>;
}