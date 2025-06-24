'use client'
import PathFolder from './PathFolder';
import { IDriveItem, IDriveResponse } from '@/types/driver';
import { useState, useEffect, useMemo } from 'react';
import { ListIcon, LayoutGridIcon, ChevronRight, ChevronLeft } from 'lucide-react';
import GridDocumentList from './GridDocumentList';
import Back from './Back';
import PreviewFile from './PreviewFile';
import GridDocumentPreview from './GridDocumentPreview';
import DocumentTreeView from './DocumentTreeView';
import { useRouter } from 'next/navigation';
import { ITreeNode } from '@/types/tree';
import Search from './Search';
import { flattenData } from "@/utils/flattenData";

interface GridDocumentProps {
    data: IDriveResponse[]
    content: IDriveItem[]
    slug: string[]
    path: string[]
    treeData: ITreeNode[]
}

export default function GridDocument({ data, content, slug, path, treeData }: GridDocumentProps & { treeData: any[] }) {
    const router = useRouter();
    const url = useMemo(() => slug.join('/'), [slug]);
    const [mode, setModeState] = useState<'list' | 'preview'>('list');
    const [previewFile, setPreviewFile] = useState<{ fileName: string, folderId: string } | null>(null);
    const [, setLoading] = useState(false);
    const [showTree, setShowTree] = useState(true);
    const [filtered, setFiltered] = useState<IDriveItem[] | null>(null);
    const allItems = useMemo(() => flattenData(data), [data]);
    const [selectedKeys, setSelectedKeys] = useState<string[]>([path[path.length - 1]]);
    const [expandedKeys, setExpandedKeys] = useState<string[]>(path);

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


    useEffect(() => {
        setSelectedKeys([path[path.length - 1]]);
        setExpandedKeys(path);
    }, [path]);


    const handleTreeSelect = (_: React.Key[], info: any) => {
        const node = info.node;
        if (!node) return;
        console.log(info)
        if (node.isLeaf) {
            setPreviewFile({ fileName: node.title, folderId: node.id });
        } else {
            router.push(`/document/${node.path.join('/')}`);
        }
    };

    return (
        <div className="flex h-full min-h-0">
            {/* TreeView bên trái */}
            {showTree && (
                <>
                    <div className="flex h-full">
                        <div className="w-64 min-w-[200px] max-w-[300px] flex-shrink-0 h-full max-h-full overflow-auto border-r border-gray-200 bg-white relative flex flex-col pt-4">
                            <div className="sticky top-0 z-10 bg-white border-b border-gray-100 flex flex-col p-2 pl-0">
                                <div className="flex items-center">
                                    <button
                                        className="p-1 rounded bg-white shadow hover:bg-gray-200 border border-gray-200 mr-2 ml-0"
                                        onClick={() => setShowTree(false)}
                                        title="Ẩn cây thư mục"
                                        style={{ minWidth: 0 }}
                                    >
                                        <ChevronLeft className="w-5 h-5 text-blue-600" />
                                    </button>
                                    <span className="font-medium text-gray-700 flex-1 pl-2">Cây thư mục</span>
                                </div>
                                {/* Search nằm ngay dưới tiêu đề */}
                                <Search allItems={allItems} onResult={setFiltered} />
                            </div>
                            <DocumentTreeView
                                treeData={treeData}
                                selectedKeys={selectedKeys}
                                onSelect={handleTreeSelect}
                                expandedKeys={expandedKeys}
                                onExpand={(keys) => setExpandedKeys(keys.map(String))}
                            />
                        </div>
                    </div>
                </>
            )}
            {/* Button hiện cây thư mục */}
            {!showTree && (
                <button
                    className="fixed left-0 top-24 z-30 p-1 rounded border border-gray-300 bg-white shadow hover:bg-blue-50 transition"
                    onClick={() => setShowTree(true)}
                    title="Hiện cây thư mục"
                    style={{ minWidth: 0 }}
                >
                    <ChevronRight className="w-5 h-5 text-blue-600" />
                </button>
            )}
            {/* Phần phải: PathFolder trên, document dưới */}
            <div className="flex-1 flex flex-col min-h-0 relative">
                {/* PathFolder và các nút ở trên */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 w-full gap-3 flex-shrink-0 pt-4 px-4">
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
                {/* Document content bên dưới, scrollable */}
                <div className="flex-1 min-h-0 overflow-auto px-4 pb-5">
                    {mode === 'list' && (
                        <GridDocumentList
                            content={filtered ?? content}
                            url={url}
                            onPreviewFile={file => setPreviewFile({ fileName: file.name, folderId: file.folderId })}
                            onFolderClick={() => setLoading(true)}
                        />
                    )}
                    {mode === 'preview' && (
                        <GridDocumentPreview
                            content={filtered ?? content}
                            url={url}
                            onPreviewFile={file => setPreviewFile({ fileName: file.name, folderId: file.folderId })}
                            onFolderClick={() => setLoading(true)}
                        />
                    )}
                    <PreviewFile
                        open={!!previewFile}
                        onClose={() => setPreviewFile(null)}
                        fileName={previewFile?.fileName || ''}
                        folderId={previewFile?.folderId || ''}
                    />
                </div>
            </div>
        </div>
    )
}
