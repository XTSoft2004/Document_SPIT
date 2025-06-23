import { IDriveResponse } from '@/types/driver'
import { ITreeNode } from '@/types/tree'
import convertSlug from './convertSlug'

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
    key: item.name,
    isLeaf: !item.isFolder,
    path: [...parentPath, convertSlug(item.name)],
    children: item.children
      ? convertToTreeData(item.children, [
          ...parentPath,
          convertSlug(item.name),
        ])
      : [],
  }))
}
