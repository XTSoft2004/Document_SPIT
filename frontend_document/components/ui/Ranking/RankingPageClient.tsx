'use client'
import { IRanking } from "@/types/statistical";
import { getRanking } from "@/actions/statistical.actions";
import { useEffect, useState } from "react";
import RankingList from "./RankingList";
import Loading from "@/components/ui/Loading/Loading1";

export default function RankingPageClient() {
    const [rankings, setRankings] = useState<IRanking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                setLoading(true);
                const response = await getRanking();
                setRankings(response.data);
            } catch (err) {
                setError('Có lỗi xảy ra khi tải dữ liệu');
                console.error('Error fetching rankings:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRankings();
    }, []);

    const totalContributors = rankings.length;
    const totalDocuments = rankings.reduce((sum, ranking) => sum + ranking.totalUpload, 0);
    const topContributor = rankings.length > 0 ? rankings[0].totalUpload : 0;
    const averagePerUser = totalContributors > 0 ? Math.round(totalDocuments / totalContributors) : 0;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12 sm:py-16 lg:py-20">
                <Loading onLoadingComplete={() => { }} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-12 sm:py-16 lg:py-20">
                <div className="text-center px-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">{error}</h3>
                    <p className="text-sm sm:text-base text-gray-500">Vui lòng thử lại sau</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 sm:space-y-8 lg:space-y-10">
            {/* Updated Stats with responsive grid and real data */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {/* Total Contributors Card */}
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-center">
                        <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex-shrink-0">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">{totalContributors}</p>
                            <p className="text-xs sm:text-sm text-gray-600">
                                <span className="hidden sm:inline">Tổng người đóng góp</span>
                                <span className="sm:hidden">Người đóng góp</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Total Documents Card */}
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-center">
                        <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg sm:rounded-xl flex-shrink-0">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">{totalDocuments}</p>
                            <p className="text-xs sm:text-sm text-gray-600">
                                <span className="hidden sm:inline">Tổng tài liệu</span>
                                <span className="sm:hidden">Tài liệu</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Top Contributor Card */}
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-center">
                        <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl flex-shrink-0">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">{topContributor}</p>
                            <p className="text-xs sm:text-sm text-gray-600">
                                <span className="hidden sm:inline">Người đóng góp nhiều nhất</span>
                                <span className="sm:hidden">Nhiều nhất</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rankings List with responsive wrapper */}
            <div className="w-full overflow-hidden">
                <RankingList rankings={rankings} />
            </div>
        </div>
    );
}
