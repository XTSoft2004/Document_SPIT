import { HiFolderOpen } from 'react-icons/hi2';
import convertSlug from '@/utils/convertSlug';
import { useRouter } from 'next/navigation';
import { IDriveItem } from '@/types/driver';
import { Card, Skeleton } from 'antd';
import LoadingSkeleton from '../Loading/LoadingSkeleton';
import NotFound from '../NotFound';
import { FileCard, FolderCard } from './Card';

interface GridDocumentPreviewProps {
    content: IDriveItem[];
    url: string;
    onPreviewFile?: (file: IDriveItem) => void;
    onFolderClick?: () => void;
    loading?: boolean;
    isLogin?: boolean;
    starDocument?: number[];
    onStarredUpdate?: (starDocument: number[]) => void;
}

export default function GridDocumentPreview({
    content,
    url,
    onPreviewFile,
    onFolderClick,
    loading = false,
    isLogin = false,
    starDocument = [],
    onStarredUpdate,
}: GridDocumentPreviewProps) {
    const router = useRouter();
    const folders = content.filter(i => i.isFolder);
    const files = content.filter(i => !i.isFolder);

    if (loading) {
        return (
            <div className="w-full flex flex-col gap-6">
                {[5, 8].map((count, idx) => (
                    <div key={idx}>
                        <div className="mb-2">
                            <Skeleton.Input active size="small" />
                        </div>
                        <LoadingSkeleton count={count} columns={5} />
                    </div>
                ))}
            </div>
        );
    }

    if (!content?.length) return <NotFound type="folder" />;

    return (
        <div className="w-full flex flex-col gap-6">
            {/* Folders */}
            {folders.length > 0 && (
                <div>
                    <div className="mb-2 font-semibold text-gray-700">Thư mục</div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {folders.map(item => (
                            <FolderCard
                                key={item.folderId}
                                item={item}
                                url={url}
                                onFolderClick={onFolderClick}
                                router={router}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Files */}
            {files.length > 0 && (
                <div>
                    <div className="mb-2 font-semibold text-gray-700">Tập tin</div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {files.map(item => (
                            <FileCard
                                key={item.folderId}
                                item={item}
                                onPreviewFile={onPreviewFile}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}