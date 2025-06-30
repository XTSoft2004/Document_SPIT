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
    formData.courseId
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

  const base64String = await fileToBase64(formData.file)

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

  console.log('Upload response:', uploadResponse)

  if (!uploadResponse.ok) {
    throw new Error(uploadResponse.message)
  }
}
