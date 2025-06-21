// GridDocument.tsx
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import {
  EyeOutlined,
  UnorderedListOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
} from '@ant-design/icons'
import GridDocumentList from './GridDocumentList'
import PathFolder from './PathFolder'
import PreviewFile from './PreviewFile'
import { loadFolder, findFolderByName } from '@/actions/driver.actions'
import { ILoadFolder } from '@/types/driver'
import GridDocumentPreview from './GridDocumentPreview'
import TreeView, { toDataNode } from './TreeView'
import type { DataNode } from 'antd/es/tree'

const GridDocument = () => {
  const [mode, setMode] = useState<'previewMode' | 'listMode'>('previewMode')
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<ILoadFolder[]>([])
  const [error, setError] = useState<string | null>(null)
  const [previewFileId, setPreviewFileId] = useState<string | null>(null)
  const [showTree, setShowTree] = useState(true)
  const [treeData, setTreeData] = useState<DataNode[]>([])
  const [selectedKey, setSelectedKey] = useState<string | null>(null)

  const HOMEID = process.env.NEXT_PUBLIC_FOLDER_ID_HOME || ''
  const [path, setPath] = useState<{ id: string; name: string }[]>([
    {
      id: HOMEID,
      name: 'Home',
    },
  ])

  const params = useParams()
  const slug = Array.isArray(params?.slug) ? params.slug : []
  const prevSlugRef = useRef<string | null>(null)

  useEffect(() => {
    const currentSlugStr = slug.join('/')
    if (prevSlugRef.current !== null && prevSlugRef.current === currentSlugStr)
      return
    prevSlugRef.current = currentSlugStr

    const fetchAll = async () => {
      setLoading(true)
      setError(null)
      try {
        let currentId = HOMEID
        const newPath = [{ id: HOMEID, name: 'Home' }]

        if (slug.length === 0) {
          const response = await loadFolder(HOMEID)
          setItems(response.data)
          setPath(newPath)
          setSelectedKey(HOMEID)
          setTreeData(response.data.map(toDataNode))
          return
        }

        for (const rawSegment of slug) {
          const segment = decodeURIComponent(rawSegment)
          const folder = await findFolderByName(segment, currentId)
          if (!folder) throw new Error(`Không tìm thấy thư mục: ${segment}`)
          newPath.push({ id: folder.data.folderId, name: folder.data.name })
          currentId = folder.data.folderId
        }

        const rootRes = await loadFolder(HOMEID)
        let updatedTree: DataNode[] = rootRes.data.map(toDataNode)

        let currentList = updatedTree
        for (let i = 1; i < newPath.length; i++) {
          const id = newPath[i].id
          const folderRes = await loadFolder(id)
          const children = folderRes.data.map(toDataNode)

          const parentId = newPath[i - 1].id
          const updateTree = (list: DataNode[]): DataNode[] =>
            list.map((node) =>
              node.key === parentId
                ? { ...node, children }
                : node.children
                ? { ...node, children: updateTree(node.children) }
                : node,
            )

          updatedTree = updateTree(updatedTree)
          currentList = children
        }

        setTreeData(updatedTree)
        setItems(await loadFolder(currentId).then((res) => res.data))
        setSelectedKey(currentId)
        setPath(newPath)
      } catch (err) {
        console.error(err)
        setError('Tải thư mục thất bại')
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [slug])

  const handleLoadChildren = async (folderId: string): Promise<DataNode[]> => {
    const res = await loadFolder(folderId)
    const children = res.data.map(toDataNode)

    const updateTree = (
      list: DataNode[],
      key: string,
      children: DataNode[],
    ): DataNode[] => {
      return list.map((node) => {
        if (node.key === key) return { ...node, children }
        if (node.children)
          return { ...node, children: updateTree(node.children, key, children) }
        return node
      })
    }

    setTreeData((prev) => updateTree(prev, folderId, children))
    return children
  }

  const handleSelectFolderFromTree = (
    folderId: string,
    pathArr: DataNode[],
  ) => {
    setSelectedKey(folderId)
    setPath(
      pathArr.map((i) => ({
        id: i.key as string,
        name: (i.title as any)?.props?.children[1]?.props?.children || '',
      })),
    )
    loadFolder(folderId).then((res) => setItems(res.data))
  }

  return (
    <div className="container mx-auto p-4 max-w-full">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-4 px-4">
        <PathFolder path={path} onPathChange={setPath} />
        <div className="flex gap-2">
          <button
            className={`transition-all rounded-lg px-4 py-2 flex items-center text-xl font-semibold shadow-sm ${
              mode === 'previewMode'
                ? 'bg-blue-600 text-white scale-110 shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-600'
            }`}
            onClick={() => setMode('previewMode')}
          >
            <EyeOutlined />
          </button>
          <button
            className={`transition-all rounded-lg px-4 py-2 flex items-center text-xl font-semibold shadow-sm ${
              mode === 'listMode'
                ? 'bg-blue-600 text-white scale-110 shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-600'
            }`}
            onClick={() => setMode('listMode')}
          >
            <UnorderedListOutlined />
          </button>
        </div>
      </div>

      <div className="flex w-full" style={{ height: 'calc(100vh - 220px)' }}>
        <div className="relative">
          <button
            className="absolute top-2 right-[-18px] z-20 bg-white border border-slate-200 rounded-full p-1 shadow hover:bg-slate-100 transition"
            onClick={() => setShowTree(!showTree)}
            title={showTree ? 'Ẩn cây' : 'Hiện cây'}
          >
            {showTree ? (
              <DoubleLeftOutlined className="text-lg" />
            ) : (
              <DoubleRightOutlined className="text-lg" />
            )}
          </button>
          <div
            className={`transition-all duration-300 ${
              showTree
                ? 'basis-3/10 max-w-[30vw] min-w-[220px]'
                : 'basis-0 max-w-0 min-w-0'
            } overflow-hidden`}
            style={{ width: showTree ? undefined : 0 }}
          >
            {showTree && (
              <div className="pr-4 pt-2 h-full">
                <div className="h-full w-[250px] min-w-[220px] max-w-[250px] overflow-x-auto">
                  <TreeView
                    treeData={treeData}
                    selectedKey={selectedKey || undefined}
                    onSelectFolder={handleSelectFolderFromTree}
                    onLoadChildren={handleLoadChildren}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 pl-0 sm:pl-4 h-full">
          <div
            className="transition-opacity duration-300 ease-in-out h-full overflow-y-auto"
            style={{
              opacity: mode === 'previewMode' ? 1 : 0,
              pointerEvents: mode === 'previewMode' ? 'auto' : 'none',
              position: mode === 'previewMode' ? 'relative' : 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              maxHeight: '100%',
            }}
          >
            <GridDocumentPreview
              loading={loading}
              items={items}
              error={error}
              path={path}
              onPathChange={setPath}
              onPreview={(fileId) => setPreviewFileId(fileId)}
            />
          </div>
          <div
            className="transition-opacity duration-300 ease-in-out h-full overflow-y-auto"
            style={{
              opacity: mode === 'listMode' ? 1 : 0,
              pointerEvents: mode === 'listMode' ? 'auto' : 'none',
              position: mode === 'listMode' ? 'relative' : 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              maxHeight: '100%',
            }}
          >
            <GridDocumentList
              loading={loading}
              items={items}
              error={error}
              path={path}
              onPathChange={setPath}
              onPreview={(fileId) => setPreviewFileId(fileId)}
            />
          </div>
        </div>
      </div>

      {previewFileId && (
        <PreviewFile
          fileId={previewFileId}
          visible={!!previewFileId}
          onClose={() => setPreviewFileId(null)}
        />
      )}
    </div>
  )
}

export default GridDocument
