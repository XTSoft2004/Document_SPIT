'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/shadcn-ui/card';
import { Button } from '@/components/ui/shadcn-ui/button';
import { Input } from '@/components/ui/shadcn-ui/input';
import { Search, Upload } from 'lucide-react';
import DocumentList, { Document } from './DocumentList';

interface DocumentsTabProps {
    documents: Document[];
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

export default function DocumentsTab({
    documents,
    searchTerm,
    onSearchChange
}: DocumentsTabProps) {
    return (
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
                                onChange={(e) => onSearchChange(e.target.value)}
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
            <DocumentList documents={documents} searchTerm={searchTerm} />
        </div>
    );
}
