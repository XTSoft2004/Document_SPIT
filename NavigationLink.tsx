'use client';
import Link from 'next/link';
import { useRouterLoading } from '@/components/ui/Loading/RouterLoadingProvider';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface NavigationLinkProps {
    href: string;
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

export default function NavigationLink({ href, children, className, onClick }: NavigationLinkProps) {
    const { showLoading } = useRouterLoading();
    const router = useRouter();

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();

        if (onClick) {
            onClick();
        }

        showLoading();
        setTimeout(() => {
            router.push(href);
        }, 250);
    };

    return (
        <Link href={href} className={className} onClick={handleClick}>
            {children}
        </Link>
    );
}
