'use client';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumb } from 'antd';
import convertSlug from '@/utils/convertSlug';

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

    const items = useMemo(() => {
        const crumbs = [
            {
                title: (
                    <span
                        className="ml-5 flex items-center px-2 py-1 rounded hover:bg-gray-100 transition-colors cursor-pointer font-semibold text-blue-600 align-middle"
                        onClick={() => router.push('/document')}
                        style={{ lineHeight: '1.5' }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1.2em"
                            height="1.2em"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="align-middle"
                            style={{ verticalAlign: 'middle', display: 'inline-block' }}
                        >
                            <path
                                d="M3 10.5L12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-5h-6v5H4a1 1 0 0 1-1-1V10.5z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinejoin="round"
                                fill="none"
                            />
                        </svg>
                    </span>
                ),
            },
        ];

        path.forEach((item, index) => {
            const isLast = index === path.length - 1;
            crumbs.push({
                title: isLast ? (
                    <span className="font-semibold text-gray-800 align-middle" style={{ verticalAlign: 'middle' }}>{item}</span>
                ) : (
                    <span
                        className="cursor-pointer text-blue-600 hover:underline align-middle"
                        style={{ verticalAlign: 'middle' }}
                        onClick={() => handleNavigate(index)}
                    >
                        {item}
                    </span>
                ),
            });
        });

        return crumbs;
    }, [path, handleNavigate, router]);

    return (
        <Breadcrumb
            items={items}
            className="text-base"
            separator={<span className="text-gray-400 align-middle" style={{ verticalAlign: 'middle' }}>/</span>}
        />
    );
}