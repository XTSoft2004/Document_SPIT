'use client'
import { useState, useEffect, useRef } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { ZoomIn, ZoomOut } from 'lucide-react'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString()

interface PreviewPDFProps {
  src: string
  loading: boolean
  setLoading: (loading: boolean) => void
}

export default function PreviewPDF({
  src,
  loading,
  setLoading,
}: PreviewPDFProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [scale, setScale] = useState<number>(1.0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.1, 3))
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.1, 0.5))

  const handleLoadSuccess = ({ numPages }: { numPages: number }) => {
    setLoading(false)
    setNumPages(numPages)
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault()
        if (e.deltaY < 0) handleZoomIn()
        else handleZoomOut()
      }
    }

    const onScroll = () => {
      if (!container) return

      const pages = container.querySelectorAll<HTMLDivElement>('.pdf-page')
      let closestPage = 1
      let closestDistance = Infinity
      pages.forEach((page, index) => {
        const rect = page.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()
        const distance = Math.abs(
          rect.top +
            rect.height / 2 -
            (containerRect.top + containerRect.height / 2),
        )
        if (distance < closestDistance) {
          closestDistance = distance
          closestPage = index + 1
        }
      })
      setCurrentPage(closestPage)

      const maxScroll = container.scrollHeight - container.clientHeight
      if (container.scrollTop >= maxScroll) {
        container.scrollTop = maxScroll
      }
    }

    container.addEventListener('wheel', onWheel, { passive: false })
    container.addEventListener('scroll', onScroll)

    return () => {
      container.removeEventListener('wheel', onWheel)
      container.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <>
      {!loading && (
        <div className="flex flex-col items-center w-full">
          <div className="mt-2 mb-2 flex space-x-4 items-center">
            <button
              onClick={handleZoomOut}
              className="p-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <p className="p-2 text-sm">
              {(scale * 100).toFixed(0)}% &nbsp; | &nbsp; {currentPage}/
              {numPages}
            </p>
            <button
              onClick={handleZoomIn}
              className="p-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <div
            ref={containerRef}
            className="w-full flex flex-col items-center overflow-auto border rounded-md max-h-[80vh] p-4 overscroll-contain"
          >
            <div
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease-out',
              }}
            >
              <Document
                file={src}
                onLoadSuccess={handleLoadSuccess}
                loading={null}
              >
                {Array.from({ length: numPages }, (_, i) => (
                  <div key={i} className="pdf-page mb-4 flex justify-center">
                    <Page
                      pageNumber={i + 1}
                      scale={1}
                      renderAnnotationLayer={false}
                      renderTextLayer={false}
                      loading={null}
                    />
                  </div>
                ))}
              </Document>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
