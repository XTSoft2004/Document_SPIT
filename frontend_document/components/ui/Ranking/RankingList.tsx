'use client'
import { IRanking } from "@/types/statistical";
import RankingCard from "./RankingCard";

interface RankingListProps {
    rankings: IRanking[];
}

export default function RankingList({ rankings }: RankingListProps) {
    const topThree = rankings.slice(0, 3);
    const remaining = rankings.slice(3);

    return (
        <div className="space-y-8">
            {/* Top 3 Podium */}
            {topThree.length > 0 && (
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">🏆 Top 3 Contributors</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {topThree.map((ranking, index) => (
                            <div key={ranking.fullname} className={`${index === 0 ? 'md:order-2' : index === 1 ? 'md:order-1' : 'md:order-3'}`}>
                                <RankingCard ranking={ranking} position={index + 1} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Remaining Rankings */}
            {remaining.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Bảng xếp hạng</h2>
                    <div className="space-y-4">
                        {remaining.map((ranking, index) => (
                            <RankingCard 
                                key={ranking.fullname} 
                                ranking={ranking} 
                                position={index + 4} 
                            />
                        ))}
                    </div>
                </div>
            )}

            {rankings.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
