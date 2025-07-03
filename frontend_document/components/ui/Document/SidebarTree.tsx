import type { ITreeNode } from '@/types/tree';
import type { IDriveItem } from '@/types/driver';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect } from 'react';
import Search from './Search';
import TreeView from './TreeView';

interface SidebarTreeProps {
    treeData: ITreeNode[];
    selectedKeys: React.Key[];
    onSelect: (keys: React.Key[], info: any) => void;
    expandedKeys: React.Key[];
    onExpand: (keys: React.Key[]) => void;
    showTree: boolean;
    onToggleTree: (show: boolean) => void;
    allItems: IDriveItem[];
    onSearchResult: (results: IDriveItem[] | null) => void;
}

export default function SidebarTrees({
    treeData,
    selectedKeys,
    onSelect,
    expandedKeys,
    onExpand,
    showTree,
    onToggleTree,
    allItems,
    onSearchResult,
}: SidebarTreeProps) {
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768 && showTree) {
                onToggleTree(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [showTree, onToggleTree]);

    return (
        <>
            {/* Tree sidebar */}
            <div className={`ml-3 hidden md:flex h-full transition-all duration-300 ease-in-out ${showTree ? 'w-64 min-w-[200px] max-w-[300px]' : 'w-0 min-w-0 max-w-0'} overflow-hidden`}>
                <div className={`w-64 min-w-[200px] max-w-[300px] flex-shrink-0 h-full max-h-full overflow-hidden relative flex flex-col pt-4 transition-transform duration-300 ease-in-out ${showTree ? 'translate-x-0' : '-translate-x-full'}`}>
                    {/* Header */}
                    <div className="sticky top-0 z-10 flex flex-col p-2 pl-0">
                        <div className="flex items-center mb-3">
                            <button
                                className="p-1 rounded bg-white shadow hover:bg-gray-200 border border-gray-200 mr-2 ml-0 transition-all duration-200"
                                onClick={() => onToggleTree(false)}
                                title="Ẩn cây thư mục"
                                style={{ minWidth: 0 }}
                            >
                                <ChevronLeft className="w-5 h-5 text-blue-600" />
                            </button>
                            <span className="font-medium text-gray-700 flex-1 pl-2">Document SPIT</span>
                        </div>
                        <div className="flex items-center ml-4">
                            <Search allItems={allItems} onResult={onSearchResult} />
                        </div>
                    </div>

                    {/* Tree Content */}
                    <div className="flex-1 overflow-hidden px-2 mt-3">
                        <div className="h-full overflow-auto">
                            <TreeView
                                treeData={treeData}
                                selectedKeys={selectedKeys}
                                expandedKeys={expandedKeys}
                                onSelect={onSelect}
                                onExpand={onExpand}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Nút toggle */}
            <button
                className={`hidden md:block fixed left-0 top-24 z-30 p-1 rounded border border-gray-300 bg-white shadow hover:bg-blue-50 transition-all duration-300 ease-in-out ${showTree ? 'opacity-0 pointer-events-none -translate-x-2' : 'opacity-100 pointer-events-auto translate-x-0'}`}
                onClick={() => onToggleTree(true)}
                title="Hiện cây thư mục"
                style={{ minWidth: 0 }}
            >
                <ChevronRight className="w-5 h-5 text-blue-600" />
            </button>
        </>
    );
}