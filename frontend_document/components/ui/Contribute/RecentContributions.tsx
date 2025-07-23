'use client';

import { useState, useEffect } from 'react';
import { getRecentDocuments } from '@/actions/document.actions';
import { IDocumentRecentResponse } from '@/types/document';

const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
        case 'pdf':
            return (
                <div className="p-2 rounded-lg">
                    <svg className="w-10 h-10" viewBox="-4 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M25.6686 26.0962C25.1812 26.2401 24.4656 26.2563 23.6984 26.145C22.875 26.0256 22.0351 25.7739 21.2096 25.403C22.6817 25.1888 23.8237 25.2548 24.8005 25.6009C25.0319 25.6829 25.412 25.9021 25.6686 26.0962ZM17.4552 24.7459C17.3953 24.7622 17.3363 24.7776 17.2776 24.7939C16.8815 24.9017 16.4961 25.0069 16.1247 25.1005L15.6239 25.2275C14.6165 25.4824 13.5865 25.7428 12.5692 26.0529C12.9558 25.1206 13.315 24.178 13.6667 23.2564C13.9271 22.5742 14.193 21.8773 14.468 21.1894C14.6075 21.4198 14.7531 21.6503 14.9046 21.8814C15.5948 22.9326 16.4624 23.9045 17.4552 24.7459ZM14.8927 14.2326C14.958 15.383 14.7098 16.4897 14.3457 17.5514C13.8972 16.2386 13.6882 14.7889 14.2489 13.6185C14.3927 13.3185 14.5105 13.1581 14.5869 13.0744C14.7049 13.2566 14.8601 13.6642 14.8927 14.2326ZM9.63347 28.8054C9.38148 29.2562 9.12426 29.6782 8.86063 30.0767C8.22442 31.0355 7.18393 32.0621 6.64941 32.0621C6.59681 32.0621 6.53316 32.0536 6.44015 31.9554C6.38028 31.8926 6.37069 31.8476 6.37359 31.7862C6.39161 31.4337 6.85867 30.8059 7.53527 30.2238C8.14939 29.6957 8.84352 29.2262 9.63347 28.8054ZM27.3706 26.1461C27.2889 24.9719 25.3123 24.2186 25.2928 24.2116C24.5287 23.9407 23.6986 23.8091 22.7552 23.8091C21.7453 23.8091 20.6565 23.9552 19.2582 24.2819C18.014 23.3999 16.9392 22.2957 16.1362 21.0733C15.7816 20.5332 15.4628 19.9941 15.1849 19.4675C15.8633 17.8454 16.4742 16.1013 16.3632 14.1479C16.2737 12.5816 15.5674 11.5295 14.6069 11.5295C13.948 11.5295 13.3807 12.0175 12.9194 12.9813C12.0965 14.6987 12.3128 16.8962 13.562 19.5184C13.1121 20.5751 12.6941 21.6706 12.2895 22.7311C11.7861 24.0498 11.2674 25.4103 10.6828 26.7045C9.04334 27.3532 7.69648 28.1399 6.57402 29.1057C5.8387 29.7373 4.95223 30.7028 4.90163 31.7107C4.87693 32.1854 5.03969 32.6207 5.37044 32.9695C5.72183 33.3398 6.16329 33.5348 6.6487 33.5354C8.25189 33.5354 9.79489 31.3327 10.0876 30.8909C10.6767 30.0029 11.2281 29.0124 11.7684 27.8699C13.1292 27.3781 14.5794 27.011 15.985 26.6562L16.4884 26.5283C16.8668 26.4321 17.2601 26.3257 17.6635 26.2153C18.0904 26.0999 18.5296 25.9802 18.976 25.8665C20.4193 26.7844 21.9714 27.3831 23.4851 27.6028C24.7601 27.7883 25.8924 27.6807 26.6589 27.2811C27.3486 26.9219 27.3866 26.3676 27.3706 26.1461ZM30.4755 36.2428C30.4755 38.3932 28.5802 38.5258 28.1978 38.5301H3.74486C1.60224 38.5301 1.47322 36.6218 1.46913 36.2428L1.46884 3.75642C1.46884 1.6039 3.36763 1.4734 3.74457 1.46908H20.263L20.2718 1.4778V7.92396C20.2718 9.21763 21.0539 11.6669 24.0158 11.6669H30.4203L30.4753 11.7218L30.4755 36.2428ZM28.9572 10.1976H24.0169C21.8749 10.1976 21.7453 8.29969 21.7424 7.92417V2.95307L28.9572 10.1976ZM31.9447 36.2428V11.1157L21.7424 0.871022V0.823357H21.6936L20.8742 0H3.74491C2.44954 0 0 0.785336 0 3.75711V36.2435C0 37.5427 0.782956 40 3.74491 40H28.2001C29.4952 39.9997 31.9447 39.2143 31.9447 36.2428Z" fill="#EB5757" />
                    </svg>
                </div>
            );
        case 'doc':
        case 'docx':
            return (
                <div className="p-2 rounded-lg">
                    <svg className="w-10 h-10" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                        <path fill="#90CAF9" d="M40 45L8 45 8 3 30 3 40 13z"></path><path fill="#E1F5FE" d="M38.5 14L29 14 29 4.5z"></path><path fill="#1976D2" d="M16 21H33V23H16zM16 25H29V27H16zM16 29H33V31H16zM16 33H29V35H16z"></path>
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
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'gif':
            return (
                <div className="p-2 rounded-lg">
                    <svg className="w-10 h-10" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                        <path fill="#90CAF9" d="M40 45L8 45 8 3 30 3 40 13z"></path><path fill="#E1F5FE" d="M38.5 14L29 14 29 4.5z"></path><path fill="#1565C0" d="M21 23L14 33 28 33z"></path><path fill="#1976D2" d="M28 26.4L23 33 33 33zM31.5 23A1.5 1.5 0 1 0 31.5 26 1.5 1.5 0 1 0 31.5 23z"></path>
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
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <span className="text-xs text-gray-400 whitespace-nowrap">
                                                {formatDate(contribution.createdDate)}
                                            </span>
                                        </div>
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
                        <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-center space-x-4 sm:space-x-0 sm:space-y-1 text-xs sm:text-sm text-gray-500 sm:ml-4 flex-shrink-0">
                            <span className="mb-2 flex items-center whitespace-nowrap">
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
