'use client'
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ListIcon, LayoutGridIcon } from 'lucide-react';
import PathFolder from './PathFolder';
import GridDocumentList from './GridDocumentList';
import Back from './Back';
import PreviewFile from './PreviewFile';
import GridDocumentPreview from './GridDocumentPreview';
import SidebarTree from './SidebarTree';
import { flattenData } from "@/utils/flattenData";
import { IDriveItem, IDriveResponse } from '@/types/driver';
import { ITreeNode } from '@/types/tree';
import Search from './Search';

interface GridDocumentProps {
    data: IDriveResponse[]
    content: IDriveItem[]
    slug: string[]
    path: string[]
    treeData: ITreeNode[]
    mobileSearchResults?: IDriveItem[] | null
}

export default function GridDocument({ data, content, slug, path, treeData, mobileSearchResults }: GridDocumentProps) {
    const router = useRouter();
    const url = useMemo(() => slug.join('/'), [slug]);
    const [previewFile, setPreviewFile] = useState<{ fileName: string, folderId: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [showTree, setShowTree] = useState(true);
    const [filtered, setFiltered] = useState<IDriveItem[] | null>(null);
    const [mode, setMode] = useState<'list' | 'preview'>('list');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedMode = localStorage.getItem('doc_mode');
            if (savedMode === 'preview' || savedMode === 'list') {
                setMode(savedMode as 'list' | 'preview');
            }
        }
    }, []);

    const allItems = useMemo(() => flattenData(data), [data]);

    const getCurrentFolderId = useCallback(() => {
        if (path.length === 0) return '';
        let current = data;
        let folderId = '';
        for (const pathSegment of path) {
            const found = current.find(item => item.name === pathSegment && item.isFolder);
            if (found) {
                folderId = found.folderId;
                current = found.children || [];
            }
        }
        return folderId;
    }, [data, path]);

    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const [expandedKeys, setExpandedKeys] = useState<string[]>([]);


    useEffect(() => {
        const currentFolderId = getCurrentFolderId();
        setSelectedKeys(currentFolderId ? [currentFolderId] : []);


        const expandIds: string[] = [];
        let current = data;
        for (const pathSegment of path) {
            const found = current.find(item => item.name === pathSegment && item.isFolder);
            if (found) {
                expandIds.push(found.folderId);
                current = found.children || [];
            }
        }
        setExpandedKeys(expandIds);
    }, [path, getCurrentFolderId, data]);

    const handleSetMode = useCallback((m: 'list' | 'preview') => {
        setMode(m);
        if (typeof window !== 'undefined') {
            localStorage.setItem('doc_mode', m);
        }
    }, []);

    const handleTreeSelect = useCallback((_: React.Key[], info: any) => {
        const node = info.node;
        if (!node) return;

        if (node.isLeaf) {
            setPreviewFile({ fileName: node.title, folderId: node.key });
        } else {

            router.push(`/document/${node.path.join('/')}`);
        }
    }, [router]);

    const displayContent = useMemo(() => {
        if (mobileSearchResults !== undefined && mobileSearchResults !== null) {
            return mobileSearchResults;
        }
        return filtered ?? content;
    }, [mobileSearchResults, filtered, content]);

    return (
        <div className="flex h-full min-h-0">
            <SidebarTree
                treeData={treeData}
                selectedKeys={selectedKeys}
                onSelect={handleTreeSelect}
                expandedKeys={expandedKeys}
                onExpand={keys => setExpandedKeys(keys.map(String))}
                showTree={showTree}
                onToggleTree={setShowTree}
                allItems={allItems}
                onSearchResult={setFiltered}
            />
            <div className="flex-1 flex flex-col min-h-0 relative">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 w-full gap-2 sm:gap-3 flex-shrink-0 pt-3 sm:pt-4 px-3 sm:px-4">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 overflow-hidden">
                        <PathFolder path={path} />
                    </div>
                    <div className="flex gap-1 sm:gap-2 items-center justify-end flex-shrink-0">
                        {
                            (!showTree && window.innerWidth > 768) && (
                                <>
                                    <div className="flex items-center ml-0 sm:ml-4 md:flex">
                                        <Search allItems={allItems} onResult={setFiltered} />
                                    </div>
                                </>
                            )
                        }
                        <button
                            className="sm:hidden p-2 rounded bg-gray-200 text-gray-500 ml-2"
                            onClick={() => setShowTree(!showTree)}
                            title={showTree ? "Ẩn sidebar" : "Hiện sidebar"}
                        >
                            {showTree ? "Ẩn thư mục" : "Hiện thư mục"}
                        </button>
                        <Back path={path} />
                        <button
                            className={`relative overflow-hidden p-2 rounded transition-all duration-200 ${mode === 'list'
                                ? 'bg-blue-100 text-blue-600 scale-110 shadow'
                                : 'bg-gray-200 text-gray-500 scale-100'
                                }`}
                            onClick={() => handleSetMode('list')}
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
                            onClick={() => handleSetMode('preview')}
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
                {/* Content area với responsive padding */}
                <div className="flex-1 min-h-0 overflow-auto px-3 sm:px-4 pb-4 sm:pb-5">
                    {mode === 'list' ? (
                        <GridDocumentList
                            content={displayContent}
                            url={url}
                            onPreviewFile={file => setPreviewFile({ fileName: file.name, folderId: file.folderId })}
                            onFolderClick={() => setLoading(true)}
                        />
                    ) : (
                        <GridDocumentPreview
                            content={displayContent}
                            url={url}
                            onPreviewFile={file => setPreviewFile({ fileName: file.name, folderId: file.folderId })}
                            onFolderClick={() => setLoading(true)}
                            loading={loading}
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
        </div >
    );
}
