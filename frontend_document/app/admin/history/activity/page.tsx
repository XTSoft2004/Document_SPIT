'use client'

import HistoryTable from '@/components/ui/Admin/History/HistoryTable'

export default function ActivityHistoryPage() {
  return (
    <HistoryTable
      nameTable="history-activity"
      isActivity={true}
    />
  )
}
