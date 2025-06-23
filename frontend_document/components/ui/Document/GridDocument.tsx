'use client'
import PathFolder from './PathFolder';
import { IDriveItem } from '@/types/driver';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { ListIcon, LayoutGridIcon } from 'lucide-react';
import GridDocumentList from './GridDocumentList';
import Back from './Back';
import PreviewFile from './PreviewFile';
import globalConfig from '@/app.config';
import GridDocumentPreview from './GridDocumentPreview';
interface GridDocumentProps {
    content: IDriveItem[]
    slug: string[]
    path: string[]
}

export default function GridDocument({ content, slug, path }: GridDocumentProps) {
    const router = useRouter();
    const url = useMemo(() => slug.join('/'), [slug]);
    const [mode, setModeState] = useState<'list' | 'preview'>('list');
    const [previewFile, setPreviewFile] = useState<{ fileName: string, folderId: string } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(false);
    }, [url]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('doc_mode') as 'list' | 'preview' | null;
            if (saved && saved !== mode) setModeState(saved);
        }
    }, []);

    const setMode = (m: 'list' | 'preview') => {
        setModeState(m);
        if (typeof window !== 'undefined') {
            localStorage.setItem('doc_mode', m);
        }
    };

    return (
        <>
            <main className="min-h-[70vh] pt-4 pb-5 w-full relative">
                {loading && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
                    </div>
                )}
                <div className="px-0 md:px-0 w-full">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 w-full gap-3">
                        <PathFolder path={path} />
                        <div className="flex gap-2 items-center">
                            <Back path={path} />
                            {/* SwitchMode */}
                            <button
                                className={`relative overflow-hidden p-2 rounded transition-all duration-200 ${mode === 'list'
                                    ? 'bg-blue-100 text-blue-600 scale-110 shadow'
                                    : 'bg-gray-200 text-gray-500 scale-100'
                                    }`}
                                onClick={() => setMode('list')}
                                title="Chế độ danh sách"
                            >
                                <span
                                    className={`absolute inset-0 z-0 transition-transform duration-500 ${mode === 'list'
                                        ? 'translate-x-0 bg-blue-200 opacity-60'
                                        : '-translate-x-full opacity-0'
                                        }`}
                                />
                                <span className="relative z-10">
                                    <ListIcon className="w-5 h-5" />
                                </span>
                            </button>
                            <button
                                className={`relative overflow-hidden p-2 md:mr-5 rounded transition-all duration-200 ${mode === 'preview'
                                    ? 'bg-blue-100 text-blue-600 scale-110 shadow'
                                    : 'bg-gray-200 text-gray-500 scale-100'
                                    }`}
                                onClick={() => setMode('preview')}
                                title="Chế độ lưới"
                            >
                                <span
                                    className={`absolute inset-0 z-0 transition-transform duration-500 ${mode === 'preview'
                                        ? 'translate-x-0 bg-blue-200 opacity-60'
                                        : 'translate-x-full opacity-0'
                                        }`}
                                />
                                <span className="relative z-10">
                                    <LayoutGridIcon className="w-5 h-5" />
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Hiển thị dạng list */}
                    {mode === 'list' && (
                        <GridDocumentList
                            content={content}
                            url={url}
                            onPreviewFile={file => setPreviewFile({ fileName: file.name, folderId: file.folderId })}
                            onFolderClick={() => setLoading(true)}
                        />
                    )}

                    {/* Hiển thị dạng lưới */}
                    {mode === 'preview' && (
                        <GridDocumentPreview
                            content={content}
                            url={url}
                            onPreviewFile={file => setPreviewFile({ fileName: file.name, folderId: file.folderId })}
                            onFolderClick={() => setLoading(true)}
                        />
                    )}

                    {/* Popup preview file */}
                    <PreviewFile
                        open={!!previewFile}
                        onClose={() => setPreviewFile(null)}
                        fileName={previewFile?.fileName || ''}
                        folderId={previewFile?.folderId || ''}
                    />
                </div>
            </main>
        </>
    )
}
