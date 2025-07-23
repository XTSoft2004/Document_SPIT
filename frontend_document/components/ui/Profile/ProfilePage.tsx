'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/shadcn-ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/shadcn-ui/card';
import { Button } from '@/components/ui/shadcn-ui/button';
import { Badge } from '@/components/ui/shadcn-ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/shadcn-ui/tabs';
import { Input } from '@/components/ui/shadcn-ui/input';
import { Label } from '@/components/ui/shadcn-ui/label';
import {
    User,
    Mail,
    Edit3,
    Save,
    X,
    Camera,
    FileText,
    Upload,
    Calendar,
    Download,
    Eye,
    Heart,
    MoreVertical,
    Search
} from 'lucide-react';
import NotificationService from '@/components/ui/Notification/NotificationService';

interface ProfileStats {
    totalDocuments: number;
    totalViews: number;
    totalDownloads: number;
    totalLikes: number;
}

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

const mockDocuments: Document[] = [
    {
        id: 1,
        title: "Bài giảng Toán cao cấp - Chương 1",
        description: "Giới thiệu về giải tích và các khái niệm cơ bản trong toán học",
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
        description: "Đề thi và đáp án chi tiết môn Vật lý đại cương học kỳ 1",
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
        description: "Tổng hợp bài tập lập trình C++ từ cơ bản đến nâng cao",
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

export default function ProfilePage() {
    const { getInfo, setInfo } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState<ProfileStats>({
        totalDocuments: 0,
        totalViews: 0,
        totalDownloads: 0,
        totalLikes: 0
    });
    const [documents, setDocuments] = useState<Document[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        avatarUrl: '',
    });

    useEffect(() => {
        const userInfo = getInfo();
        if (userInfo) {
            setFormData({
                fullname: userInfo.fullname,
                email: userInfo.email || '',
                avatarUrl: userInfo.avatarUrl || '',
            });
        }

        // Mock data
        setStats({
            totalDocuments: 24,
            totalViews: 1250,
            totalDownloads: 432,
            totalLikes: 89
        });
        setDocuments(mockDocuments);
    }, [getInfo]);

    const userInfo = getInfo();

    if (!userInfo) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Chưa đăng nhập</h2>
                    <p className="text-gray-600">Vui lòng đăng nhập để xem profile</p>
                </div>
            </div>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        // Simulate updating user info in localStorage
        const updatedInfo = {
            ...userInfo,
            ...formData
        };

        // Update localStorage directly
        localStorage.setItem('user', JSON.stringify(updatedInfo));
        setIsEditing(false);

        NotificationService.success({
            message: 'Cập nhật thành công',
            description: 'Thông tin profile đã được cập nhật'
        });
    };

    const handleCancel = () => {
        const userInfo = getInfo();
        if (userInfo) {
            setFormData({
                fullname: userInfo.fullname,
                email: userInfo.email || '',
                avatarUrl: userInfo.avatarUrl || '',
            });
        }
        setIsEditing(false);
    };

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header Section */}
            <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 pt-20 pb-32">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Avatar Section */}
                        <div className="relative group">
                            <Avatar className="w-32 h-32 border-4 border-white/20 shadow-2xl">
                                <AvatarImage
                                    src={formData.avatarUrl}
                                    alt={formData.fullname}
                                    className="object-cover"
                                />
                                <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                    {formData.fullname.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            {isEditing && (
                                <button className="absolute bottom-2 right-2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-300">
                                    <Camera className="w-4 h-4 text-gray-700" />
                                </button>
                            )}
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                                <h1 className="text-4xl font-bold text-white">{formData.fullname}</h1>
                                <Badge variant="secondary" className="w-fit bg-white/20 text-white border-white/30">
                                    {userInfo.roleName}
                                </Badge>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 text-white/90">
                                <div className="flex items-center gap-2 justify-center md:justify-start">
                                    <User className="w-4 h-4" />
                                    <span>@{userInfo.username}</span>
                                </div>
                                <div className="flex items-center gap-2 justify-center md:justify-start">
                                    <Mail className="w-4 h-4" />
                                    <span>{formData.email}</span>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3 justify-center md:justify-start">
                                {!isEditing ? (
                                    <Button
                                        onClick={() => setIsEditing(true)}
                                        className="bg-white/10 hover:bg-white/20 text-white border border-white/30"
                                        variant="outline"
                                    >
                                        <Edit3 className="w-4 h-4 mr-2" />
                                        Chỉnh sửa profile
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            onClick={handleSave}
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            Lưu
                                        </Button>
                                        <Button
                                            onClick={handleCancel}
                                            className="bg-white/10 hover:bg-white/20 text-white border border-white/30"
                                            variant="outline"
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            Hủy
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="relative -mt-16 container mx-auto px-4 mb-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                        <CardContent className="p-6 text-center">
                            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{stats.totalDocuments}</div>
                            <div className="text-sm text-gray-600">Tài liệu</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                        <CardContent className="p-6 text-center">
                            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full">
                                <Eye className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">Lượt xem</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                        <CardContent className="p-6 text-center">
                            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full">
                                <Download className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{stats.totalDownloads}</div>
                            <div className="text-sm text-gray-600">Tải xuống</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                        <CardContent className="p-6 text-center">
                            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-red-100 rounded-full">
                                <Heart className="w-6 h-6 text-red-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{stats.totalLikes}</div>
                            <div className="text-sm text-gray-600">Yêu thích</div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 pb-12">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-white shadow-sm">
                        <TabsTrigger value="overview" className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Thông tin cá nhân
                        </TabsTrigger>
                        <TabsTrigger value="documents" className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Tài liệu của tôi
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Thông tin cá nhân
                                </CardTitle>
                                <CardDescription>
                                    {isEditing ? 'Chỉnh sửa thông tin cá nhân của bạn' : 'Xem và quản lý thông tin cá nhân'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {isEditing ? (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="fullname">Họ và tên</Label>
                                                <Input
                                                    id="fullname"
                                                    name="fullname"
                                                    value={formData.fullname}
                                                    onChange={handleInputChange}
                                                    placeholder="Nhập họ và tên"
                                                    className="mt-1"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="email">Email</Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    placeholder="Nhập email"
                                                    className="mt-1"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-gray-600">Tên đăng nhập</Label>
                                            <Input
                                                value={userInfo.username}
                                                disabled
                                                className="mt-1 bg-gray-50"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Tên đăng nhập không thể thay đổi
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label className="text-sm text-gray-600">Họ và tên</Label>
                                            <p className="font-medium text-lg">{formData.fullname}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-gray-600">Tên đăng nhập</Label>
                                            <p className="font-medium text-lg">@{userInfo.username}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-gray-600">Email</Label>
                                            <p className="font-medium text-lg">{formData.email}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-gray-600">Vai trò</Label>
                                            <Badge variant="outline" className="mt-1">
                                                {userInfo.roleName}
                                            </Badge>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="documents" className="mt-6">
                        <div className="space-y-6">
                            {/* Search */}
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <Input
                                                placeholder="Tìm kiếm tài liệu..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                        <Button className="flex items-center gap-2">
                                            <Upload className="w-4 h-4" />
                                            Tải lên tài liệu mới
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Documents */}
                            {filteredDocuments.length === 0 ? (
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
                            ) : (
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
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
