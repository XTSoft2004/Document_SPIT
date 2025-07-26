'use client'

import React from 'react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/shadcn-ui/avatar'
import { Badge } from '@/components/ui/shadcn-ui/badge'
import { Button } from '@/components/ui/shadcn-ui/button'
import { User, Mail, Edit3 } from 'lucide-react'
import { IInfoUserResponse } from '@/types/auth'
import { getProfileUser, uploadAvatar } from '@/actions/user.action'
import NotificationService from '../Notification/NotificationService'
import { IUserUploadAvatar } from '@/types/user'
import { useRouter } from 'next/navigation'
interface ProfileHeaderProps {
  userInfo: IInfoUserResponse
  onEditClick?: () => void
}

export default function ProfileHeader({
  userInfo,
  onEditClick,
}: ProfileHeaderProps) {
  const router = useRouter()

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const base64String = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(new Error('Không thể đọc file'))
    })
    const userUpload: IUserUploadAvatar = {
      imageBase64: base64String,
    }
    const upload = await uploadAvatar(userInfo.username, userUpload)
    if (upload.ok) {
      NotificationService.success({
        message: 'Thành công',
        description: 'Cập nhật ảnh đại diện thành công',
      })
      const userNew = await getProfileUser(userInfo.username)
      const userJson: IInfoUserResponse = {
        userId: userNew.data.userId,
        username: userNew.data.username,
        fullname: userNew.data.fullname,
        roleName: userNew.data.roleName || 'User', // Default role if not provided
        email: userNew.data.email,
        avatarUrl: userNew.data.avatarUrl || '', // Ensure avatarUrl is set
      };
      localStorage.setItem('user', JSON.stringify(userJson));

      // router.prefetch(`/profile/${userInfo.username}`)
      // Reload lại trang hiện tại để lấy dữ liệu mới
      window.location.reload()
    } else {
      NotificationService.error({
        message: 'Thất bại',
        description:
          upload.message || 'Có lỗi xảy ra khi cập nhật ảnh đại diện',
      })
    }
  }

  return (
    <div className="relative bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 pt-20 pb-32 overflow-hidden">
      {/* Multi-layer background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/30"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent"></div>

      {/* Animated Background Text */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* First line - moving right */}
        <div className="absolute top-12 w-full opacity-60">
          <div className="animate-scroll-right whitespace-nowrap text-3xl md:text-5xl font-bold text-white/8 select-none tracking-widest">
            ✨ Chia sẻ tri thức  📚 Cùng nhau học hỏi  🎯 Thành công bền vững  💡 Khám phá mới mẻ  🌟 Kết nối tương lai  ✨ Chia sẻ tri thức  📚 Cùng nhau học hỏi  🎯 Thành công bền vững  💡 Khám phá mới mẻ  🌟 Kết nối tương lai
          </div>
        </div>

        {/* Second line - moving left with blur effect */}
        <div className="absolute top-28 w-full opacity-40">
          <div className="animate-scroll-left whitespace-nowrap text-2xl md:text-4xl font-semibold text-white/6 select-none tracking-wider blur-[0.5px]">
            🚀 Đổi mới sáng tạo  📖 Mở ra tiềm năng  🎓 Ước mơ thành hiện thực  💎 Giá trị lâu dài  ⭐ Tầm nhìn xa rộng  🚀 Đổi mới sáng tạo  📖 Mở ra tiềm năng  🎓 Ước mơ thành hiện thực  💎 Giá trị lâu dài  ⭐ Tầm nhìn xa rộng
          </div>
        </div>

        {/* Third line - moving right with gradient effect */}
        <div className="absolute top-44 w-full opacity-30">
          <div className="animate-scroll-right-slow whitespace-nowrap text-xl md:text-3xl font-medium text-white/4 select-none tracking-wide">
            🔥 Sáng tạo không giới hạn  📝 Khám phá tri thức  🎯 Định hướng rõ ràng  💪 Vượt qua thử thách  🌈 Tương lai rực rỡ  🔥 Sáng tạo không giới hạn  📝 Khám phá tri thức  🎯 Định hướng rõ ràng  💪 Vượt qua thử thách  🌈 Tương lai rực rỡ
          </div>
        </div>

        {/* Fourth line - moving left with smaller text */}
        <div className="absolute bottom-28 w-full opacity-25">
          <div className="animate-scroll-left-slow whitespace-nowrap text-lg md:text-2xl font-light text-white/3 select-none tracking-wider">
            🏆 Thành tựu đáng tự hào  📚 Kiến thức sâu rộng  🎨 Ý tưởng độc đáo  💫 Hoài bão lớn lao  🌟 Tỏa sáng tài năng  🏆 Thành tựu đáng tự hào  📚 Kiến thức sâu rộng  🎨 Ý tưởng độc đáo  💫 Hoài bão lớn lao  🌟 Tỏa sáng tài năng
          </div>
        </div>

        {/* Fifth line - moving right with subtle effect */}
        <div className="absolute bottom-12 w-full opacity-20">
          <div className="animate-scroll-right-fast whitespace-nowrap text-base md:text-xl font-extralight text-white/2 select-none tracking-widest blur-[0.3px]">
            🎯 Học tập hiệu quả  💡 Ý tưởng đột phá  🚀 Phát triển bản thân  📈 Tiến bộ từng ngày  ⚡ Năng lượng tích cực  🎯 Học tập hiệu quả  💡 Ý tưởng đột phá  🚀 Phát triển bản thân  📈 Tiến bộ từng ngày  ⚡ Năng lượng tích cực
          </div>
        </div>

        {/* Decorative floating elements */}
        <div className="absolute inset-0">
          {/* Floating dots */}
          <div className="absolute top-20 left-1/4 w-2 h-2 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-1/3 w-1.5 h-1.5 bg-white/8 rounded-full animate-pulse delay-500"></div>
          <div className="absolute top-48 left-1/2 w-1 h-1 bg-white/6 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-24 left-1/5 w-2.5 h-2.5 bg-white/5 rounded-full animate-pulse delay-700"></div>
          <div className="absolute bottom-36 right-1/4 w-1.5 h-1.5 bg-white/7 rounded-full animate-pulse delay-300"></div>

          {/* Floating lines */}
          <div className="absolute top-16 left-1/6 w-16 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          <div className="absolute top-52 right-1/5 w-24 h-px bg-gradient-to-r from-transparent via-white/4 to-transparent"></div>
          <div className="absolute bottom-20 left-1/3 w-20 h-px bg-gradient-to-r from-transparent via-white/3 to-transparent"></div>
        </div>
      </div>

      <div className="relative container mx-auto px-4 z-10">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Avatar Section */}
          <div className="relative group">
            <Avatar className="w-32 h-32 border-4 border-white/20 shadow-2xl">
              <AvatarImage
                src={userInfo.avatarUrl}
                alt={userInfo.fullname}
                className="object-cover"
              />
              <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {userInfo.fullname.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {/* Upload Avatar Button */}
            <label className="absolute bottom-2 right-2 bg-white/80 rounded-full p-2 cursor-pointer shadow hover:bg-white transition">
              <Edit3 className="w-5 h-5 text-blue-600" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUploadAvatar}
              />
            </label>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                {userInfo.fullname}
              </h1>
              <Badge
                variant="secondary"
                className={`w-fit bg-white/20 text-white border-white/30 backdrop-blur-sm ${getRoleBadgeColor(userInfo.roleName)}`}
              >
                {userInfo.roleName}
              </Badge>
            </div>

            <div className="flex flex-col md:flex-row gap-4 text-white/90">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <User className="w-4 h-4" />
                <span className="drop-shadow">@{userInfo.username}</span>
              </div>
              {userInfo.email && (
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Mail className="w-4 h-4" />
                  <span className="drop-shadow">{userInfo.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
