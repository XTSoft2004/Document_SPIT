import React from 'react'
import { Tag } from 'antd'

type FunctionStatus =
  | 'Login'
  | 'Logout'
  | `Create_${string}`
  | `Update_${string}`
  | `Delete_${string}`
  | 'Review_Document'
  | 'Set_Role'
  | 'Ban_User'
  | 'Update_Status_Star'

const actionMap: Record<string, string> = {
  Login: 'Đăng nhập',
  Logout: 'Đăng xuất',
  Create: 'Tạo',
  Update: 'Cập nhật',
  Delete: 'Xóa',
  Review: 'Duyệt',
  Set: 'Thiết lập',
  Ban: 'Cấm',
  UpdateStatus: 'Cập nhật trạng thái',
}

const targetMap: Record<string, string> = {
  Document: 'tài liệu',
  Role: 'vai trò',
  User: 'người dùng',
  Status: 'trạng thái',
  Star: 'đánh giá',
  CategoryType: 'loại danh mục',
}

export function formatFunctionStatusText(status: string): string {
  const parts = status.split('_')
  const action = parts[0]
  const rawTarget = parts.slice(1).join('_')

  const readableAction = actionMap[action] || action

  const readableTarget =
    targetMap[rawTarget] ||
    rawTarget
      .split('_')
      .map((p) => targetMap[p] || p.toLowerCase())
      .join(' ')
  return `${readableAction} ${readableTarget}`.trim()
}

export function renderFunctionStatusTag(status: FunctionStatus): React.ReactElement {
  const action = status.split('_')[0]

  const colorMap: Record<string, string> = {
    Login: 'blue',
    Logout: 'geekblue',
    Create: 'green',
    Update: 'gold',
    Delete: 'red',
    Review: 'purple',
    Set: 'cyan',
    Ban: 'volcano',
  }

  const tagColor = colorMap[action] || 'default'
  const text = formatFunctionStatusText(status)

  return <Tag color={tagColor}>{text}</Tag>
}
