'use client'

import { useState, useEffect } from 'react'
import { ImageFile } from '@/utils/pdfUtils'

interface ImagePreviewModalProps {
  isOpen: boolean
  images: ImageFile[]
  onClose: () => void
  onSave: (reorderedImages: ImageFile[]) => void
  documentName: string
}

export default function ImagePreviewModal({
  isOpen,
  images,
  onClose,
  onSave,
  documentName,
}: ImagePreviewModalProps) {
  const [orderedImages, setOrderedImages] = useState<ImageFile[]>(images)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  useEffect(() => {
    if (isOpen) {
      console.log('Modal opened with images:', images)
      setOrderedImages(images)
    }
  }, [images, isOpen])

  if (!isOpen) return null

  console.log('Rendering modal with orderedImages:', orderedImages)

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()

    if (draggedIndex === null || draggedIndex === dropIndex) return

    const newImages = [...orderedImages]
    const draggedImage = newImages[draggedIndex]

    newImages.splice(draggedIndex, 1)

    newImages.splice(dropIndex, 0, draggedImage)

    setOrderedImages(newImages)
    setDraggedIndex(null)
  }

  const handleSave = () => {
    onSave(orderedImages)
    onClose()
  }

  const removeImage = (imageId: string) => {
    setOrderedImages((prev) => prev.filter((img) => img.id !== imageId))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-7xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Preview và sắp xếp ảnh
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Kéo thả ảnh bên trái để thay đổi thứ tự, xem preview PDF bên phải
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex h-[70vh]">
          {/* Left Panel - Image List */}
          <div className="w-1/3 border-r border-gray-200 p-4 overflow-y-auto">
            <h3 className="font-semibold text-gray-900 mb-4">
              Danh sách ảnh ({orderedImages.length})
            </h3>

            <div className="space-y-3">
              {orderedImages.map((image, index) => (
                <div
                  key={image.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`relative bg-gray-50 rounded-lg p-3 border-2 cursor-move transition-all duration-200 ${
                    draggedIndex === index
                      ? 'border-blue-500 bg-blue-50 scale-105 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Page Number */}
                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {index + 1}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeImage(image.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  {/* Image Preview */}
                  <div className="flex items-center space-x-3 pt-6">
                    <img
                      src={image.preview}
                      alt={`Page ${index + 1}`}
                      className="w-16 h-16 object-cover rounded border"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Trang {index + 1}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {image.file.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {(image.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>

                  {/* Drag Indicator */}
                  <div className="absolute bottom-2 right-2">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M3 15h18v-2H3v2zm0 4h18v-2H3v2zm0-8h18V9H3v2zm0-6v2h18V5H3z" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - PDF Preview */}
          <div className="flex-1 p-4 overflow-y-auto">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <svg
                className="w-5 h-5 text-red-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 1H7a2 2 0 00-2 2v16a2 2 0 002 2z"
                />
              </svg>
              Preview PDF: {documentName || 'Tài liệu'}.pdf
            </h3>

            <div className="space-y-6">
              {orderedImages.map((image, index) => (
                <div
                  key={image.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                >
                  {/* Page Header */}
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-700">
                      Trang {index + 1} / {orderedImages.length}
                    </p>
                  </div>

                  {/* Page Content */}
                  <div className="p-4 flex justify-center">
                    <img
                      src={image.preview}
                      alt={`Page ${index + 1}`}
                      className="max-w-full max-h-96 object-contain border border-gray-100 rounded"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{orderedImages.length}</span> ảnh sẽ
            được chuyển thành PDF
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              disabled={orderedImages.length === 0}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Lưu thứ tự
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
