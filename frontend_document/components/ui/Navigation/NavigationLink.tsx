'use client';
import Link from 'next/link';
import { ReactNode } from 'react';

interface NavigationLinkProps {
    href: string;
    children: ReactNode;
    className?: string;
    onClick?: () => void | boolean;
}

export default function NavigationLink({ href, children, className, onClick }: NavigationLinkProps) {
    const handleClick = (e: React.MouseEvent) => {
        if (onClick) {
            onClick();
        }
    };

    return (
        <Link href={href} className={className} onClick={handleClick}>
            {children}
        </Link>
    );
}
