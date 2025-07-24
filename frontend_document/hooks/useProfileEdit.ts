import { useState } from 'react'
import { IInfoUserResponse } from '@/types/auth'
import { IUserUpdate } from '@/types/user'
import { getProfileUser, updateUser } from '@/actions/user.action'
import NotificationService from '@/components/ui/Notification/NotificationService'

interface UseProfileEditProps {
  userInfo: IInfoUserResponse
  onSave?: (data: Partial<IUserUpdate>) => Promise<void>
}

export function useProfileEdit({ userInfo, onSave }: UseProfileEditProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [localUserInfo, setLocalUserInfo] = useState<IInfoUserResponse>(userInfo)
  const [formData, setFormData] = useState({
    fullname: userInfo.fullname,
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.fullname.trim()) {
      newErrors.fullname = 'Họ và tên không được để trống'
    }
    
    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return
    
    setIsSaving(true)
    try {
      const updateData: Partial<IUserUpdate> = {
        fullname: formData.fullname.trim(),
      }
      
      if (formData.password) {
        updateData.password = formData.password
      }

      await onSave?.(updateData)

      const response = await updateUser(
        localUserInfo.userId.toString(),
        updateData as IUserUpdate,
      )

      if (response.ok) {
        const refreshed = await getProfileUser(localUserInfo.username)
        if (refreshed.ok && refreshed.data) {
          setLocalUserInfo(refreshed.data)
          setFormData((prev) => ({
            ...prev,
            fullname: refreshed.data.fullname,
          }))
        }

        NotificationService.success({
          message: 'Thành công',
          description: 'Cập nhật thông tin thành công',
        })
      } else {
        NotificationService.error({
          message: 'Lỗi',
          description: response.message || 'Có lỗi xảy ra khi cập nhật thông tin',
        })
      }

      setIsEditing(false)
    } catch (e) {
      console.error('Save error:', e)
      NotificationService.error({
        message: 'Lỗi',
        description: 'Có lỗi xảy ra khi cập nhật thông tin',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({
      fullname: localUserInfo.fullname,
      password: '',
      confirmPassword: '',
    })
    setErrors({})
  }

  return {
    isEditing,
    isSaving,
    localUserInfo,
    formData,
    errors,
    handleInputChange,
    handleSave,
    handleEdit,
    handleCancel,
  }
}
