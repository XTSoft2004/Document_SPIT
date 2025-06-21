import React from 'react'
import { Card } from 'antd'
import { ILoadFolder } from '@/types/driver'
import { useRouter } from 'next/navigation'
import DocumentItem from './DocumentItem'
import globalConfig from '@/app.config'

type GridDocumentPreviewProps = {
  loading: boolean
  items: ILoadFolder[]
  error: string | null
  path: { id: string; name: string }[]
  onPathChange: (newPath: { id: string; name: string }[]) => void
  onPreview: (fileId: string) => void
}

const GridDocumentPreview: React.FC<GridDocumentPreviewProps> = ({
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

  const folders = items.filter((item) => item.isFolder)
  const files = items.filter((item) => !item.isFolder)

  return (
    <div className="container mx-auto p-4">
      <div className="w-full min-h-[400px]">
        {loading ? (
          <div className="flex justify-center items-center h-full min-h-[200px]">
            <Card
              loading={true}
              className="w-full h-full border-none shadow-none"
            />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <>
            {/* Folder grid */}
            {folders.length > 0 && (
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mb-8">
                {folders.map((item) => (
                  <DocumentItem
                    key={item.id}
                    item={item}
                    onClick={() => handleFolderClick(item.id, item.name)}
                  />
                ))}
              </ul>
            )}
            {/* File grid */}
            {files.length > 0 && (
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {files.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-col items-center p-4 bg-white rounded-xl shadow-lg transition-all font-bold relative overflow-hidden group mx-auto"
                    style={{
                      minHeight: 270,
                      maxWidth: 220,
                      width: 220,
                    }}
                    onClick={() => onPreview(item.id)}
                  >
                    <div
                      className="flex justify-center items-center mb-3 bg-gradient-to-br from-blue-100 to-gray-100 rounded-lg p-2"
                      style={{
                        width: 150,
                        height: 180,
                      }}
                    >
                      <img
                        src={`${globalConfig.baseUrl}/driver/thumbnail/${item.id}`}
                        alt={item.name}
                        className="w-[150px] h-[160px] object-cover bg-gray-100 rounded-lg shadow-md transition-transform duration-200 group-hover:scale-[1.7]"
                      />
                    </div>
                    <div className="w-full flex flex-col gap-1 min-w-0">
                      <span className="text-base font-semibold text-gray-900 text-left whitespace-nowrap overflow-hidden text-ellipsis px-2">
                        {item.name}
                      </span>
                      <span className="text-xs text-blue-400 text-right font-medium pr-3">
                        {new Date(item.createdTime).toLocaleDateString()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default GridDocumentPreview
