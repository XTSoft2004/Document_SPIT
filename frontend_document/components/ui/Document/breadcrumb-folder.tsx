'use client'
import React from 'react'
import { Breadcrumb } from 'antd'
import { HomeOutlined } from '@ant-design/icons'

type PathFolderProps = {
  path: { id: string; name: string }[]
  setPath: React.Dispatch<React.SetStateAction<{ id: string; name: string }[]>>
  setCurrentFolderId: (folderId: string) => void
}

const PathFolder: React.FC<PathFolderProps> = ({
  path,
  setPath,
  setCurrentFolderId,
}) => {
  const handleClick = (index: number) => {
    const newPath = path.slice(0, index + 1)
    setPath(newPath)
    setCurrentFolderId(path[index].id)
  }

  const breadcrumbItems = path.map((item, index) => ({
    title:
      index === 0 ? (
        <span
          className="cursor-pointer text-gray-600"
          onClick={() => handleClick(index)}
        >
          <HomeOutlined />
        </span>
      ) : (
        <span
          onClick={() => handleClick(index)}
          className={`cursor-pointer ${
            index === path.length - 1
              ? 'text-gray-400'
              : 'text-blue-600 hover:text-blue-800 transition-colors duration-200'
          }`}
          title={item.name}
        >
          {item.name}
        </span>
      ),
  }))

  return <Breadcrumb items={breadcrumbItems} />
}

export default PathFolder
