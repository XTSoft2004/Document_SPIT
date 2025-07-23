'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/shadcn-ui/tabs';
import { User, FileText } from 'lucide-react';
import ProfileInfoTab from './ProfileInfoTab';
import DocumentsTab from './DocumentsTab';
import { Document } from './DocumentList';

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

interface ProfileTabsProps {
    activeTab: string;
    onTabChange: (value: string) => void;
    userInfo: UserInfo;
    formData: FormData;
    isEditing: boolean;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    documents: Document[];
    searchTerm: string;
    onSearchChange: (value: string) => void;
    isOwnProfile?: boolean;
}

export default function ProfileTabs({
    activeTab,
    onTabChange,
    userInfo,
    formData,
    isEditing,
    onInputChange,
    documents,
    searchTerm,
    onSearchChange,
    isOwnProfile = true
}: ProfileTabsProps) {
    return (
        <div className="container mx-auto px-4 pb-12">
            <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white shadow-sm">
                    <TabsTrigger value="overview" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Thông tin cá nhân
                    </TabsTrigger>
                    <TabsTrigger value="documents" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        {isOwnProfile ? 'Tài liệu của tôi' : 'Tài liệu'}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                    <ProfileInfoTab
                        userInfo={userInfo}
                        formData={formData}
                        isEditing={isEditing}
                        onInputChange={onInputChange}
                        isOwnProfile={isOwnProfile}
                    />
                </TabsContent>

                <TabsContent value="documents" className="mt-6">
                    <DocumentsTab
                        documents={documents}
                        searchTerm={searchTerm}
                        onSearchChange={onSearchChange}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
