'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import NotificationService from '@/components/ui/Notification/NotificationService';
import ProfileHeader from './ProfileHeader';
import ProfileStats from './ProfileStats';
import ProfileTabs from './ProfileTabs';
import { Document as DocumentType } from './DocumentList';

interface ProfileStats {
    totalDocuments: number;
    totalViews: number;
    totalDownloads: number;
    totalLikes: number;
}

const mockDocuments: DocumentType[] = [
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
    const { getInfo } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState<ProfileStats>({
        totalDocuments: 0,
        totalViews: 0,
        totalDownloads: 0,
        totalLikes: 0
    });
    const [documents, setDocuments] = useState<DocumentType[]>([]);
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
        const updatedInfo = {
            ...userInfo,
            ...formData
        };

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

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header Section */}
            <ProfileHeader
                userInfo={userInfo}
                formData={formData}
                isEditing={isEditing}
                onEditClick={() => setIsEditing(true)}
                onSave={handleSave}
                onCancel={handleCancel}
            />

            {/* Stats Section */}
            <ProfileStats stats={stats} />

            {/* Main Content */}
            <ProfileTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                userInfo={userInfo}
                formData={formData}
                isEditing={isEditing}
                onInputChange={handleInputChange}
                documents={documents}
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
            />
        </div>
    );
}
