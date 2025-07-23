'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/shadcn-ui/avatar';
import { Button } from '@/components/ui/shadcn-ui/button';
import { Badge } from '@/components/ui/shadcn-ui/badge';
import { User, Mail, Edit3, Save, X, Camera } from 'lucide-react';

interface UserInfo {
    username: string;
    roleName: string;
    fullname: string;
    email?: string;
    avatarUrl?: string;
}

interface FormData {
    fullname: string;
    email: string;
    avatarUrl: string;
}

interface ProfileHeaderProps {
    userInfo: UserInfo;
    formData: FormData;
    isEditing: boolean;
    onEditClick: () => void;
    onSave: () => void;
    onCancel: () => void;
    isOwnProfile?: boolean;
}

export default function ProfileHeader({
    userInfo,
    formData,
    isEditing,
    onEditClick,
    onSave,
    onCancel,
    isOwnProfile = true
}: ProfileHeaderProps) {
    return (
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
                            {isOwnProfile && (
                                !isEditing ? (
                                    <Button
                                        onClick={onEditClick}
                                        className="bg-white/10 hover:bg-white/20 text-white border border-white/30"
                                        variant="outline"
                                    >
                                        <Edit3 className="w-4 h-4 mr-2" />
                                        Chỉnh sửa profile
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            onClick={onSave}
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            Lưu
                                        </Button>
                                        <Button
                                            onClick={onCancel}
                                            className="bg-white/10 hover:bg-white/20 text-white border border-white/30"
                                            variant="outline"
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            Hủy
                                        </Button>
                                    </>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
