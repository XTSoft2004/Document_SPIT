// components/Loading/MoonLoading.tsx
'use client';

import { MoonLoader } from 'react-spinners';

export default function MoonLoading({ loading = true }: { loading?: boolean }) {
    return (
        <div className="flex justify-center items-center h-full">
            <MoonLoader color="#2563eb" size={50} loading={loading} />
        </div>
    );
}
