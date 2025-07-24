'use client'

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/shadcn-ui/tabs'
import { User, FileText } from 'lucide-react'
import ProfileInfoTab from './ProfileInfoTab'
import DocumentsTab from './DocumentsTab'
import { IInfoUserResponse } from '@/types/auth'
import { IUserUpdate } from '@/types/user'

interface ProfileTabsProps {
  activeTab: string
  onTabChange: (value: string) => void
  userInfo: IInfoUserResponse
  searchTerm: string
  onSearchChange: (value: string) => void
  username: string
  isOwnProfile?: boolean
  onSave?: (data: Partial<IUserUpdate>) => Promise<void>
}

export default function ProfileTabs({
  activeTab,
  onTabChange,
  userInfo,
  searchTerm,
  onSearchChange,
  username,
  isOwnProfile = false,
  onSave
}: ProfileTabsProps) {
  return (
    <div className="container mx-auto px-4 pb-12">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-gray-50 to-white shadow-lg border border-gray-200 rounded-xl h-20 text-lg p-2">
          <TabsTrigger 
            value="overview" 
            className="flex items-center justify-center gap-3 h-full rounded-lg font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-100 data-[state=active]:hover:from-blue-600 data-[state=active]:hover:to-purple-700"
          >
            <User className="w-5 h-5" />
            Thông tin cá nhân
          </TabsTrigger>
          <TabsTrigger 
            value="documents" 
            className="flex items-center justify-center gap-3 h-full rounded-lg font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-100 data-[state=active]:hover:from-blue-600 data-[state=active]:hover:to-purple-700"
          >
            <FileText className="w-5 h-5" />
            Tài liệu
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-8">
          <div className="animate-in fade-in-50 duration-500">
            <ProfileInfoTab
              userInfo={userInfo}
              isOwnProfile={isOwnProfile}
              onSave={onSave}
            />
          </div>
        </TabsContent>

        <TabsContent value="documents" className="mt-8">
          <div className="animate-in fade-in-50 duration-500">
            <DocumentsTab
              username={username}
              searchTerm={searchTerm}
              onSearchChange={onSearchChange}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
