'use client';
import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouterLoading } from '@/components/ui/Loading/RouterLoadingProvider';

export const useAutoLoading = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { hideLoading, showLoading } = useRouterLoading();
    const initialLoad = useRef(true);

    useEffect(() => {
        if (initialLoad.current) {
            showLoading();
            initialLoad.current = false;

            const timer = setTimeout(() => {
                hideLoading();
            }, 500);

            return () => clearTimeout(timer);
        }

        const timer = setTimeout(() => {
            hideLoading();
        }, 200);

        return () => clearTimeout(timer);
    }, [pathname, searchParams, showLoading, hideLoading]);

    useEffect(() => {
        return () => {
            hideLoading();
        };
    }, [hideLoading]);
};
