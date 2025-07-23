'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/shadcn-ui/card';
import { Button } from '@/components/ui/shadcn-ui/button';
import { Badge } from '@/components/ui/shadcn-ui/badge';
import {
    FileText,
    Upload,
    Calendar,
    Download,
    Eye,
    Heart,
    MoreVertical
} from 'lucide-react';

export interface Document {
    id: number;
    title: string;
    description: string;
    fileName: string;
    fileType: string;
    uploadDate: string;
    views: number;
    downloads: number;
    likes: number;
    status: 'published' | 'pending' | 'rejected';
    category: string;
    course: string;
}

interface DocumentListProps {
    documents: Document[];
    searchTerm: string;
}

export default function DocumentList({ documents, searchTerm }: DocumentListProps) {
    const filteredDocuments = documents.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published': return 'bg-green-100 text-green-800 border-green-200';
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'published': return 'Đã duyệt';
            case 'pending': return 'Chờ duyệt';
            case 'rejected': return 'Bị từ chối';
            default: return 'Không xác định';
        }
    };

    if (filteredDocuments.length === 0) {
        return (
            <Card>
                <CardContent className="p-12 text-center">
                    <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {searchTerm ? 'Không tìm thấy tài liệu' : 'Chưa có tài liệu nào'}
                    </h3>
                    <p className="text-gray-500 mb-6">
                        {searchTerm ? 'Thử thay đổi từ khóa tìm kiếm' : 'Hãy tải lên tài liệu đầu tiên của bạn'}
                    </p>
                    {!searchTerm && (
                        <Button>
                            <Upload className="w-4 h-4 mr-2" />
                            Tải lên tài liệu
                        </Button>
                    )}
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <div className="grid gap-6">
                {filteredDocuments.map((doc) => (
                    <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4 flex-1">
                                    <div className="flex-shrink-0">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                {doc.title}
                                            </h3>
                                            <Badge className={getStatusColor(doc.status)}>
                                                {getStatusText(doc.status)}
                                            </Badge>
                                        </div>

                                        <p className="text-gray-600 text-sm mb-3">
                                            {doc.description}
                                        </p>

                                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(doc.uploadDate).toLocaleDateString('vi-VN')}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <FileText className="w-4 h-4" />
                                                {doc.fileType}
                                            </div>
                                            <span>•</span>
                                            <span>{doc.course}</span>
                                        </div>

                                        <div className="flex items-center gap-6 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Eye className="w-4 h-4" />
                                                {doc.views} lượt xem
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Download className="w-4 h-4" />
                                                {doc.downloads} tải xuống
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Heart className="w-4 h-4" />
                                                {doc.likes} yêu thích
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Button variant="ghost" size="sm">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Summary */}
            <Card>
                <CardContent className="p-4">
                    <div className="text-center text-sm text-gray-500">
                        Hiển thị {filteredDocuments.length} / {documents.length} tài liệu
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
