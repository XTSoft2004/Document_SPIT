import React, { useState } from 'react';
import { Card, Spin } from 'antd';
import { HiFolderOpen } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import { IDriveItem } from '@/types/driver';
import globalConfig from '@/app.config';
import convertSlug from '@/utils/convertSlug';

interface FileCardProps {
    item: IDriveItem;
    onPreviewFile?: (file: IDriveItem) => void;
}

export const FileCard: React.FC<FileCardProps> = ({ item, onPreviewFile }) => {
    const [loading, setLoading] = useState(true);

    return (
        <Card
            key={item.documentId}
            className="rounded-xl group hover:scale-105 hover:shadow-lg transition-transform duration-200"
            styles={{
                body: {
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    overflow: 'hidden',
                },
            }}
            onClick={() => onPreviewFile?.(item)}
        >
            <div className={`w-full flex items-center justify-center relative mb-2 ${loading ? 'h-[70px]' : 'h-42'}`}>
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60 z-20">
                        <Spin />
                    </div>
                )}
                <img
                    src={`${globalConfig.baseUrl}/document/thumbnail/${item.documentId}`}
                    className="w-full h-42 object-cover rounded border z-10"
                    alt={item.name}
                    onLoad={() => setLoading(false)}
                    onError={() => setLoading(false)}
                />
            </div>
            <div
                className="font-medium text-xs text-center w-full mb-2 line-clamp-2 break-words"
            >
                {item.name}
            </div>
        </Card>
    );
};

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