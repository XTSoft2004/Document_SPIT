import { HiFolderOpen } from 'react-icons/hi2'
import convertSlug from '@/utils/convertSlug'
import { usePathname, useRouter } from 'next/navigation'
import { IDriveItem, IDriveResponse } from '@/types/driver'
import { Card, Skeleton } from 'antd'
import LoadingSkeleton from '../Loading/LoadingSkeleton'
import NotFound from '../NotFound'
import { FileCard, FolderCard } from './Card'

interface GridDocumentPreviewProps {
  data: IDriveResponse[]
  content: IDriveItem[]
  url: string
  onPreviewFile?: (file: IDriveItem) => void
  onFolderClick?: () => void
  loading?: boolean
  isLogin?: boolean
  starDocument?: number[]
  onStarredUpdate?: (starDocument: number[]) => void
}

export default function GridDocumentPreview({
  data,
  content,
  url,
  onPreviewFile,
  onFolderClick,
  loading = false,
  isLogin = false,
  starDocument = [],
  onStarredUpdate,
}: GridDocumentPreviewProps) {
  const router = useRouter()
  const folders = content.filter((i) => i.isFolder)
  const files = content.filter((i) => !i.isFolder)
  const pathname = usePathname()

  const findPathRecursive = (
    nodes: IDriveResponse[],
    targetId: string,
    currentPath: string[] = [],
  ): string[] | null => {
    let i = 1
    for (const node of nodes) {
      const newPath = [...currentPath, convertSlug(node.name)]
      if (node.folderId === targetId) {
        return newPath
      }

      if (node.children && node.children.length > 0) {
        const result = findPathRecursive(node.children, targetId, newPath)
        if (result) {
          return result
        }
      }
    }
    return null
  }

  const handleFolderClick = (item: IDriveItem) => {
    onFolderClick?.()
    const foundPath = findPathRecursive(data, item.folderId)
    const path = foundPath
      ? `/document/${foundPath.join('/')}`
      : `/document/${url}/${convertSlug(item.name)}`

    const normalized = (s: string) => s.replace(/\/+$/, '')
    const current = normalized(pathname)
    const target = normalized(path)

    if (current === target) {
      const forcePath = `${path}/_`
      router.push(forcePath)
    } else {
      router.push(path)
    }
  }

  const handleFileClick = (item: IDriveItem) => {
    const foundPath = findPathRecursive(data, item.folderId)
    const path = foundPath
      ? `/document/${foundPath.slice(0, foundPath.length - 1).join('/')}`
      : `/document/${url}/${convertSlug(item.name)}`

    if (path === pathname) onPreviewFile?.(item)
    else router.push(path)
  }

  if (loading) {
    return (
      <div className="w-full flex flex-col gap-6">
        {[5, 8].map((count, idx) => (
          <div key={idx}>
            <div className="mb-2">
              <Skeleton.Input active size="small" />
            </div>
            <LoadingSkeleton count={count} columns={5} />
          </div>
        ))}
      </div>
    )
  }

  if (!content?.length) return <NotFound type="folder" />

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Folders */}
      {folders.length > 0 && (
        <div>
          <div className="mb-2 font-semibold text-gray-700">Thư mục</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {folders.map((item) => (
              <FolderCard
                key={item.folderId}
                item={item}
                handleItemClick={handleFolderClick}
              />
            ))}
          </div>
        </div>
      )}

      {/* Files */}
      {files.length > 0 && (
        <div>
          <div className="mb-2 font-semibold text-gray-700">Tập tin</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {files.map((item) => (
              <FileCard
                key={item.folderId}
                item={item}
                handleFileClick={handleFileClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
