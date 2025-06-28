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
            <div className="min-h-screen flex items-center justify-center">
                <Loading onLoadingComplete={() => {}} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
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
        <div className="space-y-8">
            {/* Updated Stats with real data */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-2xl font-bold text-gray-900">{totalContributors}</p>
                            <p className="text-sm text-gray-600">Tổng người đóng góp</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center">
                        <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-2xl font-bold text-gray-900">{totalDocuments}</p>
                            <p className="text-sm text-gray-600">Tổng tài liệu</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center">
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-2xl font-bold text-gray-900">{topContributor}</p>
                            <p className="text-sm text-gray-600">Người đóng góp nhiều nhất</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center">
                        <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-2xl font-bold text-gray-900">{averagePerUser}</p>
                            <p className="text-sm text-gray-600">Trung bình/người</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rankings List */}
            <RankingList rankings={rankings} />
        </div>
    );
}
