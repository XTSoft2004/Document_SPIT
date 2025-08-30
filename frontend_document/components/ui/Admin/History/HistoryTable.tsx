'use client'

import { useMemo } from 'react'
import { TableColumnType } from 'antd'

import DataGrid from '@/components/ui/Table/DataGrid'
import { getHistory } from '@/actions/history.actions'
import { IHistory } from '@/types/history'
import { renderFunctionStatusTag } from '@/utils/historyFormat'
import { convertIsoToLocaleString } from '@/utils/convertDateTime'

interface HistoryTableProps {
  nameTable: string
  isLogin?: boolean
  isActivity?: boolean
  enableRowSelection?: boolean
}

export default function HistoryTable({
  nameTable,
  isLogin = false,
  isActivity = false,
  enableRowSelection = false,
}: HistoryTableProps) {
  const columns = useMemo<TableColumnType<IHistory>[]>(
    () => [
      {
        title: 'Tiêu đề',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: 'Mô tả',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
      },
      {
        title: 'Trạng thái chức năng',
        dataIndex: 'functionStatus',
        key: 'functionStatus',
        render: renderFunctionStatusTag,
      },
      {
        title: 'Người dùng',
        dataIndex: 'fullname',
        key: 'fullname',
      },
      {
        title: 'Thời gian',
        dataIndex: 'modifiedDate',
        key: 'modifiedDate',
        // render: (value: string) => new Date(value).toLocaleDateString(),
        render: (value: string) => {
          return convertIsoToLocaleString(value);
        }
      },
    ],
    [],
  )

  return (
    <div className="flex flex-col md:flex-row w-full">
      <div className="flex-1 min-w-0">
        <DataGrid<IHistory>
          nameTable={nameTable}
          columns={columns}
          rowKey="id"
          singleSelect={enableRowSelection}
          fetcher={async (search: string, page: number, limit: number) => {
            const res = await getHistory(search, page, limit, isLogin, isActivity)
            return res
          }}
        />
      </div>
    </div>
  )
}
