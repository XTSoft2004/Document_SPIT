'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/shadcn-ui/card';
import { Button } from '@/components/ui/shadcn-ui/button';
import { Badge } from '@/components/ui/shadcn-ui/badge';
import { Input } from '@/components/ui/shadcn-ui/input';
import {
    FileText,
    Download,
    Eye,
    Heart,
    Search,
    Filter,
    Calendar,
    Upload,
    MoreVertical,
    Edit,
    Trash2,
    Share2
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/shadcn-ui/dropdown-menu';

interface Document {
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

interface UserDocumentsProps {
    userId: number;
}

// Mock data - replace with real API calls
const mockDocuments: Document[] = [
    {
        id: 1,
        title: "Bài giảng Toán cao cấp - Chương 1",
        description: "Giới thiệu về giải tích và các khái niệm cơ bản",
        fileName: "toan-cao-cap-chuong-1.pdf",
        fileType: "PDF",
        uploadDate: "2024-01-15",
        views: 150,
        downloads: 45,
        likes: 12,
        status: "published",
        category: "Bài giảng",
        course: "Toán cao cấp A1"
    },
    {
        id: 2,
        title: "Đề thi Vật lý đại cương kỳ 1",
        description: "Đề thi và đáp án chi tiết môn Vật lý đại cương",
        fileName: "de-thi-vat-ly-ky1.pdf",
        fileType: "PDF",
        uploadDate: "2024-01-10",
        views: 98,
        downloads: 32,
        likes: 8,
        status: "published",
        category: "Đề thi",
        course: "Vật lý đại cương"
    },
    {
        id: 3,
        title: "Bài tập lập trình C++",
        description: "Tổng hợp bài tập từ cơ bản đến nâng cao",
        fileName: "bai-tap-cpp.docx",
        fileType: "DOCX",
        uploadDate: "2024-01-05",
        views: 76,
        downloads: 28,
        likes: 15,
        status: "pending",
        category: "Bài tập",
        course: "Lập trình C++"
    }
];

const getStatusColor = (status: string) => {
    switch (status) {
        case 'published': return 'bg-green-100 text-green-800';
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'rejected': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
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

const getFileIcon = (fileType: string) => {
    return <FileText className="w-5 h-5 text-blue-600" />;
};

export default function UserDocuments({ userId }: UserDocumentsProps) {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setDocuments(mockDocuments);
            setIsLoading(false);
        }, 1000);
    }, [userId]);

    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-8">
                    <div className="flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                        <span className="ml-3 text-gray-600">Đang tải tài liệu...</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Search and Filter */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Tìm kiếm tài liệu..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="flex items-center gap-2">
                                    <Filter className="w-4 h-4" />
                                    Trạng thái: {statusFilter === 'all' ? 'Tất cả' : getStatusText(statusFilter)}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                                    Tất cả
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter('published')}>
                                    Đã duyệt
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                                    Chờ duyệt
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter('rejected')}>
                                    Bị từ chối
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button className="flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            Tải lên tài liệu mới
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Documents Grid */}
            {filteredDocuments.length === 0 ? (
                <Card>
                    <CardContent className="p-12 text-center">
                        <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {searchTerm || statusFilter !== 'all'
                                ? 'Không tìm thấy tài liệu'
                                : 'Chưa có tài liệu nào'
                            }
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {searchTerm || statusFilter !== 'all'
                                ? 'Thử thay đổi điều kiện tìm kiếm hoặc bộ lọc'
                                : 'Hãy tải lên tài liệu đầu tiên của bạn'
                            }
                        </p>
                        {(!searchTerm && statusFilter === 'all') && (
                            <Button>
                                <Upload className="w-4 h-4 mr-2" />
                                Tải lên tài liệu
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {filteredDocuments.map((doc) => (
                        <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4 flex-1">
                                        <div className="flex-shrink-0">
                                            {getFileIcon(doc.fileType)}
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

                                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
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

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                                <Eye className="w-4 h-4 mr-2" />
                                                Xem tài liệu
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Edit className="w-4 h-4 mr-2" />
                                                Chỉnh sửa
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Share2 className="w-4 h-4 mr-2" />
                                                Chia sẻ
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600">
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Xóa
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Summary */}
            {filteredDocuments.length > 0 && (
                <Card>
                    <CardContent className="p-4">
                        <div className="text-center text-sm text-gray-500">
                            Hiển thị {filteredDocuments.length} / {documents.length} tài liệu
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
