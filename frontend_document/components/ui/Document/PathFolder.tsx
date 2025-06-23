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

    const items = useMemo(
        () => [
            {
                title: (
                    <span
                        className="cursor-pointer"
                        onClick={() => router.push('/document')}
                    >
                        <i className="anticon anticon-home" /> Home
                    </span>
                ),
            },
            ...path.map((item, index) => ({
                title: (
                    <span
                        className="cursor-pointer"
                        onClick={() => handleNavigate(index)}
                    >
                        {item}
                    </span>
                ),
            })),
        ],
        [path, handleNavigate]
    );

    return <Breadcrumb items={items} className="mb-4" />;
}