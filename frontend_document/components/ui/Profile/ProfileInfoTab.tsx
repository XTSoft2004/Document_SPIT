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
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Thông tin cá nhân</h2>
          {isOwnProfile && (
            <ProfileActions
              isEditing={isEditing}
              isSaving={isSaving}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên đăng nhập
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-500">
                {localUserInfo.username}
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên
              </label>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    value={formData.fullname}
                    onChange={(e) => handleInputChange('fullname', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập họ và tên của bạn"
                  />
                  {errors.fullname && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullname}</p>
                  )}
                </div>
              ) : (
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {localUserInfo.fullname}
                </div>
              )}
            </div>

            {/* Password - Only show when editing */}
            {isEditing && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Để trống nếu không muốn thay đổi"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
              </div>
            )}

            {/* Confirm Password - Only show when editing and password is entered */}
            {isEditing && formData.password && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập lại mật khẩu mới"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-500">
                {localUserInfo.email || 'Chưa cập nhật'}
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vai trò
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-500">
                {localUserInfo.roleName}
              </div>
            </div>

            {/* User ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID người dùng
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-500">
                #{localUserInfo.userId}
              </div>
            </div>
          </div>
        </div>

        {/* Save Changes Button - Only show when editing */}
        {isEditing && (
          <div className="mt-8 flex justify-start">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        )}
      </div>

      {/* Link Social Profiles Section
      <div className="border-t border-gray-200">
        <div className="px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Liên kết mạng xã hội</h3>
          <div className="text-gray-500 text-sm">
            Chưa cấu hình liên kết mạng xã hội.
          </div>
        </div>
      </div> */}
    </div>
  )
}
