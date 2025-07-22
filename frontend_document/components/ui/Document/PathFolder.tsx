'use client';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumb } from 'antd';
import convertSlug from '@/utils/convertSlug';
import globalConfig from '@/app.config';
import NotificationService from '../Notification/NotificationService';

interface PathFolderProps {
    path: string[];
}

export default function PathFolder({ path }: PathFolderProps) {
    const router = useRouter();

    const handleNavigate = useCallback(
        (index: number) => {
            const newPath = path.slice(0, index + 1).map(convertSlug);
            router.push(`/document/${newPath.join('/')}`);
        },
        [path, router]
    );

    const handleCopyPath = useCallback(async (index: number) => {
        const fullPath = path.slice(0, index + 1).map(convertSlug);
        await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_WEB_URL}/document/${fullPath.join('/')}`);
        NotificationService.success({
            message: 'Đã sao chép',
        });
    }, [path]);

    const items = useMemo(() => {
        const crumbs = [
            {
                title: (
                    <span
                        className="flex items-center px-1 xs:px-2 py-1 rounded hover:bg-gray-100 transition-colors cursor-pointer font-semibold text-blue-600 align-middle text-xs xs:text-sm"
                        onClick={() => router.push('/document')}
                        style={{ lineHeight: '1.5' }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="align-middle"
                            style={{ verticalAlign: 'middle', display: 'inline-block', marginBottom: '5px' }}
                        >
                            <path
                                d="M3 10.5L12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-5h-6v5H4a1 1 0 0 1-1-1V10.5z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinejoin="round"
                                fill="none"
                            />
                        </svg>
                        <span className="xs:inline ml-1 mb-1">Home</span>
                    </span>
                ),
            },
        ];

        path.forEach((item, index) => {
            const isLast = index === path.length - 1;
            const truncatedItem = item.length > 15 ? `${item.substring(0, 12)}...` : item;
            const displayItem = window.innerWidth < 480 ? truncatedItem : item;

            crumbs.push({
                title: isLast ? (
                    <span
                        className="text-gray-800 font-semibold flex items-center px-1 xs:px-2 py-1 rounded hover:bg-gray-100 transition-colors cursor-pointer align-middle text-xs xs:text-sm"
                        style={{ verticalAlign: 'middle' }}
                        onClick={() => handleCopyPath(index)}
                        title={item} // Show full text on hover
                    >
                        {displayItem}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1.2em"
                            height="1.2em"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="ml-1 xs:ml-2 text-gray-500 hover:text-blue-600 transition-colors inline-block"
                            style={{ verticalAlign: 'middle' }}
                        >
                            <path
                                d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                            />
                            <rect x="8" width="8" height="4" rx="1" ry="1" stroke="currentColor" strokeWidth="2" fill="none" />
                        </svg>
                    </span>
                ) : (
                    <span
                        className="cursor-pointer text-blue-600 flex items-center px-1 xs:px-2 py-1 rounded hover:bg-gray-100 transition-colors align-middle text-xs xs:text-sm"
                        style={{ verticalAlign: 'middle' }}
                        onClick={() => handleNavigate(index)}
                        title={item} // Show full text on hover
                    >
                        {displayItem}
                    </span>
                ),
            });
        });

        return crumbs;
    }, [path, handleNavigate, router, handleCopyPath]);

    return (
        <div className="min-w-0 flex-1 overflow-hidden mt-[1px]">
            <Breadcrumb
                items={items}
                className="text-xs xs:text-sm sm:text-base overflow-hidden"
                separator={<span className="text-gray-400 align-middle px-1" style={{ verticalAlign: 'middle' }}>/</span>}
            />
        </div>
    );
}