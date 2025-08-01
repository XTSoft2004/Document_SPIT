'use client'
import { IRanking, IStatisticalUser } from "@/types/statistical";
import { useRankingData } from "@/hooks/useRankingData";
import { Skeleton } from "antd";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getStatisticalUser } from "@/actions/statistical.actions";
import { useEffect, useState } from "react";
import { IInfoUserResponse } from "@/types/auth";
import Image from "next/image";
import { AvatarImage } from "@radix-ui/react-avatar";

export default function RankingPageClient() {
    const { rankings, loading, error } = useRankingData();
    const { getInfo } = useAuth();
    // If you need infoRankMe, use the following pattern:
    const [infoRankMe, setInfoRankMe] = useState<IStatisticalUser | null>(null);
    useEffect(() => {
        const fetchInfoRankMe = async () => {
            const username = getInfo()?.username || '';
            if (username) {
                const result = await getStatisticalUser(username);
                setInfoRankMe(result.data);
            }
        };
        fetchInfoRankMe();
    }, [getInfo]);

    // If not needed, simply remove the line.
    const topThree = rankings.slice(0, 3);
    const remaining = rankings.slice(3);

    const getPodiumHeight = (position: number) => {
        switch (position) {
            case 1: return 'h-32'; // Highest
            case 2: return 'h-24'; // Second highest  
            case 3: return 'h-20'; // Lowest
            default: return 'h-24';
        }
    };

    const getMedalColor = (position: number) => {
        switch (position) {
            case 1: return 'from-yellow-400 to-yellow-600';
            case 2: return 'from-gray-400 to-gray-600';
            case 3: return 'from-amber-500 to-amber-700';
            default: return 'from-blue-500 to-purple-600';
        }
    };

    const getAvatar = (name: string) => {
        // Generate a simple avatar from name initials
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        const colors = [
            'from-red-400 to-red-600',
            'from-blue-400 to-blue-600',
            'from-green-400 to-green-600',
            'from-purple-400 to-purple-600',
            'from-pink-400 to-pink-600',
            'from-indigo-400 to-indigo-600'
        ];
        const colorIndex = name.length % colors.length;
        return { initials, gradient: colors[colorIndex] };
    };

    if (error) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{error}</h3>
                    <p className="text-gray-500">Vui lòng thử lại sau</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8 px-4 sm:px-6">
            {/* Podium Section */}
            <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-12">
                {loading ? (
                    <>
                        {/* Mobile Loading */}
                        <div className="sm:hidden space-y-4 mb-6">
                            {[1, 2, 3].map((pos) => (
                                <div key={pos} className="flex items-center p-4 bg-white rounded-xl">
                                    <Skeleton.Avatar size={60} className="mr-4" />
                                    <div className="flex-1">
                                        <Skeleton.Input active size="small" className="w-32 mb-2" />
                                        <Skeleton.Input active size="small" className="w-24" />
                                    </div>
                                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                                </div>
                            ))}
                        </div>

                        {/* Desktop Loading */}
                        <div className="hidden sm:flex justify-center items-end gap-4 lg:gap-12 mb-8 lg:mb-12">
                            {[2, 1, 3].map((pos) => (
                                <div key={pos} className="text-center">
                                    <Skeleton.Avatar size={pos === 1 ? 120 : 100} className="mb-4 lg:mb-6" />
                                    <div className={`bg-gray-200 rounded-t-2xl mx-auto animate-pulse ${pos === 1
                                        ? 'w-32 lg:w-52 h-28 lg:h-44'
                                        : 'w-28 lg:w-44 h-20 lg:h-32'
                                        }`} />
                                </div>
                            ))}
                        </div>
                    </>
                ) : topThree.length > 0 ? (
                    <>
                        {/* Mobile: Vertical Top 3 */}
                        <div className="sm:hidden space-y-4 mb-6">
                            {topThree.map((ranking, index) => {
                                const position = index + 1;
                                const avatar = getAvatar(ranking.fullname);
                                return (
                                    <div key={ranking.fullname} className={`flex items-center p-4 rounded-xl ${position === 1 ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-300' :
                                        position === 2 ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-300' :
                                            'bg-gradient-to-r from-amber-50 to-amber-100 border-2 border-amber-300'
                                        }`}>
                                        <div className="relative mr-4">
                                            {ranking.avatarUrl ? (
                                                <Image
                                                    src={ranking.avatarUrl}
                                                    alt={ranking.fullname}
                                                    width={64}
                                                    height={64}
                                                    className="w-16 h-16 rounded-full object-cover shadow-lg"
                                                />
                                            ) : (
                                                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${avatar.gradient} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                                                    {avatar.initials}
                                                </div>
                                            )}
                                            <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${position === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                                                position === 2 ? 'bg-gradient-to-br from-gray-400 to-gray-600' :
                                                    'bg-gradient-to-br from-amber-500 to-amber-700'
                                                }`}>
                                                <span className="text-white font-bold text-sm">{position}</span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 text-lg">{ranking.fullname}</h3>
                                            <p className="text-gray-600">{ranking.totalUpload} tài liệu</p>
                                        </div>
                                        <div className="text-4xl">
                                            {position === 1 ? '🥇' : position === 2 ? '🥈' : '🥉'}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Desktop: Podium Layout */}
                        <div className="hidden sm:flex justify-center items-end gap-4 lg:gap-12 mb-8 lg:mb-12">
                            {/* Second Place */}
                            {topThree[1] && (
                                <div className="text-center relative">
                                    <Link href={`/profile/${topThree[1].username}`} className="mb-4 lg:mb-6 relative">
                                        {topThree[1].avatarUrl ? (
                                            <Image
                                                src={topThree[1].avatarUrl}
                                                alt={topThree[1].fullname}
                                                width={128}
                                                height={128}
                                                className="w-24 lg:w-32 h-24 lg:h-32 rounded-full object-cover shadow-xl mx-auto"
                                            />
                                            // <AvatarImage
                                            //     src={topThree[1].avatarUrl}
                                            //     alt={topThree[1].fullname}
                                            //     className="w-24 lg:w-32 h-24 lg:h-32 rounded-full object-cover shadow-xl mx-auto"
                                            // />
                                        ) : (
                                            <div className={`w-24 lg:w-32 h-24 lg:h-32 rounded-full bg-gradient-to-br ${getAvatar(topThree[1].fullname).gradient} flex items-center justify-center text-white font-bold text-2xl lg:text-3xl shadow-xl mx-auto`}>
                                                {getAvatar(topThree[1].fullname).initials}
                                            </div>
                                        )}
                                    </Link>
                                    <h3 className="font-bold text-gray-900 mb-1 lg:mb-2 text-lg lg:text-xl truncate max-w-32 lg:max-w-44 mt-5">{topThree[1].fullname}</h3>
                                    <p className="text-sm lg:text-base text-gray-600 mb-2 lg:mb-4">{topThree[1].totalUpload} tài liệu</p>
                                    <div className="bg-gradient-to-t from-gray-300 to-gray-200 rounded-t-2xl w-28 lg:w-44 h-20 lg:h-32 flex items-start justify-center pt-2 lg:pt-4 shadow-lg mx-auto">
                                        <span className="text-4xl lg:text-7xl">🥈</span>
                                    </div>
                                </div>
                            )}

                            {/* First Place */}
                            {topThree[0] && (
                                <div className="text-center relative">
                                    <div className="mb-4 lg:mb-6 relative">
                                        <Link href={`/profile/${topThree[0].username}`} className="flex flex-col items-center">
                                            {topThree[0].avatarUrl ? (
                                                <Image
                                                    src={topThree[0].avatarUrl}
                                                    alt={topThree[0].fullname}
                                                    width={160}
                                                    height={160}
                                                    className="w-28 lg:w-40 h-28 lg:h-40 rounded-full object-cover shadow-2xl mx-auto ring-4 lg:ring-8 ring-yellow-300"
                                                />
                                            ) : (
                                                <div className={`w-28 lg:w-40 h-28 lg:h-40 rounded-full bg-gradient-to-br ${getAvatar(topThree[0].fullname).gradient} flex items-center justify-center text-white font-bold text-3xl lg:text-4xl shadow-2xl mx-auto ring-4 lg:ring-8 ring-yellow-300`}>
                                                    {getAvatar(topThree[0].fullname).initials}
                                                </div>
                                            )}
                                        </Link>
                                        <div className="absolute -top-4 lg:-top-8 left-1/2 transform -translate-x-1/2">
                                            <span className="text-2xl lg:text-4xl">👑</span>
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-1 lg:mb-2 text-xl lg:text-2xl truncate max-w-32 lg:max-w-52">{topThree[0].fullname}</h3>
                                    <p className="text-base lg:text-lg text-gray-600 mb-2 lg:mb-4">{topThree[0].totalUpload} tài liệu</p>
                                    <div className="bg-gradient-to-t from-yellow-400 to-yellow-300 rounded-t-2xl w-32 lg:w-52 h-28 lg:h-44 flex items-start justify-center pt-2 lg:pt-4 shadow-xl mx-auto">
                                        <span className="text-5xl lg:text-8xl">🥇</span>
                                    </div>
                                </div>
                            )}

                            {/* Third Place */}
                            {topThree[2] && (
                                <div className="text-center relative">
                                    <Link href={`/profile/${topThree[2].username}`} className="mb-4 lg:mb-6 relative">
                                        {topThree[2].avatarUrl ? (
                                            <Image
                                                src={topThree[2].avatarUrl}
                                                alt={topThree[2].fullname}
                                                width={128}
                                                height={128}
                                                className="w-24 lg:w-32 h-24 lg:h-32 rounded-full object-cover shadow-xl mx-auto"
                                            />
                                        ) : (
                                            <div className={`w-24 lg:w-32 h-24 lg:h-32 rounded-full bg-gradient-to-br ${getAvatar(topThree[2].fullname).gradient} flex items-center justify-center text-white font-bold text-2xl lg:text-3xl shadow-xl mx-auto`}>
                                                {getAvatar(topThree[2].fullname).initials}
                                            </div>
                                        )}
                                    </Link>
                                    <h3 className="font-bold text-gray-900 mb-1 lg:mb-2 text-lg lg:text-xl truncate max-w-32 lg:max-w-44 mt-5">{topThree[2].fullname}</h3>
                                    <p className="text-sm lg:text-base text-gray-600 mb-2 lg:mb-4">{topThree[2].totalUpload} tài liệu</p>
                                    <div className="bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-2xl w-28 lg:w-44 h-16 lg:h-28 flex items-start justify-center pt-2 lg:pt-4 shadow-lg mx-auto">
                                        <span className="text-4xl lg:text-7xl">🥉</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-8 sm:py-12 lg:py-16">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6">
                            <svg className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2 lg:mb-3">Chưa có dữ liệu xếp hạng</h3>
                        <p className="text-sm sm:text-base text-gray-500">Hãy trở thành người đầu tiên đóng góp tài liệu!</p>
                    </div>
                )}
            </div>

            {/* Remaining Rankings */}
            {/* {remaining.length > 0 && (
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Xếp hạng chi tiết</h3>
                    <div className="space-y-2 sm:space-y-3">
                        {[...Array(2)].map((_, index) => (
                            <div key={index} className="flex items-center p-3 sm:p-4 bg-gray-50 rounded-xl">
                                <Skeleton.Avatar size={40} className="sm:hidden mr-3" />
                                <Skeleton.Avatar size={50} className="hidden sm:block mr-4" />
                                <div className="flex-1">
                                    <Skeleton.Input active size="small" className="w-32 sm:w-40 mb-1 sm:mb-2" />
                                    <Skeleton.Input active size="small" className="w-20 sm:w-24" />
                                </div>
                                <Skeleton.Input active size="small" className="w-12 sm:w-16" />
                            </div>
                        ))}
                    </div>
                </div>
            )} */}

            {/* Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1 pr-2">
                            <p className="text-blue-100 text-xs sm:text-sm">Tổng người đóng góp</p>
                            <p className="text-2xl sm:text-3xl font-bold truncate">{rankings.length} người</p>
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1 pr-2">
                            <p className="text-green-100 text-xs sm:text-sm">Tổng tài liệu</p>
                            <p className="text-2xl sm:text-3xl font-bold truncate">{rankings.reduce((sum, r) => sum + r.totalUpload, 0)} tài liệu</p>
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1 pr-2">
                            <p className="text-purple-100 text-xs sm:text-sm">Đóng góp nhiều nhất</p>
                            <p className="text-2xl sm:text-3xl font-bold truncate">{rankings.length > 0 ? rankings[0].totalUpload : 0} tài liệu</p>
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
