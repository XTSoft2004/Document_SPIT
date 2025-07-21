import { HiOutlineDocument, HiFolderOpen } from 'react-icons/hi2';
import { FaFilePdf, FaFileWord } from 'react-icons/fa6';
import convertSlug from '@/utils/convertSlug';
import { useRouter } from 'next/navigation';
import { IDriveItem } from '@/types/driver';
import LoadingSkeleton from '../Loading/LoadingSkeleton';
import NotFound from '../NotFound';
import HeartButton from './HeartButton';
import globalConfig from '@/app.config';

interface GridDocumentListProps {
    content: IDriveItem[];
    url: string;
    onPreviewFile?: (file: IDriveItem) => void;
    onFolderClick?: () => void;
    loading?: boolean;
    isLogin?: boolean;
    starDocument?: number[];
    onStarredUpdate?: (starDocument: number[]) => void;
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
    isLogin = false,
    starDocument = [],
    onStarredUpdate,
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
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        {item.totalDownloads || 0}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        {item.totalViews || 0}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        className="p-1 hover:bg-blue-100 rounded transition-colors"
                                        title="Tải xuống"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const downloadUrl = `${globalConfig.baseUrl}/document/download/${item.documentId}`;
                                            const link = document.createElement('a');
                                            link.href = downloadUrl;
                                            link.download = item.name || 'document';
                                            link.style.display = 'none';
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                        }}
                                    >
                                        <svg className="w-4 h-4 text-gray-500 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </button>
                                    {isLogin && (
                                        <HeartButton
                                            documentId={item.documentId}
                                            starDocument={starDocument}
                                            onStarredUpdate={onStarredUpdate}
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}