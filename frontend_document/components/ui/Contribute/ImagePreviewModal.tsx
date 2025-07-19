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
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isOpen) {
      console.log('Modal opened with images:', images)
      setOrderedImages(images)
      // Prevent body scroll on mobile
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
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

  // Mobile touch handlers for reordering
  const moveImageUp = (index: number) => {
    if (index === 0) return
    const newImages = [...orderedImages]
    const temp = newImages[index]
    newImages[index] = newImages[index - 1]
    newImages[index - 1] = temp
    setOrderedImages(newImages)
  }

  const moveImageDown = (index: number) => {
    if (index === orderedImages.length - 1) return
    const newImages = [...orderedImages]
    const temp = newImages[index]
    newImages[index] = newImages[index + 1]
    newImages[index + 1] = temp
    setOrderedImages(newImages)
  }

  const handleSave = () => {
    onSave(orderedImages)
    onClose()
  }

  const removeImage = (imageId: string) => {
    setOrderedImages((prev) => prev.filter((img) => img.id !== imageId))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl max-w-7xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
              Preview và sắp xếp ảnh
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">
              Kéo thả ảnh bên trái để thay đổi thứ tự, xem preview PDF bên phải
            </p>
            <p className="text-xs text-gray-600 mt-1 sm:hidden">
              Vuốt để xem, chạm để sắp xếp
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors ml-2 p-1"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
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
        <div className="flex flex-col lg:flex-row h-[60vh] sm:h-[70vh]">
          {/* Left Panel - Image List */}
          <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-gray-200 p-3 sm:p-4 overflow-y-auto max-h-[30vh] lg:max-h-none mobile-scroll">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                Danh sách ảnh ({orderedImages.length})
              </h3>
              <div className="lg:hidden text-xs text-gray-500">
                Chạm để sắp xếp
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {orderedImages.map((image, index) => (
                <div
                  key={image.id}
                  draggable={!isMobile}
                  onDragStart={(e) => !isMobile && handleDragStart(e, index)}
                  onDragOver={!isMobile ? handleDragOver : undefined}
                  onDrop={(e) => !isMobile && handleDrop(e, index)}
                  className={`relative bg-gray-50 rounded-lg p-2 sm:p-3 border-2 transition-all duration-200 ${
                    !isMobile ? 'cursor-move' : ''
                  } ${
                    draggedIndex === index
                      ? 'border-blue-500 bg-blue-50 scale-105 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 active:border-blue-400'
                  } ${isMobile ? 'pb-12' : ''}`}
                >
                  {/* Page Number */}
                  <div className={`absolute top-1 sm:top-2 left-1 sm:left-2 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center ${
                    isMobile ? 'w-6 h-6' : 'w-5 h-5 sm:w-6 sm:h-6'
                  }`}>
                    {index + 1}
                  </div>

                  {/* Remove Button - Top Right */}
                  <button
                    onClick={() => removeImage(image.id)}
                    className={`absolute top-1 sm:top-2 right-1 sm:right-2 bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors active:scale-95 shadow-md ${
                      isMobile ? 'w-8 h-8 rounded-lg' : 'w-4 h-4 sm:w-5 sm:h-5 rounded-full'
                    }`}
                  >
                    <svg
                      className={`${isMobile ? 'w-4 h-4' : 'w-2 h-2 sm:w-3 sm:h-3'}`}
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
                  <div className="flex items-center space-x-2 sm:space-x-3 pt-4 sm:pt-6">
                    <img
                      src={image.preview}
                      alt={`Page ${index + 1}`}
                      className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded border flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
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

                  {/* Mobile Reorder Controls - Bottom */}
                  {isMobile && (
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-3 bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2">
                      <button
                        onClick={() => moveImageUp(index)}
                        disabled={index === 0}
                        className="bg-blue-500 text-white rounded-lg w-10 h-8 flex items-center justify-center hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm active:scale-95"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <div className="flex items-center text-xs text-gray-600 font-medium">
                        Sắp xếp
                      </div>
                      <button
                        onClick={() => moveImageDown(index)}
                        disabled={index === orderedImages.length - 1}
                        className="bg-blue-500 text-white rounded-lg w-10 h-8 flex items-center justify-center hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm active:scale-95"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Drag Indicator - Desktop only */}
                  {!isMobile && (
                    <div className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2">
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M3 15h18v-2H3v2zm0 4h18v-2H3v2zm0-8h18V9H3v2zm0-6v2h18V5H3z" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - PDF Preview */}
          <div className="flex-1 p-3 sm:p-4 overflow-y-auto mobile-scroll">
            <div className="flex items-center mb-3 sm:mb-4">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mr-2 flex-shrink-0"
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
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                Preview PDF: {documentName || 'Tài liệu'}.pdf
              </h3>
            </div>

            <div className="space-y-3 sm:space-y-6">
              {orderedImages.map((image, index) => (
                <div
                  key={image.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                >
                  {/* Page Header */}
                  <div className="bg-gray-50 px-3 sm:px-4 py-2 border-b border-gray-200">
                    <p className="text-xs sm:text-sm font-medium text-gray-700">
                      Trang {index + 1} / {orderedImages.length}
                    </p>
                  </div>

                  {/* Page Content */}
                  <div className="p-2 sm:p-4 flex justify-center">
                    <img
                      src={image.preview}
                      alt={`Page ${index + 1}`}
                      className="max-w-full h-auto max-h-48 sm:max-h-96 object-contain border border-gray-100 rounded"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between bg-gray-50 gap-3 sm:gap-0">
          <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            <span className="font-medium">{orderedImages.length}</span> ảnh sẽ
            được chuyển thành PDF
          </div>

          <div className="flex space-x-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              disabled={orderedImages.length === 0}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
            >
              Lưu thứ tự
            </button>
          </div>
        </div>
      </div>
      
      {/* Enhanced mobile styles */}
      <style jsx global>{`
        /* Smooth scrolling for mobile */
        .mobile-scroll {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }
        
        /* Prevent text selection during drag operations */
        .no-select {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        
        /* Enhanced touch targets for mobile */
        @media (max-width: 768px) {
          .touch-target {
            min-height: 44px;
            min-width: 44px;
          }
          
          /* Ensure mobile buttons are large enough */
          button {
            min-height: 32px;
            min-width: 32px;
            touch-action: manipulation;
          }
          
          /* Add haptic feedback for iOS */
          button:active {
            -webkit-tap-highlight-color: transparent;
          }
          
          /* Reduce motion for better mobile performance */
          @media (prefers-reduced-motion: reduce) {
            * {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        }
        
        /* Smooth transitions */
        .smooth-transition {
          transition: all 0.2s ease-in-out;
        }
        
        /* Mobile-optimized shadows */
        @media (max-width: 768px) {
          .mobile-shadow {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          
          /* Better spacing for mobile cards */
          .mobile-card {
            margin-bottom: 16px;
          }
          
          /* Prevent accidental zooming */
          input, button, select, textarea {
            font-size: 16px;
          }
        }
        
        /* Custom button styles for better mobile experience */
        @media (max-width: 768px) {
          .mobile-button {
            min-height: 48px;
            min-width: 48px;
            padding: 12px;
            border-radius: 8px;
            font-size: 16px;
          }
          
          .mobile-button-small {
            min-height: 40px;
            min-width: 40px;
            padding: 8px;
          }
        }
      `}</style>
    </div>
  )
}
