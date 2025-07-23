'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { notFound } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import NotificationService from '@/components/ui/Notification/NotificationService'
import ProfileHeader from '@/components/ui/Profile/ProfileHeader'
import ProfileStats from '@/components/ui/Profile/ProfileStats'
import ProfileTabs from '@/components/ui/Profile/ProfileTabs'
import { Document as DocumentType } from '@/components/ui/Profile/DocumentList'
import { IStatisticalUser } from '@/types/statistical'
import { getStatisticalUser } from '@/actions/statistical.actions'

export default function PublicProfilePage() {
  const params = useParams()
  const { getInfo } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState<IStatisticalUser>({
    totalDocuments: 0,
    totalViews: 0,
    totalDownloads: 0,
    totalStars: 0,
  })
  const [documents, setDocuments] = useState<DocumentType[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [profileUser, setProfileUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    avatarUrl: '',
  })

  const username = params.username as string
  const currentUser = getInfo()
  const isOwnProfile = !!(currentUser && currentUser.username === username)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true)

        const response = await getStatisticalUser(username)
        if (response) {
            setStats(response.data)
        }
        } else {
          notFound()
        }
      } catch (err) {
        console.error('Error fetching profile:', err)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    if (username) {
      fetchUserProfile()
    }
  }, [username, isOwnProfile])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = () => {
    if (!isOwnProfile) return

    const updatedInfo = {
      ...currentUser,
      ...formData,
    }

    localStorage.setItem('user', JSON.stringify(updatedInfo))
    setIsEditing(false)

    NotificationService.success({
      message: 'Cập nhật thành công',
      description: 'Thông tin profile đã được cập nhật',
    })
  }

  const handleCancel = () => {
    if (profileUser) {
      setFormData({
        fullname: profileUser.fullname,
        email: profileUser.email || '',
        avatarUrl: profileUser.avatarUrl || '',
      })
    }
    setIsEditing(false)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <ProfileHeader
        userInfo={profileUser}
        formData={formData}
        isEditing={isEditing && isOwnProfile}
        onEditClick={() => isOwnProfile && setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
        isOwnProfile={isOwnProfile}
      />

      {/* Stats Section */}
      <ProfileStats stats={stats} />

      {/* Main Content */}
      <ProfileTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userInfo={profileUser}
        formData={formData}
        isEditing={isEditing && isOwnProfile}
        onInputChange={handleInputChange}
        documents={documents}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        isOwnProfile={isOwnProfile}
      />
    </div>
  )
}
