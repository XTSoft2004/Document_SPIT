'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/shadcn-ui/button'
import { Input } from '@/components/ui/shadcn-ui/input'
import { Label } from '@/components/ui/shadcn-ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/shadcn-ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/shadcn-ui/card'
import { User, Lock, Save, X } from 'lucide-react'
import { IInfoUserResponse } from '@/types/auth'
import { IUserUpdate } from '@/types/user'

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  userInfo: IInfoUserResponse
  onSave: (data: Partial<IUserUpdate>) => Promise<void>
}

export default function EditProfileModal({ isOpen, onClose, userInfo, onSave }: EditProfileModalProps) {
  const [activeTab, setActiveTab] = useState('fullname')
  const [formData, setFormData] = useState({
    fullname: userInfo.fullname,
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (activeTab === 'fullname') {
      if (!formData.fullname.trim()) {
        newErrors.fullname = 'Họ và tên không được để trống'
      } else if (formData.fullname.trim().length < 2) {
        newErrors.fullname = 'Họ và tên phải có ít nhất 2 ký tự'
      }
    }

    if (activeTab === 'password') {
      if (!formData.password) {
        newErrors.password = 'Mật khẩu không được để trống'
      } else if (formData.password.length < 6) {
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

    setIsLoading(true)
    try {
      const updateData: Partial<IUserUpdate> = {}

      if (activeTab === 'fullname') {
        updateData.fullname = formData.fullname.trim()
      } else if (activeTab === 'password') {
        updateData.password = formData.password
      }

      await onSave(updateData)
      onClose()
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const resetForm = () => {
    setFormData({
      fullname: userInfo.fullname,
      password: '',
      confirmPassword: ''
    })
    setErrors({})
    setActiveTab('fullname')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={handleClose}
      />
      
      {/* Modal */}
      <Card className="relative w-full max-w-[500px] mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Chỉnh sửa thông tin cá nhân
          </CardTitle>
          <CardDescription>
            Cập nhật thông tin của bạn. Chọn tab để chỉnh sửa từng mục.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="fullname" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Họ và tên
              </TabsTrigger>
              <TabsTrigger value="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Mật khẩu
              </TabsTrigger>
            </TabsList>

            <TabsContent value="fullname" className="space-y-4 mt-6">
              <div>
                <Label htmlFor="fullname">Họ và tên</Label>
                <Input
                  id="fullname"
                  value={formData.fullname}
                  onChange={(e) => handleInputChange('fullname', e.target.value)}
                  placeholder="Nhập họ và tên"
                  className={`mt-1 ${errors.fullname ? 'border-red-500' : ''}`}
                />
                {errors.fullname && (
                  <p className="text-sm text-red-500 mt-1">{errors.fullname}</p>
                )}
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <Label className="text-sm text-gray-600">Tên đăng nhập</Label>
                <Input
                  value={userInfo.username}
                  disabled
                  className="mt-1 bg-white"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tên đăng nhập không thể thay đổi
                </p>
              </div>
            </TabsContent>

            <TabsContent value="password" className="space-y-4 mt-6">
              <div>
                <Label htmlFor="password">Mật khẩu mới</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Nhập mật khẩu mới"
                  className={`mt-1 ${errors.password ? 'border-red-500' : ''}`}
                />
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  className={`mt-1 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              <X className="w-4 h-4 mr-2" />
              Hủy
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
