'use client';

import { useState, useEffect, useMemo } from 'react';
import GridDocument from "@/components/ui/Document/GridDocument";
import { IDriveResponse, IDriveItem } from "@/types/driver";
import { ITreeNode } from "@/types/tree";
import { flattenData } from "@/utils/flattenData";
import { useTreeData } from "@/hooks/useTreeData";
import getContent from "@/utils/getContent";
import { convertToTreeData } from "@/utils/convertToTreeData";

interface DocumentPageClientProps {
    data: IDriveResponse[];
    content: IDriveItem[];
    slug: string[];
    path: string[];
    treeData: ITreeNode[];
}

export default function DocumentPageClient({
    data: initialData,
    content: initialContent,
    slug,
    path: initialPath,
    treeData: initialTreeData
}: DocumentPageClientProps) {
    const [mobileSearchResults, setMobileSearchResults] = useState<IDriveItem[] | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    const { data: freshData, isLoading } = useTreeData();

    const currentData = freshData || initialData;

    const { content, path, treeData, allItems } = useMemo(() => {
        const contentResult = getContent(currentData, slug);
        const treeDataResult = convertToTreeData(currentData);
        const allItemsResult = flattenData(currentData);

        return {
            content: contentResult.items,
            path: contentResult.path,
            treeData: treeDataResult,
            allItems: allItemsResult
        };
    }, [currentData, slug]);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    return (
        <div className="flex flex-col h-full min-h-0">
            <div className="flex-1 min-h-0 overflow-hidden mb-3">
                <GridDocument
                    data={currentData}
                    content={content}
                    slug={slug}
                    path={path}
                    treeData={treeData}
                    mobileSearchResults={mobileSearchResults}
                />
            </div>
        </div>
    );
}
