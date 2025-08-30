'use client'

import React from 'react'
import { Label } from '@/components/ui/shadcn-ui/label'
import { Input } from '@/components/ui/shadcn-ui/input'
import { LucideIcon } from 'lucide-react'

interface ProfileFieldProps {
  icon: LucideIcon
  label: string
  value: string
  isEditing?: boolean
  type?: 'text' | 'password' | 'email'
  disabled?: boolean
  error?: string
  onChange?: (value: string) => void
  className?: string
}

export default function ProfileField({
  icon: Icon,
  label,
  value,
  isEditing = false,
  type = 'text',
  disabled = false,
  error,
  onChange,
  className = ''
}: ProfileFieldProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <Label className="flex items-center gap-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">
        <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <Icon className="w-4 h-4 text-blue-600" />
        </div>
        {label}
      </Label>
      
      {isEditing && !disabled ? (
        <div className="space-y-2">
          <Input
            type={type}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={disabled}
            className="text-lg font-medium border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 rounded-xl px-4 py-3 bg-white/80 backdrop-blur-sm"
          />
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
              <div className="w-1 h-1 bg-red-500 rounded-full" />
              {error}
            </div>
          )}
        </div>
      ) : (
        <div className={disabled ? 'opacity-75' : ''}>
          {disabled ? (
            <Input 
              value={value} 
              disabled 
              className="text-lg font-medium bg-gray-50 border-gray-200 rounded-xl px-4 py-3"
            />
          ) : (
            <div className="group p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300">
              <p className="text-2xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-200">
                {value}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
