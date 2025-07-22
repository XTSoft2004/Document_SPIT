'use client'
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ListIcon, LayoutGridIcon } from 'lucide-react';
import { getStars } from '@/actions/user.action';
import PathFolder from './PathFolder';
import GridDocumentList from './GridDocumentList';
import Back from './Back';
import PreviewFile from '../../common/PreviewDocumentFile';
import GridDocumentPreview from './GridDocumentPreview';
import SidebarTree from './SidebarTree';
import { flattenData } from "@/utils/flattenData";
import { IDriveItem, IDriveResponse } from '@/types/driver';
import { ITreeNode } from '@/types/tree';
import Search from './Search';
import convertSlug from '@/utils/convertSlug';
import { set } from 'zod';
import { getMe } from '@/actions/user.action';
import PreviewDocumentFile from '../../common/PreviewDocumentFile';

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
    const [previewFile, setPreviewFile] = useState<{ fileName: string, documentId: number } | null>(null);
    const [loading, setLoading] = useState(false);
    const [showTree, setShowTree] = useState(true);
    const [filtered, setFiltered] = useState<IDriveItem[] | null>(null);
    const [mode, setMode] = useState<'list' | 'preview'>('list');
    const [starDocument, setStarDocument] = useState<number[]>([]);
    const [isLogin, setIsLogin] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedMode = localStorage.getItem('doc_mode');
            if (savedMode === 'preview' || savedMode === 'list') {
                setMode(savedMode as 'list' | 'preview');
            }
        }
    }, []);

    useEffect(() => {
        const loadStarredDocuments = async () => {
            try {
                const response = await getStars();
                if (response.ok && response.data) {
                    setStarDocument(response.data);
                }
            } catch (error) {
                console.error('Error loading starDocument documents:', error);
            }
        };

        loadStarredDocuments();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await getMe();
                if (response.ok && response.data) {
                    setIsLogin(true);
                } else {
                    setIsLogin(false);
                }
            }
            catch (error) {
                console.error('Error fetching user data:', error);
                setIsLogin(false);
            }
        }

        fetchUserData();

    }, []);

    const allItems = useMemo(() => flattenData(data), [data]);

    const getCurrentfolderId = useCallback(() => {
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
        const currentFolderId = getCurrentfolderId();
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
    }, [path, getCurrentfolderId, data]);

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
            setPreviewFile({ fileName: node.title, documentId: node.idDocument });
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
        <div className="flex h-full min-h-0 relative">
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
            <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
                <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between mb-3 sm:mb-4 w-full gap-2 xs:gap-3 flex-shrink-0 pt-3 sm:pt-4 px-3 sm:px-4">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 overflow-hidden flex-1">
                        <PathFolder path={path} />
                    </div>
                    <div className="flex gap-1 xs:gap-2 items-center justify-end flex-shrink-0">
                        {
                            (!showTree && window.innerWidth > 768) && (
                                <>
                                    <div className="hidden sm:flex items-center ml-0 sm:ml-4">
                                        <Search allItems={allItems} onResult={setFiltered} />
                                    </div>
                                </>
                            )
                        }
                        {/* Back button - hide on very small screens */}
                        <div className="hidden xs:block">
                            <Back path={path} />
                        </div>
                        {/* Switch Mode buttons - hide on very small screens */}
                        <div className="hidden xs:flex gap-1">
                            <button
                                className={`relative overflow-hidden p-1.5 xs:p-2 rounded transition-all duration-200 ${mode === 'list'
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
                                    <ListIcon className="w-4 h-4 xs:w-5 xs:h-5" />
                                </span>
                            </button>
                            <button
                                className={`relative overflow-hidden p-1.5 xs:p-2 md:mr-5 rounded transition-all duration-200 ${mode === 'preview'
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
                                    <LayoutGridIcon className="w-4 h-4 xs:w-5 xs:h-5" />
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
                {/* Content area với responsive padding */}
                <div className="flex-1 min-h-0 overflow-auto px-2 xs:px-3 sm:px-4 pb-3 xs:pb-4 sm:pb-5">
                    {mode === 'list' ? (
                        <GridDocumentList
                            content={displayContent}
                            url={url}
                            onPreviewFile={file => setPreviewFile({ fileName: file.name, documentId: file.documentId })}
                            onFolderClick={() => setLoading(true)}
                            isLogin={isLogin}
                            starDocument={starDocument}
                            onStarredUpdate={setStarDocument}
                        />
                    ) : (
                        <GridDocumentPreview
                            content={displayContent}
                            url={url}
                            onPreviewFile={file => setPreviewFile({ fileName: file.name, documentId: file.documentId })}
                            onFolderClick={() => setLoading(true)}
                            loading={loading}
                            isLogin={isLogin}
                            starDocument={starDocument}
                            onStarredUpdate={setStarDocument}
                        />
                    )}
                    <PreviewDocumentFile
                        open={!!previewFile}
                        onClose={() => setPreviewFile(null)}
                        fileName={previewFile?.fileName || ''}
                        documentId={previewFile?.documentId || 0}
                    />
                </div>
                {/* Mobile-only navigation for very small screens */}
                <div className="xs:hidden flex items-center justify-between mb-2 px-1">
                    <button
                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${path.length > 0
                            ? 'text-blue-600 hover:bg-blue-50 active:bg-blue-100'
                            : 'text-gray-400 cursor-not-allowed'
                            }`}
                        onClick={() => {
                            if (path.length > 0) {
                                const parentUrl = path.length > 1
                                    ? '/document/' + path.slice(0, -1).map(convertSlug).join('/')
                                    : '/document';
                                router.push(parentUrl);
                            }
                        }}
                        disabled={path.length === 0}
                        title="Quay lại"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Back</span>
                    </button>
                    <div className="flex gap-1">
                        <button
                            className={`p-1 rounded text-xs transition-colors ${mode === 'list'
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-gray-200 text-gray-500'
                                }`}
                            onClick={() => handleSetMode('list')}
                            title="List"
                        >
                            <ListIcon className="w-5 h-5" />
                        </button>
                        <button
                            className={`p-1 rounded text-xs transition-colors ${mode === 'preview'
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-gray-200 text-gray-500'
                                }`}
                            onClick={() => handleSetMode('preview')}
                            title="Grid"
                        >
                            <LayoutGridIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
}
