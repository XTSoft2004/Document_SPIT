import { HiFolderOpen } from 'react-icons/hi2';
import { EyeIcon } from 'lucide-react';
import convertSlug from '@/utils/convertSlug';
import { useRouter } from 'next/navigation';
import { IDriveItem } from '@/types/driver';
import globalConfig from '@/app.config';

interface GridDocumentPreviewProps {
    content: IDriveItem[];
    url: string;
    onPreviewFile?: (file: IDriveItem) => void;
    onFolderClick?: () => void;
}

export default function GridDocumentPreview({ content, url, onPreviewFile, onFolderClick }: GridDocumentPreviewProps) {
    const router = useRouter();
    const folders = content.filter(i => i.isFolder);
    const files = content.filter(i => !i.isFolder);

    return (
        <div className="w-full flex flex-col gap-6">
            {/* Folders */}
            {folders.length > 0 && (
                <div>
                    <div className="mb-2 font-semibold text-gray-700">Thư mục</div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {folders.map(item => {
                            const path = `/document/${url}/${convertSlug(item.name)}`;
                            return (
                                <div
                                    key={item.folderId}
                                    className="flex flex-col items-center justify-center bg-yellow-50 hover:bg-yellow-100 rounded-xl p-6 cursor-pointer shadow group transition"
                                    onClick={() => {
                                        if (item.isFolder) {
                                            onFolderClick?.();
                                            router.push(path);
                                        }
                                    }}
                                >
                                    <HiFolderOpen className="w-16 h-16 text-yellow-500 mb-2 group-hover:scale-110 transition" />
                                    <div className="font-medium text-center truncate w-full group-hover:text-yellow-700">{item.name}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Files */}
            {files.length > 0 && (
                <div>
                    <div className="mb-2 font-semibold text-gray-700">Tập tin</div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {files.map(item => (
                            <div
                                key={item.folderId}
                                className="relative bg-white rounded-xl shadow flex flex-col items-center p-4 group hover:shadow-lg transition"
                                onClick={() => onPreviewFile?.(item)}
                            >
                                <img
                                    src={`${globalConfig.baseUrl}/driver/thumbnail/${item?.folderId}`}
                                    className="w-100 h-100 object-cover rounded mb-2 border transition-transform duration-200 group-hover:scale-150 z-10"
                                    style={{ cursor: 'pointer' }}
                                />
                                {/* File name */}
                                <div className="font-medium text-center truncate w-full mb-2">{item.name}</div>
                                {/* Eye icon */}
                                <button
                                    className="absolute top-2 right-2 p-1 rounded-full bg-white shadow hover:bg-blue-100"
                                    title="Xem nhanh"
                                    onClick={e => {
                                        e.stopPropagation();
                                        onPreviewFile?.(item);
                                    }}
                                >
                                    <EyeIcon className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}