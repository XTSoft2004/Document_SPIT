// components/ui/Document/DocumentPageClient.tsx (Client Component)
'use client'

import { useRequestSWR } from '@/lib/hooks/useRequestSWR'
import { getTree } from '@/actions/driver.actions'
import { convertToTreeData } from '@/utils/convertToTreeData'
import getContent from '@/utils/getContent'
import { IIndexResponse } from '@/types/global'
import { IDriveResponse } from '@/types/driver'
import DocumentPageClient from '@/components/ui/Document/DocumentPageClient'
import { useEffect } from 'react'

interface Props {
    slug: string[]
}

export default function DocumentPage({ slug }: Props) {
    const { data, isLoading, error } = useRequestSWR<IIndexResponse<IDriveResponse>>(
        'driver.tree',
        getTree // getTree đã là async nên không cần wrap thêm
    )

    if (isLoading) return <div>Loading...</div>
    if (error || !data) return <div>Error loading data</div>

    const content = getContent(data.data, slug)
    const treeData = convertToTreeData(data.data)

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <DocumentPageClient
                data={data.data}
                content={content.items}
                slug={slug}
                path={content.path}
                treeData={treeData}
            />
        </div>
    )
}
