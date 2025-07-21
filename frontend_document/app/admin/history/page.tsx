'use client'

import HistoryTable from '@/components/ui/Admin/History/HistoryTable'

export default function AllHistoryPage() {
  return (
    <HistoryTable
      nameTable="history-all"
      enableRowSelection={true}
    />
  )
}
