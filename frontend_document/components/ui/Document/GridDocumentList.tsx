import { HiOutlineDocument, HiFolderOpen } from 'react-icons/hi2';
import { FaFilePdf, FaFileWord } from 'react-icons/fa6';
import { EyeIcon } from 'lucide-react'; // Thêm dòng này
import convertSlug from '@/utils/convertSlug';
import { useRouter } from 'next/navigation';
import { IDriveItem } from '@/types/driver';

interface GridDocumentListProps {
    content: IDriveItem[];
    url: string;
    onPreviewFile?: (file: IDriveItem) => void;
}

function getFileIcon(name: string, isFolder: boolean) {
    if (isFolder) return <HiFolderOpen className="w-8 h-8 text-yellow-500 fill-yellow-400" />;
    if (name.endsWith('.pdf')) return <FaFilePdf className="w-8 h-8 text-red-500" />;
    if (name.endsWith('.doc') || name.endsWith('.docx')) return <FaFileWord className="w-8 h-8 text-blue-600" />;
    return <HiOutlineDocument className="w-8 h-8 text-gray-400" />;
}

export default function GridDocumentList({ content, url, onPreviewFile }: GridDocumentListProps) {
    const router = useRouter();

    return (
        <div className="bg-white rounded-xl w-full flex flex-col gap-1 min-h-[500px] max-h-[calc(100vh-170px)] overflow-auto">
            {content
                .slice()
                .sort((a, b) => {
                    if (a.isFolder !== b.isFolder) return a.isFolder ? -1 : 1;
                    return a.name.localeCompare(b.name, 'vi', { sensitivity: 'base' });
                })
                .map((item) => {
                    const path = `/document/${url}/${convertSlug(item.name)}`;
                    return (
                        <div
                            key={item.folderId}
                            className="flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer hover:bg-blue-50 transition group"
                            onClick={() => {
                                if (item.isFolder) router.push(path);
                                else onPreviewFile?.(item);
                            }}
                        >
                            <div>
                                {getFileIcon(item.name, item.isFolder)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-medium text-base truncate group-hover:text-blue-700">{item.name}</div>
                            </div>
                            {!item.isFolder && (
                                <button
                                    className="ml-2 p-1 rounded hover:bg-gray-200"
                                    title="Xem nhanh"
                                    onClick={e => {
                                        e.stopPropagation();
                                        onPreviewFile?.(item);
                                    }}
                                >
                                    <EyeIcon className="w-5 h-5 text-gray-500 hover:text-blue-600" />
                                </button>
                            )}
                        </div>
                    );
                })}
        </div>
    );
}