import React, { useState, useEffect } from 'react'
import { EyeOutlined, UnorderedListOutlined } from '@ant-design/icons'
import GridDocumentList from './GridDocumentList'
import styles from './GridDocument.module.css'
import { loadFolder } from '@/actions/driver.actions'
import { ILoadFolder } from '@/types/driver'
import PathFolder from './PathFolder'
import PreviewFile from './PreviewFile'

const GridDocument: React.FC = () => {
  const [mode, setMode] = useState<'previewMode' | 'listMode'>('previewMode')
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<ILoadFolder[]>([])
  const [currentFolderId, setCurrentFolderId] = useState(
    process.env.NEXT_PUBLIC_FOLDER_ID_HOME || '',
  )
  const [path, setPath] = useState<{ id: string; name: string }[]>([
    {
      id: process.env.NEXT_PUBLIC_FOLDER_ID_HOME || '',
      name: 'Home',
    },
  ])
  const [error, setError] = useState<string | null>(null)
  const [previewFileId, setPreviewFileId] = useState<string | null>(null)

  useEffect(() => {
    const fetchFolder = async () => {
      setLoading(true)
      setError(null)
      setItems([])
      try {
        const response = await loadFolder(currentFolderId)
        setItems(response.data)
      } catch (err) {
        console.error('Error fetching folder:', err)
        setError('Failed to load folder. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchFolder()
  }, [currentFolderId])

  return (
    <div className={styles.container}>
      <div className="flex flex-wrap justify-between items-center mb-4 gap-4 px-4">
        <PathFolder
          path={path}
          setPath={setPath}
          setCurrentFolderId={setCurrentFolderId}
        />
        <div className={styles.buttonGroup}>
          <button
            className={`${styles.button} ${
              mode === 'previewMode'
                ? styles.activeButton
                : styles.inactiveButton
            }`}
            onClick={() => setMode('previewMode')}
          >
            <EyeOutlined />
          </button>
          <button
            className={`${styles.button} ${
              mode === 'listMode' ? styles.activeButton : styles.inactiveButton
            }`}
            onClick={() => setMode('listMode')}
          >
            <UnorderedListOutlined />
          </button>
        </div>
      </div>

      {mode === 'previewMode' ? (
        <div className={styles.fadeIn}>List Mode (To be implemented)</div>
      ) : (
        <GridDocumentList
          loading={loading}
          items={items}
          error={error}
          path={path}
          setPath={setPath}
          setCurrentFolderId={setCurrentFolderId}
          onPreview={(fileId) => setPreviewFileId(fileId)}
        />
      )}

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
