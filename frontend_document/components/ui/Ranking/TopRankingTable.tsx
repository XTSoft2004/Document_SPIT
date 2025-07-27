'use client'
import { IRanking } from "@/types/statistical";
import { Skeleton } from "antd";
import Link from "next/link";

interface TopRankingTableProps {
    rankings: IRanking[];
    loading: boolean;
}

export default function TopRankingTable({ rankings, loading }: TopRankingTableProps) {
    const topTen = rankings.slice(0, 10);

    const getAvatar = (name: string) => {
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        const colors = [
            'from-red-400 to-red-600',
            'from-blue-400 to-blue-600',
            'from-green-400 to-green-600',
            'from-purple-400 to-purple-600',
            'from-pink-400 to-pink-600',
            'from-indigo-400 to-indigo-600',
            'from-yellow-400 to-yellow-600',
            'from-teal-400 to-teal-600',
            'from-orange-400 to-orange-600',
            'from-cyan-400 to-cyan-600'
        ];
        const colorIndex = name.length % colors.length;
        return { initials, gradient: colors[colorIndex] };
    };

    const getRankBadge = (position: number) => {
        if (position <= 3) {
            const colors = {
                1: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white',
                2: 'bg-gradient-to-r from-gray-400 to-gray-600 text-white',
                3: 'bg-gradient-to-r from-amber-500 to-amber-700 text-white'
            };
            return colors[position as keyof typeof colors];
        }
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
    };

    const getRankEmoji = (position: number) => {
        const emojis = {
            1: '🥇',
            2: '🥈',
            3: '🥉'
        };
        return emojis[position as keyof typeof emojis] || '🏅';
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <Skeleton.Input active size="large" className="w-48 h-8" />
                    <Skeleton.Input active size="small" className="w-32 h-6" />
                </div>

                {/* Mobile Loading */}
                <div className="sm:hidden space-y-3">
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <Skeleton.Avatar size={40} className="mr-3" />
                            <div className="flex-1">
                                <Skeleton.Input active size="small" className="w-32 mb-1" />
                                <Skeleton.Input active size="small" className="w-20" />
                            </div>
                            <Skeleton.Input active size="small" className="w-12" />
                        </div>
                    ))}
                </div>

                {/* Desktop Loading */}
                <div className="hidden sm:block">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    {['Hạng', 'Người dùng', 'Tài liệu', 'Trạng thái'].map((header) => (
                                        <th key={header} className="text-left py-3 px-4">
                                            <Skeleton.Input active size="small" className="w-20 h-4" />
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[...Array(5)].map((_, index) => (
                                    <tr key={index} className="border-b border-gray-100">
                                        <td className="py-3 px-4">
                                            <Skeleton.Avatar size={30} />
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center">
                                                <Skeleton.Avatar size={40} className="mr-3" />
                                                <Skeleton.Input active size="small" className="w-32" />
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <Skeleton.Input active size="small" className="w-16" />
                                        </td>
                                        <td className="py-3 px-4">
                                            <Skeleton.Input active size="small" className="w-20" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                        🏆 Top 10 Người Đóng Góp
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600">
                        Những cá nhân xuất sắc nhất trong cộng đồng
                    </p>
                </div>
                <div className="mt-3 sm:mt-0">
                    <div className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        {topTen.length} người
                    </div>
                </div>
            </div>

            {/* Mobile View */}
            <div className="sm:hidden space-y-3">
                {topTen.map((ranking, index) => {
                    const position = index + 1;
                    const avatar = getAvatar(ranking.fullname);
                    return (
                        <div key={ranking.fullname} className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-300">
                            <div className="flex items-center mr-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${getRankBadge(position)} shadow-lg`}>
                                    {position}
                                </div>
                                <span className="ml-1 text-lg">{getRankEmoji(position)}</span>
                            </div>

                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatar.gradient} flex items-center justify-center text-white font-bold text-sm shadow-lg mr-3`}>
                                {avatar.initials}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-gray-900 text-sm truncate">{ranking.fullname}</h4>
                                <p className="text-xs text-gray-600">{ranking.totalUpload} tài liệu</p>
                            </div>

                            <div className="flex items-center">
                                <div className="bg-blue-100 px-2 py-1 rounded-full">
                                    <span className="text-blue-600 font-bold text-xs">{ranking.totalUpload}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-gray-200">
                                <th className="text-left py-4 px-4 font-bold text-gray-900">Hạng</th>
                                <th className="text-left py-4 px-4 font-bold text-gray-900">Người dùng</th>
                                <th className="text-center py-4 px-4 font-bold text-gray-900">Số tài liệu đã tải lên</th>
                                <th className="text-center py-4 px-4 font-bold text-gray-900">Danh hiệu</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topTen.map((ranking, index) => {
                                const position = index + 1;
                                const avatar = getAvatar(ranking.fullname);
                                return (
                                    <tr key={ranking.fullname} className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-300">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${getRankBadge(position)} shadow-lg mr-2`}>
                                                    {position}
                                                </div>
                                                <span className="text-2xl">{getRankEmoji(position)}</span>
                                            </div>
                                        </td>

                                        <td className="py-4 px-4">
                                            <Link href={`/profile/${ranking.username}`} className="flex items-center flex-1 space-x-3">
                                                <div className="flex items-center">
                                                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${avatar.gradient} flex items-center justify-center text-white font-bold shadow-lg mr-4`}>
                                                        {avatar.initials}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 text-base">{ranking.fullname}</h4>
                                                        <p className="text-sm text-gray-600">Thành viên tích cực</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </td>

                                        <td className="py-4 px-4 text-center">
                                            <div className="flex items-center justify-center">
                                                <svg className="w-4 h-4 text-blue-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <span className="font-bold text-lg text-gray-900">{ranking.totalUpload} <span className="font-semibold"> tài liệu</span></span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${position <= 3
                                                ? 'bg-green-100 text-green-800'
                                                : position <= 6
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {position <= 3 ? '🔥 Xuất sắc' : position <= 6 ? '⭐ Tốt' : '👍 Khá'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Empty State */}
            {topTen.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có dữ liệu xếp hạng</h3>
                    <p className="text-gray-500">Hãy trở thành người đầu tiên đóng góp tài liệu!</p>
                </div>
            )}
        </div>
    );
}
