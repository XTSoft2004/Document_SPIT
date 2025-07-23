'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/shadcn-ui/card';
import { Input } from '@/components/ui/shadcn-ui/input';
import { Label } from '@/components/ui/shadcn-ui/label';
import { Badge } from '@/components/ui/shadcn-ui/badge';
import { User } from 'lucide-react';

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

interface ProfileInfoTabProps {
    userInfo: UserInfo;
    formData: FormData;
    isEditing: boolean;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isOwnProfile?: boolean;
}

export default function ProfileInfoTab({
    userInfo,
    formData,
    isEditing,
    onInputChange,
    isOwnProfile = true
}: ProfileInfoTabProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Thông tin cá nhân
                </CardTitle>
                <CardDescription>
                    {isEditing ? 'Chỉnh sửa thông tin cá nhân của bạn' : 'Thông tin cá nhân'}
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
                                    onChange={onInputChange}
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
                                    onChange={onInputChange}
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
    );
}
