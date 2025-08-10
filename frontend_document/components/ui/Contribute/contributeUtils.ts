import { createDocument } from '@/actions/document.actions'

export interface ContributeFormData {
  name: string
  file: File | null
  subject: string
  courseId: number
}

export const createEmptyFormData = (): ContributeFormData => ({
  name: '',
  file: null,
  subject: '',
  courseId: 0,
})

export const validateForm = (formData: ContributeFormData): boolean => {
  return !!(
    formData.name.trim() &&
    formData.file &&
    formData.subject &&
    formData.courseId > 0
  )
}

export const validateFormWithImages = (formData: ContributeFormData, images: any[]): boolean => {
  const hasFile = formData.file || images.length > 0
  return !!(
    formData.name.trim() &&
    hasFile &&
    formData.subject &&
    formData.courseId > 0
  )
}

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const base64String = reader.result as string
      resolve(base64String)
    }
    reader.onerror = (error) => reject(error)
  })
}

export const uploadDocument = async (
  formData: ContributeFormData,
): Promise<void> => {
  if (!formData.file) {
    throw new Error('Vui lòng chọn file')
  }

  // Kiểm tra giới hạn dung lượng file (5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (formData.file.size > maxSize) {
    throw new Error('File vượt quá giới hạn 5MB. Vui lòng chọn file nhỏ hơn 5MB.')
  }

  const base64String = await fileToBase64(formData.file)

  // Kiểm tra lại kích thước base64 (phòng trường hợp encode tăng size)
  const base64Size = (base64String.length * 3) / 4 - (base64String.endsWith('==') ? 2 : base64String.endsWith('=') ? 1 : 0)
  if (base64Size > maxSize) {
    throw new Error('File vượt quá giới hạn 5MB. Vui lòng chọn file nhỏ hơn 5MB.')
  }

  const pendingFolderId = process.env.NEXT_PUBLIC_FOLDER_ID_PENDING
  if (!pendingFolderId) {
    throw new Error('Không tìm thấy folder pending')
  }

  const uploadResponse = await createDocument({
    name: formData.name,
    fileName: formData.file.name,
    base64String,
    courseId: formData.courseId,
  })

  if (!uploadResponse.ok) {
    throw new Error(uploadResponse.message)
  }
}
