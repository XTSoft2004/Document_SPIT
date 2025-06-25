import { HiOutlineDocument, HiFolderOpen } from 'react-icons/hi2';
import { FaFilePdf, FaFileWord } from 'react-icons/fa6';
import { EyeIcon } from 'lucide-react';
import convertSlug from '@/utils/convertSlug';
import { useRouter } from 'next/navigation';
import { IDriveItem } from '@/types/driver';
import LoadingSkeleton from '../Loading/LoadingSkeleton';
import NotFound from '../NotFound';

interface GridDocumentListProps {
    content: IDriveItem[];
    url: string;
    onPreviewFile?: (file: IDriveItem) => void;
    onFolderClick?: () => void;
    loading?: boolean;
}

const getFileIcon = (name: string, isFolder: boolean) => {
    if (isFolder) return <HiFolderOpen className="w-8 h-8 text-yellow-500 fill-yellow-400" />;
    if (name.endsWith('.pdf')) return <FaFilePdf className="w-8 h-8 text-red-500" />;
    if (name.endsWith('.doc') || name.endsWith('.docx')) return <FaFileWord className="w-8 h-8 text-blue-600" />;
    return <HiOutlineDocument className="w-8 h-8 text-gray-400" />;
};

export default function GridDocumentList({
    content,
    url,
    onPreviewFile,
    onFolderClick,
    loading = false,
}: GridDocumentListProps) {
    const router = useRouter();

    if (loading) {
        return (
            <div className="w-full">
                <LoadingSkeleton count={10} columns={1} showImage={false} rows={2} />
            </div>
        );
    }

    if (!content?.length) return <NotFound type="folder" />;

    const sortedContent = [...content].sort((a, b) => {
        if (a.isFolder !== b.isFolder) return a.isFolder ? -1 : 1;
        return a.name.localeCompare(b.name, 'vi', { sensitivity: 'base' });
    });

    const handleItemClick = (item: IDriveItem, path: string) => {
        if (item.isFolder) {
            onFolderClick?.();
            router.push(path);
        } else {
            onPreviewFile?.(item);
        }
    };

    return (
        <div className="rounded-xl w-full flex flex-col">
            {sortedContent.map((item) => {
                const path = `/document/${url}/${convertSlug(item.name)}`;
                return (
                    <div
                        key={item.folderId}
                        className="flex items-center gap-4 px-5 py-4 cursor-pointer bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 group"
                        onClick={() => handleItemClick(item, path)}
                    >
                        <div className="flex-shrink-0">{getFileIcon(item.name, item.isFolder)}</div>
                        <div className="flex-1 min-w-0">
                            <div className="font-semibold text-base truncate group-hover:text-blue-700">{item.name}</div>
                        </div>
                        {!item.isFolder && (
                            <button
                                className="ml-2 p-2 hover:bg-blue-100 transition-colors"
                                title="Xem nhanh"
                                onClick={e => {
                                    e.stopPropagation();
                                    onPreviewFile?.(item);
                                }}
                            >
                                <EyeIcon className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    );
}