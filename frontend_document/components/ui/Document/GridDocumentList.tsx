import React from 'react'
import { Card } from 'antd'
import { ILoadFolder } from '@/types/driver'
import { useRouter } from 'next/navigation'
import DocumentItem from './DocumentItem'

type GridDocumentListProps = {
  loading: boolean
  items: ILoadFolder[]
  error: string | null
  path: { id: string; name: string }[]
  onPathChange: (newPath: { id: string; name: string }[]) => void
  onPreview: (fileId: string) => void
}

const GridDocumentList: React.FC<GridDocumentListProps> = ({
  loading,
  items,
  error,
  path,
  onPathChange,
  onPreview,
}) => {
  const router = useRouter()

  const handleFolderClick = (folderId: string, name: string) => {
    const newPath = [...path, { id: folderId, name }]
    onPathChange(newPath)
    const url =
      '/document/' +
      newPath
        .slice(1)
        .map((p) => encodeURIComponent(p.name))
        .join('/')
    router.push(url)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="w-full min-h-[400px]">
        {loading ? (
          <div className="flex justify-center items-center h-full min-h-[200px]">
            <Card loading={true} className="w-full h-full border-none shadow-none" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {items.map((item) => (
              <DocumentItem
                key={item.id}
                item={item}
                onClick={() =>
                  item.isFolder
                    ? handleFolderClick(item.id, item.name)
                    : onPreview(item.id)
                }
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default GridDocumentList
