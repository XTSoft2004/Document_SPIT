'use client';

import { useState, useEffect } from 'react';
import HeaderDocument from "@/components/ui/Document/Header";
import Header from "@/layout/Header";
import GridDocument from "@/components/ui/Document/GridDocument";
import { IDriveResponse, IDriveItem } from "@/types/driver";
import { ITreeNode } from "@/types/tree";
import { flattenData } from "@/utils/flattenData";
import Footer from '@/layout/Footer';

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
    const [isMobile, setIsMobile] = useState(false);
    const allItems = flattenData(data);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    return (
        <>
            <div className="sticky top-0 z-10 shadow-sm">
                {isMobile ? (
                    <HeaderDocument
                        treeData={treeData}
                        allItems={allItems}
                        onMobileSearch={setMobileSearchResults}
                        isMobile={isMobile}
                    />
                ) : (
                    <Header />
                )}
            </div>
            <div className="mb-3 flex-1 overflow-hidden">
                <GridDocument
                    data={data}
                    content={content}
                    slug={slug}
                    path={path}
                    treeData={treeData}
                    mobileSearchResults={mobileSearchResults}
                />
            </div>
            <Footer />
        </>
    );
}
