'use client'

import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/shadcn-ui/card'
import { User, Mail, AtSign, Lock } from 'lucide-react'
import { IInfoUserResponse } from '@/types/auth'
import { IUserUpdate } from '@/types/user'
import { useProfileEdit } from '@/hooks/useProfileEdit'
import ProfileField from './ProfileField'
import ProfileActions from './ProfileActions'
import ProfileRoleBadge from './ProfileRoleBadge'

interface ProfileInfoTabProps {
  userInfo: IInfoUserResponse
  isOwnProfile?: boolean
  onSave?: (data: Partial<IUserUpdate>) => Promise<void>
}

export default function ProfileInfoTab({
  userInfo,
  isOwnProfile = false,
  onSave,
}: ProfileInfoTabProps) {
  const {
    isEditing,
    isSaving,
    localUserInfo,
    formData,
    errors,
    handleInputChange,
    handleSave,
    handleEdit,
    handleCancel,
  } = useProfileEdit({ userInfo, onSave })

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <Card className="relative overflow-hidden shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-60" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-100/30 to-transparent rounded-full -translate-y-48 translate-x-48" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-100/30 to-transparent rounded-full translate-y-32 -translate-x-32" />
        
        <CardHeader className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white pb-10 pt-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md border border-white/30">
                <User className="w-10 h-10" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-3xl font-bold mb-2 tracking-tight">
                Thông tin cá nhân
              </CardTitle>
              <CardDescription className="text-blue-100 text-lg font-medium">
                Quản lý và cập nhật thông tin tài khoản của bạn
              </CardDescription>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-20 h-20 border border-white/20 rounded-full" />
          <div className="absolute top-8 right-8 w-12 h-12 border border-white/30 rounded-full" />
        </CardHeader>

        <CardContent className="relative p-10">
          <div className="space-y-8 max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
                <h3 className="text-2xl font-bold text-gray-800">
                  Thông tin cơ bản
                </h3>
              </div>
              {isOwnProfile && !isEditing && (
                <div className="relative">
                  <ProfileActions
                    isEditing={isEditing}
                    isSaving={isSaving}
                    onEdit={handleEdit}
                    onSave={handleSave}
                    onCancel={handleCancel}
                  />
                </div>
              )}
            </div>

            <div className="grid gap-8">
              {/* Fullname */}
              <div className="group">
                <ProfileField
                  icon={User}
                  label="Họ và tên"
                  value={formData.fullname}
                  isEditing={isEditing}
                  error={errors.fullname}
                  onChange={(value) => handleInputChange('fullname', value)}
                  className="transition-all duration-300 hover:transform hover:scale-[1.02]"
                />
              </div>

              {/* Username */}
              <div className="group">
                <ProfileField
                  icon={AtSign}
                  label="Tên đăng nhập"
                  value={localUserInfo.username}
                  disabled={true}
                  className="transition-all duration-300 hover:transform hover:scale-[1.02]"
                />
              </div>

              {/* Email */}
              {localUserInfo.email && (
                <div className="group">
                  <ProfileField
                    icon={Mail}
                    label="Email"
                    value={localUserInfo.email}
                    disabled={true}
                    className="transition-all duration-300 hover:transform hover:scale-[1.02]"
                  />
                </div>
              )}

              {/* Password fields - only show when editing */}
              {isEditing && (
                <div className="space-y-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Lock className="w-5 h-5 text-blue-600" />
                    <h4 className="text-lg font-semibold text-blue-900">Đổi mật khẩu</h4>
                  </div>
                  
                  <ProfileField
                    icon={Lock}
                    label="Mật khẩu mới"
                    value={formData.password}
                    type="password"
                    isEditing={true}
                    error={errors.password}
                    onChange={(value) => handleInputChange('password', value)}
                  />

                  <ProfileField
                    icon={Lock}
                    label="Xác nhận mật khẩu"
                    value={formData.confirmPassword}
                    type="password"
                    isEditing={true}
                    error={errors.confirmPassword}
                    onChange={(value) => handleInputChange('confirmPassword', value)}
                  />
                </div>
              )}

              {/* Role */}
              <div className="group">
                <div className="transition-all duration-300 hover:transform hover:scale-[1.02]">
                  <ProfileRoleBadge roleName={localUserInfo.roleName} />
                </div>
              </div>
            </div>

            {/* Action buttons when editing */}
            {isEditing && isOwnProfile && (
              <div className="mt-10 pt-8 border-t border-gray-200">
                <ProfileActions
                  isEditing={isEditing}
                  isSaving={isSaving}
                  onEdit={handleEdit}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
