'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function GlobalPageLoader() {
    const [loading, setLoading] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        // Create a promise that resolves after navigation
        const timer = setTimeout(() => {
            setLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [pathname]);

    // Expose global loading function
    useEffect(() => {
        (window as any).startPageTransition = () => setLoading(true);
        (window as any).stopPageTransition = () => setLoading(false);

        return () => {
            delete (window as any).startPageTransition;
            delete (window as any).stopPageTransition;
        };
    }, []);

    if (!loading) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[9998] h-1 bg-gray-200 dark:bg-gray-700">
            <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_1.5s_infinite]"></div>
        </div>
    );
}
