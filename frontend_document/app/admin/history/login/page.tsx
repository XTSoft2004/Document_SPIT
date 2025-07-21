'use client'

import HistoryTable from '@/components/ui/Admin/History/HistoryTable'

export default function LoginHistoryPage() {
  return (
    <HistoryTable
      nameTable="history-login"
      isLogin={true}
    />
  )
}
