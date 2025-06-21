'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { EyeOutlined, UnorderedListOutlined } from '@ant-design/icons'
import GridDocumentList from './GridDocumentList'
import PathFolder from './PathFolder'
import PreviewFile from './PreviewFile'
import { loadFolder, findFolderByName } from '@/actions/driver.actions'
import { ILoadFolder } from '@/types/driver'
import GridDocumentPreview from './GridDocumentPreview'

const GridDocument = () => {
  const [mode, setMode] = useState<'previewMode' | 'listMode'>('previewMode')
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<ILoadFolder[]>([])
  const [error, setError] = useState<string | null>(null)
  const [previewFileId, setPreviewFileId] = useState<string | null>(null)

  const HOMEID = process.env.NEXT_PUBLIC_FOLDER_ID_HOME || ''
  const [path, setPath] = useState<{ id: string; name: string }[]>([
    { id: HOMEID, name: 'Home' },
  ])

  const params = useParams()
  const slug = Array.isArray(params?.slug) ? params.slug : []

  const prevSlugRef = useRef<string | null>(null)

  const handlePathChange = (newPath: { id: string; name: string }[]) => {
    setPath(newPath)
  }

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
          return
        }

        for (const rawSegment of slug) {
          const segment = decodeURIComponent(rawSegment)
          const folder = await findFolderByName(segment, currentId)
          if (!folder) throw new Error(`Không tìm thấy thư mục: ${segment}`)
          newPath.push({ id: folder.data.folderId, name: folder.data.name })
          currentId = folder.data.folderId
        }

        const response = await loadFolder(currentId)
        setItems(response.data)
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

  return (
    <div className="container mx-auto p-4 max-w-full">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-4 px-4">
        <PathFolder path={path} onPathChange={handlePathChange} />
        <div className="flex gap-2">
          <button
            className={`transition-all rounded-lg px-4 py-2 flex items-center text-xl font-semibold shadow-sm
              ${mode === 'previewMode'
                ? 'bg-blue-600 text-white scale-110 shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-600'}`}
            onClick={() => setMode('previewMode')}
          >
            <EyeOutlined />
          </button>
          <button
            className={`transition-all rounded-lg px-4 py-2 flex items-center text-xl font-semibold shadow-sm
              ${mode === 'listMode'
                ? 'bg-blue-600 text-white scale-110 shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-600'}`}
            onClick={() => setMode('listMode')}
          >
            <UnorderedListOutlined />
          </button>
        </div>
      </div>

      <div className="relative min-h-[300px]">
        <div
          className="transition-opacity duration-300 ease-in-out"
          style={{
            opacity: mode === 'previewMode' ? 1 : 0,
            pointerEvents: mode === 'previewMode' ? 'auto' : 'none',
            position: mode === 'previewMode' ? 'relative' : 'absolute',
            top: 0,
            left: 0,
            width: '100%',
          }}
        >
          <GridDocumentPreview
            loading={loading}
            items={items}
            error={error}
            path={path}
            onPathChange={handlePathChange}
            onPreview={(fileId) => setPreviewFileId(fileId)}
          />
        </div>
        <div
          className="transition-opacity duration-300 ease-in-out"
          style={{
            opacity: mode === 'listMode' ? 1 : 0,
            pointerEvents: mode === 'listMode' ? 'auto' : 'none',
            position: mode === 'listMode' ? 'relative' : 'absolute',
            top: 0,
            left: 0,
            width: '100%',
          }}
        >
          <GridDocumentList
            loading={loading}
            items={items}
            error={error}
            path={path}
            onPathChange={handlePathChange}
            onPreview={(fileId) => setPreviewFileId(fileId)}
          />
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
