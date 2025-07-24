'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/shadcn-ui/card'
import { Input } from '@/components/ui/shadcn-ui/input'
import { Badge } from '@/components/ui/shadcn-ui/badge'
import { Search, FileText, Calendar, Eye, Download, Star, File } from 'lucide-react'
import { getDocumentUser } from '@/actions/document.actions'
import { IDocumentUser } from '@/types/document'

interface DocumentsTabProps {
  username: string
  searchTerm: string
  onSearchChange: (value: string) => void
}

export default function DocumentsTab({
  username,
  searchTerm,
  onSearchChange
}: DocumentsTabProps) {
  const [documents, setDocuments] = useState<IDocumentUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true)
        const response = await getDocumentUser(username)
        
        if (response.ok && response.data) {
          setDocuments(response.data)
        } else {
          setError('Không thể tải danh sách tài liệu')
        }
      } catch (err) {
        setError('Có lỗi xảy ra khi tải tài liệu')
        console.error('Error fetching documents:', err)
      } finally {
        setLoading(false)
      }
    }

    if (username) {
      fetchDocuments()
    }
  }, [username])

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'đã duyệt':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'đang chờ duyệt':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'không duyệt':
        return 'bg-red-100 text-red-700 border-red-200'
    }
  }

  const getFileIcon = (fileType: string) => {
    const type = fileType.toLowerCase()
    if (type.includes('pdf')) return '📄'
    if (type.includes('doc') || type.includes('word')) return '📝'
    if (type.includes('ppt') || type.includes('powerpoint')) return '📊'
    if (type.includes('xls') || type.includes('excel')) return '📈'
    return '📄'
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm tài liệu..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Tài liệu đã đóng góp
            {!loading && (
              <Badge variant="secondary" className="ml-2">
                {filteredDocuments.length}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Danh sách tài liệu được đóng góp bởi @{username}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải tài liệu...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-red-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-600 mb-2">
                Lỗi tải tài liệu
              </h3>
              <p className="text-red-500">{error}</p>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {documents.length === 0 ? 'Chưa có tài liệu' : 'Không tìm thấy tài liệu'}
              </h3>
              <p className="text-gray-500">
                {documents.length === 0 
                  ? 'Người dùng này chưa đóng góp tài liệu nào.'
                  : 'Thử thay đổi từ khóa tìm kiếm.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDocuments.map((document) => (
                <div
                  key={document.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-gradient-to-r from-white to-gray-50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{getFileIcon(document.typeFile)}</span>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 hover:text-blue-600 transition-colors">
                            {document.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {`${document.name}.${document.typeFile}`}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <File className="w-4 h-4" />
                          {document.courseName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(document.createdDate).toLocaleDateString('vi-VN')}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-green-600">
                          <Eye className="w-4 h-4" />
                          {document.totalViews.toLocaleString()} lượt xem
                        </span>
                        <span className="flex items-center gap-1 text-blue-600">
                          <Download className="w-4 h-4" />
                          {document.totalDownloads.toLocaleString()} tải xuống
                        </span>
                        <span className="flex items-center gap-1 text-red-600">
                          <Star className="w-4 h-4" />
                          {document.totalStars} yêu thích
                        </span>
                      </div>
                    </div>

                    <div className="ml-4">
                      <Badge 
                        variant="outline" 
                        className={`${getStatusBadgeColor(document.statusDocument)} font-medium`}
                      >
                        {document.statusDocument}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
