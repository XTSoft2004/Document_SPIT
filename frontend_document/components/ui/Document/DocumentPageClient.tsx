'use client';

import { useState } from 'react';
import Header from "@/components/ui/Document/Header";
import GridDocument from "@/components/ui/Document/GridDocument";
import { IDriveResponse, IDriveItem } from "@/types/driver";
import { ITreeNode } from "@/types/tree";
import { flattenData } from "@/utils/flattenData";

interface DocumentPageClientProps {
    data: IDriveResponse[];
    content: IDriveItem[];
    slug: string[];
    path: string[];
    treeData: ITreeNode[];
}

export default function DocumentPageClient({
    data,
    content,
    slug,
    path,
    treeData
}: DocumentPageClientProps) {
    const [mobileSearchResults, setMobileSearchResults] = useState<IDriveItem[] | null>(null);
    const allItems = flattenData(data);

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <div className="sticky top-0 z-10 bg-white shadow-sm">
                <Header
                    treeData={treeData}
                    allItems={allItems}
                    onMobileSearch={setMobileSearchResults}
                />
            </div>
            <div className="flex-1 overflow-hidden">
                <GridDocument
                    data={data}
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
