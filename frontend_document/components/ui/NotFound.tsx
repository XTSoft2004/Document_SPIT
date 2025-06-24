import { FolderOpenIcon, FileTextIcon } from 'lucide-react';

interface NotFoundProps {
    type?: 'folder' | 'file' | 'search';
    title?: string;
    description?: string;
}

export default function NotFound({
    type = 'folder',
    title,
    description
}: NotFoundProps) {
    const getContent = () => {
        switch (type) {
            case 'folder':
                return {
                    icon: <FolderOpenIcon className="w-16 h-16 text-gray-400" />,
                    title: title || 'Thư mục trống',
                    description: description || 'Thư mục này chưa có tài liệu nào.'
                };
            case 'file':
                return {
                    icon: <FileTextIcon className="w-16 h-16 text-gray-400" />,
                    title: title || 'Không tìm thấy tệp',
                    description: description || 'Tệp tin này không tồn tại hoặc đã bị xóa.'
                };
            case 'search':
                return {
                    icon: <FileTextIcon className="w-16 h-16 text-gray-400" />,
                    title: title || 'Không tìm thấy kết quả',
                    description: description || 'Không có tài liệu nào phù hợp với từ khóa tìm kiếm.'
                };
            default:
                return {
                    icon: <FolderOpenIcon className="w-16 h-16 text-gray-400" />,
                    title: title || 'Không có dữ liệu',
                    description: description || 'Hiện tại chưa có nội dung nào.'
                };
        }
    };

    const content = getContent();

    return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="mb-4">
                {content.icon}
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
                {content.title}
            </h3>
            <p className="text-gray-500 max-w-md">
                {content.description}
            </p>
        </div>
    );
}
