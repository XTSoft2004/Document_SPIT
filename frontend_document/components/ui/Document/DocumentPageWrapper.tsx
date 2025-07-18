'use client'

import { useEffect, useState } from 'react'
import getContent from '@/utils/getContent'
import { convertToTreeData } from '@/utils/convertToTreeData'
import DocumentPageClient from './DocumentPageClient'
import { getTree } from '@/actions/driver.actions'
import { IIndexResponse } from '@/types/global'
import { IDriveResponse } from '@/types/driver'
import useSWR from 'swr'

interface DocumentPageWrapperProps {
    slug: string[]
}

export default function DocumentPageWrapper({ slug }: DocumentPageWrapperProps) {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    const { data, error, isLoading } = useSWR<IIndexResponse<IDriveResponse>>(
        'document-tree',
        () => getTree(),
        {
            refreshInterval: 5000, // Default: refresh every 5 seconds
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            dedupingInterval: 2000,
            errorRetryCount: 3,
            errorRetryInterval: 1000,
        },
    )

    if (!isClient) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
                    <div className="text-red-600 mb-2">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Lỗi tải dữ liệu</h3>
                    <p className="text-red-600">Không thể tải dữ liệu tài liệu. Vui lòng thử lại.</p>
                </div>
            </div>
        )
    }

    if (isLoading || !data?.data) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải dữ liệu...</p>
                </div>
            </div>
        )
    }

    try {
        const content = getContent(data.data, slug)
        const treeData = convertToTreeData(data.data)

        return (
            <div className="relative h-full">
                <DocumentPageClient
                    data={data.data}
                    content={content.items}
                    slug={slug}
                    path={content.path}
                    treeData={treeData}
                />
            </div>
        )
    } catch (error) {
        console.error('Error processing document data:', error)
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="text-yellow-600 mb-2">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">Lỗi xử lý dữ liệu</h3>
                    <p className="text-yellow-600">Không thể xử lý dữ liệu tài liệu. Đường dẫn có thể không hợp lệ.</p>
                </div>
            </div>
        )
    }
}