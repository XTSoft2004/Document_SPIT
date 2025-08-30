'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from 'lucide-react';
import convertSlug from '@/utils/convertSlug';

interface BackProps {
    path: string[];
}

export default function Back({ path }: BackProps) {
    const router = useRouter();
    const canBack = path.length > 0;
    const parentUrl = path.length > 1
        ? '/document/' + path.slice(0, -1).map(convertSlug).join('/')
        : '/document';

    return (
        <button
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200 transition disabled:opacity-50"
            onClick={() => canBack && router.push(parentUrl)}
            disabled={!canBack}
            title="Quay lại thư mục trước"
        >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Quay lại</span>
        </button>
    );
}