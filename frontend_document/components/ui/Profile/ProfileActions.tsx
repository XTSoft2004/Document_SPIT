'use client'

import React from 'react'
import { Button } from '@/components/ui/shadcn-ui/button'
import { Edit3, Save, X } from 'lucide-react'

interface ProfileActionsProps {
  isEditing: boolean
  isSaving: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
}

export default function ProfileActions({
  isEditing,
  isSaving,
  onEdit,
  onSave,
  onCancel
}: ProfileActionsProps) {
  if (isEditing) {
    return (
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
          className="px-6 py-3 text-base font-medium border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 rounded-xl"
        >
          <X className="w-5 h-5 mr-2" />
          Hủy bỏ
        </Button>
        <Button 
          onClick={onSave} 
          disabled={isSaving}
          className="px-8 py-3 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <div className="w-5 h-5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Lưu thay đổi
            </>
          )}
        </Button>
      </div>
    )
  }

  return (
    <Button 
      variant="outline" 
      onClick={onEdit}
      className="px-6 py-3 text-base font-semibold border-2 border-blue-200 text-blue-700 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md"
    >
      <Edit3 className="w-5 h-5 mr-2" />
      Chỉnh sửa thông tin
    </Button>
  )
}
