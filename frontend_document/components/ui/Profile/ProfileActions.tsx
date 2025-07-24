'use client'

import React from 'react'

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
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={isSaving}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Hủy
        </button>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Đang lưu...' : 'Lưu'}
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={onEdit}
      className="px-4 py-2 text-blue-600 hover:text-blue-700 border border-blue-300 hover:border-blue-400 rounded-md transition-colors duration-200"
    >
      Chỉnh sửa
    </button>
  )
}
