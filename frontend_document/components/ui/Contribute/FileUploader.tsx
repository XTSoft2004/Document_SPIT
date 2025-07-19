'use client'

import { useState } from 'react'
import { isImageFile, createImageFile, ImageFile } from '@/utils/pdfUtils'
import ImagePreview from './ImagePreview'

interface FileUploaderProps {
  file: File | null
  images: ImageFile[]
  onFileChange: (file: File | null) => void
  onImagesChange: (images: ImageFile[]) => void
  acceptedTypes?: string
  maxSize?: string
  className?: string
}

export default function FileUploader({
  file,
  images,
  onFileChange,
  onImagesChange,
  acceptedTypes = '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.image,.jpg,.jpeg,.png',
  maxSize = '50MB',
  className = '',
}: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFiles = event.target.files
    if (!selectedFiles || selectedFiles.length === 0) return

    if (selectedFiles.length === 1) {
      const selectedFile = selectedFiles[0]
      if (isImageFile(selectedFile)) {
        try {
          const imageFile = await createImageFile(selectedFile)
          onImagesChange([...images, imageFile])
          onFileChange(null)
        } catch (error) {
          console.error('Error creating image file:', error)
        }
      } else {
        onFileChange(selectedFile)
        onImagesChange([])
      }
    } else {
      const imageFiles = Array.from(selectedFiles).filter(isImageFile)
      if (imageFiles.length > 0) {
        try {
          const newImages = await Promise.all(
            imageFiles.map((file) => createImageFile(file)),
          )
          onImagesChange([...images, ...newImages])
          onFileChange(null)
        } catch (error) {
          console.error('Error creating image files:', error)
        }
      }
    }

    event.target.value = ''
  }

  const handleFileDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)

    const droppedFiles = Array.from(event.dataTransfer.files)
    if (droppedFiles.length === 0) return

    if (droppedFiles.length === 1) {
      const droppedFile = droppedFiles[0]
      if (isImageFile(droppedFile)) {
        try {
          const imageFile = await createImageFile(droppedFile)
          onImagesChange([...images, imageFile])
          onFileChange(null)
        } catch (error) {
          console.error('Error creating image file:', error)
        }
      } else {
        onFileChange(droppedFile)
        onImagesChange([])
      }
    } else {
      const imageFiles = droppedFiles.filter(isImageFile)
      if (imageFiles.length > 0) {
        try {
          const newImages = await Promise.all(
            imageFiles.map((file) => createImageFile(file)),
          )
          onImagesChange([...images, ...newImages])
          onFileChange(null)
        } catch (error) {
          console.error('Error creating image files:', error)
        }
      }
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleRemoveFile = () => {
    onFileChange(null)
  }

  const handleImagesReorder = (reorderedImages: ImageFile[]) => {
    onImagesChange(reorderedImages)
  }

  const handleRemoveImage = (imageId: string) => {
    onImagesChange(images.filter((img) => img.id !== imageId))
  }

  const hasContent = file || images.length > 0

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <span className="hidden sm:inline">Tệp tài liệu</span>
        <span className="sm:hidden">Tệp</span>
        <span className="text-red-500 ml-1">*</span>
      </label>
      <div
        className={`border-2 border-dashed rounded-lg p-4 sm:p-6 lg:p-8 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-blue-500 bg-blue-50 scale-[1.02]'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
        onDrop={handleFileDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          id="file"
          onChange={handleFileChange}
          accept={acceptedTypes}
          multiple
          className="hidden"
        />

        {hasContent ? (
          <div className="space-y-4">
            {file && <FilePreview file={file} onRemove={handleRemoveFile} />}
            {images.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-blue-900">
                        {images.length} ảnh đã chọn
                      </p>
                      <p className="text-sm text-blue-700">
                        Sẽ được chuyển thành PDF khi đóng góp
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onImagesChange([])}
                    className="text-red-500 hover:text-red-600 text-sm font-medium"
                  >
                    Xóa tất cả
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <FileUploadPrompt acceptedTypes={acceptedTypes} maxSize={maxSize} />
        )}
      </div>
    </div>
  )
}

interface FilePreviewProps {
  file: File
  onRemove: () => void
}

function FilePreview({ file, onRemove }: FilePreviewProps) {
  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="flex items-center justify-center">
        <svg
          className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-900 break-words px-2">
        {file.name}
      </p>
      <p className="text-xs sm:text-sm text-gray-500">
        {(file.size / 1024 / 1024).toFixed(2)} MB
      </p>
      <button
        type="button"
        onClick={onRemove}
        className="text-red-500 hover:text-red-700 text-xs sm:text-sm font-medium transition-colors duration-200 hover:bg-red-50 px-3 py-1 rounded-lg"
      >
        <span className="hidden sm:inline">Xóa tệp</span>
        <span className="sm:hidden">Xóa</span>
      </button>
    </div>
  )
}

interface FileUploadPromptProps {
  acceptedTypes: string
  maxSize: string
}

function FileUploadPrompt({ acceptedTypes, maxSize }: FileUploadPromptProps) {
  const formatAcceptedTypes = (types: string) => {
    return types.replace(/\./g, '').toUpperCase().replace(/,/g, ', ')
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-center">
        <svg
          className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      </div>
      <div className="px-2">
        <label htmlFor="file" className="cursor-pointer">
          <span className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base transition-colors duration-200">
            <span className="hidden sm:inline">Nhấp để chọn tệp</span>
            <span className="sm:hidden">Chọn tệp</span>
          </span>
          <span className="text-gray-500 text-sm sm:text-base">
            <span className="hidden sm:inline"> hoặc kéo thả tệp vào đây</span>
            <span className="sm:hidden block mt-1">hoặc kéo thả</span>
          </span>
        </label>
        <p className="text-xs text-blue-600 mt-1 font-medium">
          Có thể chọn nhiều ảnh cùng lúc để tạo PDF
        </p>
      </div>
      <div className="space-y-1 px-2">
        <p className="text-xs sm:text-sm text-gray-500">
          <span className="hidden sm:inline">
            Hỗ trợ: {formatAcceptedTypes(acceptedTypes)}
          </span>
          <span className="sm:hidden">Hỗ trợ: PDF, DOC, PPT...</span>
        </p>
        <p className="text-xs text-gray-400">
          <span className="hidden sm:inline">Kích thước tối đa: {maxSize}</span>
          <span className="sm:hidden">Tối đa: {maxSize}</span>
        </p>
      </div>
    </div>
  )
}
