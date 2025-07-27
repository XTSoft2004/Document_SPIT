'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ICourseResponse } from '@/types/course'
import { getMe } from '@/actions/user.action'
import CourseSelector from './CourseSelector'
import FileUploader from './FileUploader'
import FormActions from './FormActions'
import ImagePreviewModal from './ImagePreviewModal'
import { convertImagesToPDF, ImageFile } from '@/utils/pdfUtils'
import {
  ContributeFormData,
  createEmptyFormData,
  validateForm,
  validateFormWithImages,
  uploadDocument,
} from './contributeUtils'
import NotificationService from '../Notification/NotificationService'
import { Button } from '../shadcn-ui/button'

export default function ContributeForm() {
  const [formData, setFormData] = useState<ContributeFormData>(
    createEmptyFormData(),
  )
  const [images, setImages] = useState<ImageFile[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userResponse = await getMe()
        setUserLoggedIn(userResponse.ok && !!userResponse.data)
      } catch (error) {
        setUserLoggedIn(false)
      }
    }
    checkAuth()
  }, [])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, name: e.target.value }))
  }

  const handleCourseSelect = (course: ICourseResponse) => {
    setFormData((prev) => ({
      ...prev,
      subject: course.name,
      courseId: course.id,
    }))
  }

  const handleFileChange = (file: File | null) => {
    setFormData((prev) => ({ ...prev, file }))
  }

  const handleImagesChange = (newImages: ImageFile[]) => {
    setImages(newImages)

    if (newImages.length === 1) {
      // Single image - set as file
      setFormData((prev) => ({ ...prev, file: newImages[0].file }))
    } else if (newImages.length > 1) {
      // Multiple images - will be converted to PDF later
      setFormData((prev) => ({ ...prev, file: null }))
      setShowPreviewModal(true)
    } else {
      // No images
      setFormData((prev) => ({ ...prev, file: null }))
    }
  }

  const handlePreviewSave = (reorderedImages: ImageFile[]) => {
    setImages(reorderedImages)
  }

  const handleCancel = () => {
    setFormData(createEmptyFormData())
    setImages([])
    setShowPreviewModal(false)
  }

  const handleSubmit = async () => {
    if (!userLoggedIn) {
      NotificationService.warning({
        message: 'Vui lòng đăng nhập để đóng góp tài liệu',
        description: 'Bạn cần đăng nhập để có thể chia sẻ tài liệu.',
      })
      return
    }

    setIsSubmitting(true)

    try {
      let fileToUpload = formData.file

      // Handle multiple images
      if (images.length > 1 && !formData.file) {
        NotificationService.info({
          message: 'Đang chuyển đổi ảnh thành PDF...',
          description: 'Vui lòng đợi trong giây lát.',
        })

        fileToUpload = await convertImagesToPDF(images, formData.name)
      }
      // Handle single image when no file is set
      else if (images.length === 1 && !formData.file) {
        fileToUpload = images[0].file
      }

      if (!fileToUpload) {
        throw new Error('Vui lòng chọn file hoặc ảnh để upload')
      }

      const uploadFormData = {
        ...formData,
        file: fileToUpload,
      }

      await uploadDocument(uploadFormData)

      NotificationService.success({
        message: 'Tài liệu đã được gửi thành công!',
        description:
          'Chúng tôi sẽ xem xét và phê duyệt trong thời gian sớm nhất.',
      })

      setFormData(createEmptyFormData())
      setImages([])
    } catch (error) {
      const errorMessage =
        error instanceof Error && error.message
          ? error.message
          : 'Đã xảy ra lỗi'
      NotificationService.error({
        message: errorMessage,
        description: 'Vui lòng thử lại sau.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = (() => {
    const formValidWithImages = validateFormWithImages(formData, images)
    const hasAuth = userLoggedIn

    return formValidWithImages && hasAuth
  })()

  const LoginRequiredBanner = () => (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 sm:p-6 mb-6">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <svg
            className="w-6 h-6 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-yellow-800 mb-1">
            Yêu cầu đăng nhập
          </h3>
          <p className="text-sm text-yellow-700 mb-3">
            Bạn cần đăng nhập để có thể đóng góp tài liệu cho cộng đồng.
          </p>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Button
              onClick={() => router.push('/auth')}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 text-sm"
            >
              Đăng nhập ngay
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 lg:p-8">
      {/* Form Header with responsive spacing */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          <span className="hidden sm:inline">Chia sẻ tài liệu của bạn</span>
          <span className="sm:hidden">Chia sẻ tài liệu</span>
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          <span className="hidden sm:inline">
            Điền thông tin bên dưới để đóng góp tài liệu cho cộng đồng
          </span>
          <span className="sm:hidden">Điền thông tin để đóng góp tài liệu</span>
        </p>
      </div>

      {/* Login Required Banner */}
      {!userLoggedIn && <LoginRequiredBanner />}

      <form
        className={`space-y-4 sm:space-y-6 ${!userLoggedIn ? 'opacity-60 pointer-events-none' : ''
          }`}
        onSubmit={(e) => e.preventDefault()}
      >
        {/* Document Name Field with responsive styling */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            <span className="hidden sm:inline">Tên tài liệu</span>
            <span className="sm:hidden">Tên tài liệu</span>
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleNameChange}
            placeholder="Tên tài liệu..."
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
            required
          />
        </div>

        {/* Course Selector with responsive wrapper */}
        <div className="w-full">
          <CourseSelector
            value={formData.subject}
            courseId={formData.courseId}
            onCourseSelect={handleCourseSelect}
          />
        </div>

        {/* File Uploader with responsive wrapper */}
        <div className="w-full">
          <FileUploader
            file={formData.file}
            images={images}
            onFileChange={handleFileChange}
            onImagesChange={handleImagesChange}
          />

          {/* Preview Button chỉ hiện khi có nhiều ảnh */}
          {images.length > 1 && (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setShowPreviewModal(true)}
                className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span>Preview & Sắp xếp ảnh ({images.length})</span>
              </button>
            </div>
          )}
        </div>

        {/* Form Actions with responsive wrapper */}
        <div className="w-full">
          <FormActions
            isSubmitting={isSubmitting}
            isFormValid={isFormValid}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            submitText={
              userLoggedIn ? 'Đóng góp tài liệu' : 'Vui lòng đăng nhập'
            }
            isUserLoggedIn={userLoggedIn}
          />
        </div>
      </form>

      {/* Image Preview Modal */}
      <ImagePreviewModal
        isOpen={showPreviewModal}
        images={images}
        documentName={formData.name}
        onClose={() => setShowPreviewModal(false)}
        onSave={handlePreviewSave}
      />
    </div>
  )
}
