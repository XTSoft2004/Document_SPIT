'use client';

import { useState, useEffect } from 'react';
import { getRecentDocuments } from '@/actions/document.actions';
import { IDocumentRecentResponse } from '@/types/document';

const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
        case 'pdf':
            return (
                <div className="p-2 bg-red-100 rounded-lg">
                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                    </svg>
                </div>
            );
        case 'doc':
        case 'docx':
            return (
                <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                    </svg>
                </div>
            );
        case 'ppt':
        case 'pptx':
            return (
                <div className="p-2 bg-orange-100 rounded-lg">
                    <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                    </svg>
                </div>
            );
        case 'zip':
        case 'rar':
            return (
                <div className="p-2 bg-purple-100 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14,17H12V15H14M14,13H12V11H14M12,9H14V7H12M12,19H14V17H12M14,7V9H16V7M14,15H16V13H14V15M12,5H14V3H12M14,5V7H16V5M20,19V7L16,3H4A2,2 0 0,0 2,5V19A2,2 0 0,0 4,21H18A2,2 0 0,0 20,19Z" />
                    </svg>
                </div>
            );
        default:
            return (
                <div className="p-2 bg-gray-100 rounded-lg">
                    <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                    </svg>
                </div>
            );
    }
};

const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return 'Không xác định';
    }
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export default function RecentContributions() {
    const [showAll, setShowAll] = useState(false);
    const [contributions, setContributions] = useState<IDocumentRecentResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRecentDocuments = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getRecentDocuments(5);

            if (response.ok && response.data) {
                setContributions(response.data);
            } else {
                setError('Không thể tải dữ liệu tài liệu');
            }
        } catch (err) {
            setError('Có lỗi xảy ra khi tải dữ liệu');
            console.error('Error fetching recent documents:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecentDocuments();
    }, []);

    const displayedContributions = showAll
        ? contributions
        : contributions.slice(0, 3);

    if (loading) {
        return (
            <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 lg:p-8">
                <div className="animate-pulse">
                    <div className="h-6 sm:h-8 bg-gray-200 rounded w-32 sm:w-64 mb-3 sm:mb-4"></div>
                    <div className="space-y-3 sm:space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex flex-col sm:flex-row sm:items-center p-3 sm:p-4 border border-gray-200 rounded-lg space-y-3 sm:space-y-0">
                                <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
                                    <div className="flex-1 min-w-0">
                                        <div className="h-4 sm:h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                                        <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                                <div className="flex sm:flex-col space-x-4 sm:space-x-0 sm:space-y-1">
                                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 lg:p-8">
                <div className="text-center py-6 sm:py-8">
                    <div className="text-red-500 mb-4">
                        <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                        <span className="hidden sm:inline">Không thể tải dữ liệu</span>
                        <span className="sm:hidden">Không thể tải</span>
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchRecentDocuments}
                        className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                    >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    if (contributions.length === 0) {
        return (
            <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 lg:p-8">
                <div className="text-center py-6 sm:py-8">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                        <span className="hidden sm:inline">Chưa có tài liệu nào</span>
                        <span className="sm:hidden">Chưa có tài liệu</span>
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600">
                        <span className="hidden sm:inline">Hãy là người đầu tiên đóng góp tài liệu!</span>
                        <span className="sm:hidden">Hãy đóng góp đầu tiên!</span>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                        <span className="hidden sm:inline">Tài liệu mới nhất</span>
                        <span className="sm:hidden">Tài liệu mới</span>
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600">
                        <span className="hidden sm:inline">Những tài liệu được đóng góp gần đây bởi cộng đồng</span>
                        <span className="sm:hidden">Tài liệu đóng góp gần đây</span>
                    </p>
                </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
                {displayedContributions.map((contribution) => (
                    <div
                        key={contribution.id}
                        className="flex flex-col sm:flex-row sm:items-center p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer space-y-3 sm:space-y-0 overflow-hidden"
                    >
                        <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1 min-w-0 overflow-hidden">
                            <div className="flex-shrink-0">
                                {getFileIcon(contribution.typeFile)}
                            </div>

                            <div className="flex-1 min-w-0 overflow-hidden">
                                <div className="mb-1 sm:mb-2">
                                    <h3
                                        className="font-semibold text-gray-900 text-sm sm:text-base break-words line-clamp-2"
                                        title={contribution.name}
                                    >
                                        {contribution.name}
                                    </h3>
                                </div>

                                {/* Mobile: Stack vertically */}
                                <div className="sm:hidden space-y-1 overflow-hidden">
                                    <div className="flex items-center justify-between text-xs text-gray-500 gap-2 min-w-0">
                                        <div className="flex items-center min-w-0 flex-1">
                                            <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span
                                                className="truncate min-w-0"
                                                title={contribution.fullname}
                                            >
                                                {contribution.fullname}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-400 flex-shrink-0 whitespace-nowrap">
                                            {formatDate(contribution.createdDate)}
                                        </span>
                                    </div>
                                </div>

                                {/* Desktop: Horizontal layout */}
                                <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-500 overflow-hidden">
                                    <span className="flex items-center min-w-0 flex-1">
                                        <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span
                                            className="truncate"
                                            title={contribution.fullname}
                                        >
                                            {contribution.fullname}
                                        </span>
                                    </span>
                                    <span className="flex items-center flex-shrink-0 whitespace-nowrap">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {formatDate(contribution.createdDate)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Stats section */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center space-x-4 sm:space-x-0 sm:space-y-1 text-xs sm:text-sm text-gray-500 sm:ml-4 flex-shrink-0">
                            <span className="flex items-center whitespace-nowrap">
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="sm:hidden">↓</span>
                                <span className="ml-1">{contribution.totalDownloads}</span>
                            </span>
                            <span className="flex items-center whitespace-nowrap">
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <span className="ml-1">{contribution.totalViews}</span>
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {contributions.length > 3 && !showAll && (
                <div className="text-center mt-4 sm:mt-6">
                    <button
                        onClick={() => setShowAll(true)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200 hover:bg-blue-50 px-4 py-2 rounded-lg"
                    >
                        <span className="hidden sm:inline">Xem thêm {contributions.length - 3} tài liệu khác</span>
                        <span className="sm:hidden">Xem thêm ({contributions.length - 3})</span>
                    </button>
                </div>
            )}
        </div>
    );
}
