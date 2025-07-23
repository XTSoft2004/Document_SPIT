'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/shadcn-ui/card';
import { FileText, Eye, Download, Heart } from 'lucide-react';
import { IStatisticalUser } from '@/types/statistical';

interface ProfileStatsProps {
    stats: IStatisticalUser;
}

export default function ProfileStats({ stats }: ProfileStatsProps) {
    const statItems = [
        {
            icon: FileText,
            value: stats.totalDocuments,
            label: 'Tài liệu',
            color: 'blue'
        },
        {
            icon: Eye,
            value: stats.totalViews.toLocaleString(),
            label: 'Lượt xem',
            color: 'green'
        },
        {
            icon: Download,
            value: stats.totalDownloads,
            label: 'Tải xuống',
            color: 'purple'
        },
        {
            icon: Heart,
            value: stats.totalStars,
            label: 'Yêu thích',
            color: 'red'
        }
    ];

    const getColorClasses = (color: string) => {
        const colorMap = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            purple: 'bg-purple-100 text-purple-600',
            red: 'bg-red-100 text-red-600'
        };
        return colorMap[color as keyof typeof colorMap] || 'bg-gray-100 text-gray-600';
    };

    return (
        <div className="relative -mt-16 container mx-auto px-4 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <Card key={index} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                            <CardContent className="p-6 text-center">
                                <div className={`flex items-center justify-center w-12 h-12 mx-auto mb-3 ${getColorClasses(item.color)} rounded-full`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className="text-2xl font-bold text-gray-900">{item.value}</div>
                                <div className="text-sm text-gray-600">{item.label}</div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
