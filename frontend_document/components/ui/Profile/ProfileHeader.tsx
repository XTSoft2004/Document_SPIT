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

interface ProfileHeaderProps {
  userInfo: IInfoUserResponse
  onEditClick?: () => void
}

export default function ProfileHeader({
  userInfo,
  onEditClick,
}: ProfileHeaderProps) {
  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }
  return (
    <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 pt-20 pb-32">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative container mx-auto px-4">
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
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h1 className="text-4xl font-bold text-white">
                {userInfo.fullname}
              </h1>
              <Badge
                variant="secondary"
                className={`w-fit bg-white/20 text-white border-white/30 ${getRoleBadgeColor(userInfo.roleName)}`}
              >
                {userInfo.roleName}
              </Badge>
            </div>

            <div className="flex flex-col md:flex-row gap-4 text-white/90">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <User className="w-4 h-4" />
                <span>@{userInfo.username}</span>
              </div>
              {userInfo.email && (
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Mail className="w-4 h-4" />
                  <span>{userInfo.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
