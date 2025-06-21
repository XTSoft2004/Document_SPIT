'use client'

import React, { useEffect, useState } from 'react'
import { Tree } from 'antd'
import type { DataNode, EventDataNode, TreeProps } from 'antd/es/tree'
import {
  FileOutlined,
  FileImageFilled,
  FilePdfFilled,
  FileWordFilled,
  FolderOpenFilled,
} from '@ant-design/icons'
import { ILoadFolder } from '@/types/driver'

const GetIcon = (isFolder: boolean, typeDocument: string) => {
  if (isFolder)
    return (
      <FolderOpenFilled className="text-yellow-400 bg-yellow-100 rounded p-1 text-2xl" />
    )
  switch (typeDocument) {
    case 'image':
      return (
        <FileImageFilled className="text-sky-400 bg-sky-100 rounded p-1 text-2xl" />
      )
    case 'pdf':
      return (
        <FilePdfFilled className="text-red-500 bg-red-100 rounded p-1 text-2xl" />
      )
    case 'docx':
      return (
        <FileWordFilled className="text-indigo-500 bg-indigo-100 rounded p-1 text-2xl" />
      )
    default:
      return (
        <FileOutlined className="text-slate-500 bg-slate-100 rounded p-1 text-2xl" />
      )
  }
}

export function toDataNode(node: ILoadFolder): DataNode {
  return {
    key: node.id,
    title: (
      <span className="flex items-center gap-2 max-w-[180px] truncate">
        {GetIcon(node.isFolder, node.typeDocument)}
        <span className="truncate">{node.name}</span>
      </span>
    ),
    isLeaf: !node.isFolder,
    children: node.isFolder ? undefined : undefined,
  }
}

type TreeViewProps = {
  treeData: DataNode[]
  onSelectFolder?: (folderId: string, path: DataNode[]) => void
  onLoadChildren?: (folderId: string) => Promise<DataNode[]>
  selectedKey?: string
}

const TreeView: React.FC<TreeViewProps> = ({
  treeData,
  onSelectFolder,
  onLoadChildren,
  selectedKey,
}) => {
  const [internalData, setInternalData] = useState<DataNode[]>(treeData)

  useEffect(() => {
    setInternalData(treeData)
  }, [treeData])

  const updateTreeData = (
    list: DataNode[],
    key: string,
    children: DataNode[],
  ): DataNode[] =>
    list.map((node) =>
      node.key === key
        ? { ...node, children }
        : {
            ...node,
            children: node.children
              ? updateTreeData(node.children, key, children)
              : undefined,
          },
    )

  const loadData: TreeProps['loadData'] = async (node) => {
    if (!onLoadChildren) return
    const children = await onLoadChildren(node.key as string)
    setInternalData((origin) =>
      updateTreeData(origin, node.key as string, children),
    )
  }

  const findPath = (
    nodes: DataNode[],
    targetKey: string,
    path: DataNode[] = [],
  ): DataNode[] | null => {
    for (const node of nodes) {
      const newPath = [...path, node]
      if (node.key === targetKey) return newPath
      if (node.children) {
        const found = findPath(node.children, targetKey, newPath)
        if (found) return found
      }
    }
    return null
  }

  const handleSelect: TreeProps['onSelect'] = (selectedKeys) => {
    const key = selectedKeys[0] as string
    const path = findPath(internalData, key) || []
    onSelectFolder?.(key, path)
  }

  return (
    <div
      className="bg-white border-slate-200 rounded-xl shadow-sm w-full h-full flex flex-col overflow-hidden"
      style={{ minWidth: 220, maxWidth: 250, width: 250, height: '100%' }}
    >
      <Tree
        showIcon
        treeData={internalData}
        loadData={loadData}
        onSelect={handleSelect}
        selectedKeys={selectedKey ? [selectedKey] : []}
      />
    </div>
  )
}

export default TreeView
