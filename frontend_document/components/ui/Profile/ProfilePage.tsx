'use client'

import React, { useEffect, useState } from 'react'
import { IInfoUserResponse } from '@/types/auth'
import { IStatisticalUser } from '@/types/statistical'
import { IUserResponse, IUserUpdate } from '@/types/user'
import { getMe, updateUser } from '@/actions/user.action'
import ProfileHeader from './ProfileHeader'
import ProfileStats from './ProfileStats'
import ProfileTabs from './ProfileTabs'
import EditProfileModal from './EditProfileModal'
import NotificationService from '@/components/ui/Notification/NotificationService'

interface ProfilePageProps {
  userInfo: IInfoUserResponse
  userStats: IStatisticalUser
  username: string
}

export default function ProfilePage({ userInfo, userStats, username }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentUserInfo, setCurrentUserInfo] = useState(userInfo)
  const [me, setMe] = useState<IUserResponse | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getMe();
        if (response.ok) {
          setMe(response.data)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }

    fetchUser()
  }, [])

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
  }

  const handleEditProfile = () => {
    setIsEditModalOpen(true)
  }

  const handleSaveProfile = async (updateData: Partial<IUserUpdate>) => {
    if (!me?.id) {
      NotificationService.error({
        message: 'Lỗi',
        description: 'Không thể xác định người dùng'
      })
      return
    }

    try {
      const response = await updateUser(me.id.toString(), updateData as IUserUpdate)

      if (response.ok) {
        if (updateData.fullname) {
          setCurrentUserInfo(prev => ({
            ...prev,
            fullname: updateData.fullname!
          }))
        }

        NotificationService.success({
          message: 'Thành công',
          description: updateData.fullname ? 'Cập nhật họ tên thành công' : 'Cập nhật mật khẩu thành công'
        })

        window.location.reload()
      } else {
        NotificationService.error({
          message: 'Lỗi',
          description: response.message || 'Có lỗi xảy ra khi cập nhật thông tin'
        })
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      NotificationService.error({
        message: 'Lỗi',
        description: 'Có lỗi xảy ra khi cập nhật thông tin'
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <ProfileHeader
        userInfo={currentUserInfo}
        onEditClick={handleEditProfile}
        isOwnProfile={me?.username === username}
      />

      {/* Stats Section */}
      <ProfileStats stats={userStats} />

      {/* Main Content */}
      <ProfileTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userInfo={currentUserInfo}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        username={username}
        isOwnProfile={me?.username === username}
      />

      {/* Edit Profile Modal */}
      {me?.username === username && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          userInfo={currentUserInfo}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  )
}
