'use client'

import React, { useState } from 'react'
import { Breadcrumb, Tooltip } from 'antd'
import { HomeOutlined, CopyOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'

type PathFolderProps = {
  path: { id: string; name: string }[]
  onPathChange: (newPath: { id: string; name: string }[]) => void
}

const PathFolder: React.FC<PathFolderProps> = ({ path, onPathChange }) => {
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const handleClick = (index: number) => {
    const newPath = path.slice(0, index + 1)
    onPathChange(newPath)

    const url =
      '/document/' +
      newPath
        .slice(1)
        .map((p) => encodeURIComponent(p.name))
        .join('/')
    router.push(url)
  }

  const currentUrl =
    typeof window !== 'undefined'
      ? window.location.origin +
        '/document/' +
        path
          .slice(1)
          .map((p) => encodeURIComponent(p.name))
          .join('/')
      : ''

  const handleCopy = async () => {
    if (!currentUrl) return
    await navigator.clipboard.writeText(currentUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="rounded-xl px-5 py-3 flex items-center min-w-[220px]">
      <Breadcrumb
        className="text-base font-medium"
        separator={<span className="text-sky-400 font-bold px-1">/</span>}
        items={path.map((item, index) => ({
          title:
            index === 0 ? (
              <span
                onClick={() => handleClick(index)}
                className="cursor-pointer text-blue-600 text-xl hover:text-sky-500 transition-colors flex items-center"
                style={{ position: 'relative', top: '7px' }}
              >
                <HomeOutlined />
              </span>
            ) : (
              <span
                onClick={() => handleClick(index)}
                className={`cursor-pointer flex items-center px-1 rounded-md transition-colors max-w-[160px] truncate
                  ${
                    index === path.length - 1
                      ? 'text-slate-400 bg-slate-200 cursor-default'
                      : 'text-blue-600 hover:text-sky-500 hover:bg-blue-50'
                  }`}
                title={item.name}
              >
                {item.name}
                {index === path.length - 1 && (
                  <Tooltip title={copied ? 'Đã copy!' : 'Copy link'}>
                    <CopyOutlined
                      className="ml-1 cursor-pointer text-slate-400 hover:text-blue-600 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCopy()
                      }}
                    />
                  </Tooltip>
                )}
              </span>
            ),
        }))}
      />
    </div>
  )
}

export default PathFolder
