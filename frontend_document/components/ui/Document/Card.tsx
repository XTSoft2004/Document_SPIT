import React, { useState } from 'react'
import { Card, Spin } from 'antd'
import { HiFolderOpen } from 'react-icons/hi'
import { useRouter } from 'next/navigation'
import { IDriveItem } from '@/types/driver'
import globalConfig from '@/app.config'
import convertSlug from '@/utils/convertSlug'
import Image from 'next/image'

interface FileCardProps {
  item: IDriveItem
  handleFileClick?: (file: IDriveItem) => void
}

export const FileCard: React.FC<FileCardProps> = ({ item, handleFileClick }) => {
  const [loading, setLoading] = useState(true)

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
      onClick={() => handleFileClick?.(item)}
    >
      <div
        className={`w-full flex items-center justify-center relative mb-2 ${
          loading ? 'h-[70px]' : 'h-42'
        }`}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60 z-20">
            <Spin />
          </div>
        )}
        <Image
          width={700}
          height={300}
          src={`${globalConfig.baseUrl}/document/thumbnail/${item.documentId}`}
          alt={item.name}
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
          style={{
            width: '100%',
            height: '168px',
            objectFit: 'cover',
            borderRadius: 'inherit',
            border: 'inherit',
            zIndex: 10,
          }}
        />
      </div>
      <div className="font-medium text-xs text-center w-full mb-2 line-clamp-2 break-words mt-5F">
        {item.name}
      </div>
    </Card>
  )
}

interface FolderCardProps {
  item: IDriveItem
  handleItemClick?: (item: IDriveItem) => void
}

export const FolderCard: React.FC<FolderCardProps> = ({
  item,
  handleItemClick,
}) => {
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
      onClick={() => handleItemClick?.(item)}
    >
      <HiFolderOpen className="w-16 h-16 text-yellow-500 mb-2 group-hover:scale-110 transition" />
      <div className="font-medium text-center w-full group-hover:text-yellow-700 truncate overflow-hidden whitespace-nowrap">
        {item.name}
      </div>
    </Card>
  )
}

export default FileCard
