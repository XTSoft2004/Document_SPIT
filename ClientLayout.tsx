'use client';
import { useAutoLoading } from '@/hooks/useAutoLoading';
import { ReactNode } from 'react';

interface ClientLayoutProps {
    children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
    useAutoLoading();

    return <>{children}</>;
}
