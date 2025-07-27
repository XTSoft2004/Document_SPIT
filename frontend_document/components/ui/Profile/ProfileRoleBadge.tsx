'use client'

import React from 'react'
import { Label } from '@/components/ui/shadcn-ui/label'
import { Badge } from '@/components/ui/shadcn-ui/badge'
import { Shield, Crown, Users, Star } from 'lucide-react'

interface ProfileRoleBadgeProps {
  roleName: string
}

export default function ProfileRoleBadge({ roleName }: ProfileRoleBadgeProps) {
  const getRoleConfig = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return {
          color: 'bg-gradient-to-r from-red-500 to-pink-600 text-white border-red-300 shadow-lg shadow-red-200',
          icon: Crown,
          glow: 'shadow-red-400/30'
        }
      case 'moderator':
        return {
          color: 'bg-gradient-to-r from-orange-500 to-amber-600 text-white border-orange-300 shadow-lg shadow-orange-200',
          icon: Shield,
          glow: 'shadow-orange-400/30'
        }
      case 'contributor':
        return {
          color: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-blue-300 shadow-lg shadow-blue-200',
          icon: Star,
          glow: 'shadow-blue-400/30'
        }
      default:
        return {
          color: 'bg-gradient-to-r from-gray-500 to-slate-600 text-white border-gray-300 shadow-lg shadow-gray-200',
          icon: Users,
          glow: 'shadow-gray-400/30'
        }
    }
  }

  const roleConfig = getRoleConfig(roleName)
  const IconComponent = roleConfig.icon

  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">
        <div className="p-2 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
          <Shield className="w-4 h-4 text-purple-600" />
        </div>
        Vai trò
      </Label>
      
      <div className="group">
        <Badge
          variant="outline"
          className={`
            px-8 py-4 text-lg font-bold rounded-2xl border-2 transition-all duration-300 
            hover:scale-105 hover:${roleConfig.glow} cursor-default
            ${roleConfig.color}
          `}
        >
          <IconComponent className="w-5 h-5 mr-3" />
          {roleName}
        </Badge>
      </div>
    </div>
  )
}
