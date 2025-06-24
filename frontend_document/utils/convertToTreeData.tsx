import { IDriveResponse } from '@/types/driver'
import { ITreeNode } from '@/types/tree'
import convertSlug from './convertSlug'
import { HiFolderOpen, HiOutlineDocument } from 'react-icons/hi2'
import { FaFilePdf, FaFileWord, FaFileImage } from 'react-icons/fa6'
import React from 'react'

function getIcon(name: string, isLeaf: boolean) {
  if (!isLeaf) return <HiFolderOpen className="text-yellow-500 w-5 h-5" />
  const ext = name.split('.').pop()?.toLowerCase()
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext || '')) {
    return <FaFileImage className="text-blue-400 w-5 h-5" />
  }
  if (['pdf'].includes(ext || '')) {
    return <FaFilePdf className="text-red-500 w-5 h-5" />
  }
  if (['doc', 'docx'].includes(ext || '')) {
    return <FaFileWord className="text-blue-600 w-5 h-5" />
  }
  return <HiOutlineDocument className="text-gray-400 w-5 h-5" />
}

export function convertToTreeData(
  data: IDriveResponse[],
  parentPath: string[] = [],
): ITreeNode[] {
  const sortedData = [...data].sort((a, b) => {
    if (a.isFolder !== b.isFolder) {
      return a.isFolder ? -1 : 1
    }
    return a.name.localeCompare(b.name)
  })

  return sortedData.map((item) => ({
    title: item.name,
    key: item.folderId,
    isLeaf: !item.isFolder,
    id: item.folderId,
    name: item.name,
    icon: getIcon(item.name, !item.isFolder),
    path: [...parentPath, convertSlug(item.name)],
    children: item.children
      ? convertToTreeData(item.children, [
        ...parentPath,
        convertSlug(item.name),
      ])
      : [],
  }))
}
