import React from 'react';
import { Card } from 'antd';
import { HiFolderOpen } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import { IDriveItem } from '@/types/driver';
import globalConfig from '@/app.config';
import convertSlug from '@/utils/convertSlug';

interface FileCardProps {
    item: IDriveItem;
    onPreviewFile?: (file: IDriveItem) => void;
}

export const FileCard: React.FC<FileCardProps> = ({ item, onPreviewFile }) => (
    <Card
        key={item.folderId}
        className="rounded-xl group hover:shadow-lg transition"
        styles={{
            body: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                overflow: 'hidden',
            },
        }}
        onClick={() => onPreviewFile?.(item)}
    >
        <img
            src={`${globalConfig.baseUrl}/driver/thumbnail/${item.folderId}`}
            className="w-full h-24 object-cover rounded mb-2 border transition-transform duration-200 group-hover:scale-105 z-10"
            style={{ cursor: 'pointer' }}
            alt={item.name}
        />
        <div className="font-medium text-xs text-center w-full mb-2 truncate overflow-hidden whitespace-nowrap">
            {item.name}
        </div>
    </Card>
);

interface FolderCardProps {
    item: IDriveItem;
    url: string;
    onFolderClick?: () => void;
    router: ReturnType<typeof useRouter>;
}

export const FolderCard: React.FC<FolderCardProps> = ({
    item,
    url,
    onFolderClick,
    router,
}) => {
    const path = `/document/${url}/${convertSlug(item.name)}`;
    return (
        <Card
            key={item.folderId}
            className="flex flex-col items-center justify-center bg-yellow-50 hover:bg-yellow-100 rounded-xl cursor-pointer shadow group transition"
            styles={{
                body: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    overflow: 'hidden',
                },
            }}
            onClick={() => {
                onFolderClick?.();
                router.push(path);
            }}
        >
            <HiFolderOpen className="w-16 h-16 text-yellow-500 mb-2 group-hover:scale-110 transition" />
            <div className="font-medium text-center w-full group-hover:text-yellow-700 truncate overflow-hidden whitespace-nowrap">
                {item.name}
            </div>
        </Card>
    );
};

export default FileCard;