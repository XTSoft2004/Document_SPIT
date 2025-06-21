import React from 'react'
import {
  FileOutlined,
  FolderOutlined,
  FileImageOutlined,
  FilePdfOutlined,
} from '@ant-design/icons'
import { Card } from 'antd'
import { ILoadFolder } from '@/types/driver'
import styles from './GridDocumentList.module.css'

type GridDocumentListProps = {
  loading: boolean
  items: ILoadFolder[]
  error: string | null
  path: { id: string; name: string }[]
  setPath: React.Dispatch<React.SetStateAction<{ id: string; name: string }[]>>
  setCurrentFolderId: (folderId: string) => void
  onPreview: (fileId: string) => void
}

const GridDocumentList: React.FC<GridDocumentListProps> = ({
  loading,
  items,
  error,
  path,
  setPath,
  setCurrentFolderId,
  onPreview,
}) => {
  const getIcon = (isFolder: boolean, typeDocument: string) => {
    if (isFolder) return <FolderOutlined className="text-gray-500" />
    switch (typeDocument) {
      case 'image':
        return <FileImageOutlined className="text-gray-500" />
      case 'pdf':
        return <FilePdfOutlined className="text-gray-500" />
      case 'docx':
        return <FileOutlined className="text-gray-500" />
      default:
        return <FileOutlined className="text-gray-500" />
    }
  }

  const handleFolderClick = (folderId: string, name: string) => {
    const newPath = [...path, { id: folderId, name }]
    setPath(newPath)
    setCurrentFolderId(folderId)
  }

  return (
    <div className="container mx-auto p-4">
      <div className={styles.documentWrapper}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <Card loading={true} className={styles.loadingCard} />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 h-full">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between p-4 rounded-lg shadow-md cursor-pointer transition-all duration-200 bg-gray-100 hover:bg-gray-200"
                onClick={() =>
                  item.isFolder
                    ? handleFolderClick(item.id, item.name)
                    : onPreview(item.id)
                }
              >
                <div className="flex items-center flex-1 min-w-0">
                  {getIcon(item.isFolder, item.typeDocument)}
                  <span
                    className="ml-3 text-gray-800 font-medium truncate"
                    title={item.name}
                  >
                    {item.name}
                  </span>
                </div>
                <span className="text-gray-500 text-sm whitespace-nowrap ml-3">
                  {new Date(item.createdTime).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default GridDocumentList
