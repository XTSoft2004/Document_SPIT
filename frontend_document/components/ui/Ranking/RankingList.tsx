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
        <div className="space-y-6 sm:space-y-8 lg:space-y-10">
            {/* Top 3 Podium with responsive design */}
            {topThree.length > 0 && (
                <div className="mb-8 sm:mb-12">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 text-center mb-6 sm:mb-8">
                        🏆 <span className="hidden sm:inline">Top 3 Contributors</span>
                        <span className="sm:hidden">Top 3</span>
                    </h2>
                    
                    {/* Mobile: Vertical stack, Desktop: Podium layout */}
                    <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-3 sm:gap-4 lg:gap-6">
                        {/* Mobile: Show in order 1,2,3 */}
                        <div className="sm:hidden space-y-4">
                            {topThree.map((ranking, index) => (
                                <RankingCard key={ranking.fullname} ranking={ranking} position={index + 1} />
                            ))}
                        </div>
                        
                        {/* Desktop: Podium layout 2,1,3 */}
                        <div className="hidden sm:contents">
                            {topThree.map((ranking, index) => (
                                <div 
                                    key={ranking.fullname} 
                                    className={`${
                                        index === 0 ? 'md:order-2' : 
                                        index === 1 ? 'md:order-1' : 
                                        'md:order-3'
                                    }`}
                                >
                                    <RankingCard ranking={ranking} position={index + 1} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Remaining Rankings with responsive grid */}
            {remaining.length > 0 && (
                <div>
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                        <span className="hidden sm:inline">Bảng xếp hạng</span>
                        <span className="sm:hidden">Xếp hạng</span>
                    </h2>
                    <div className="space-y-3 sm:space-y-4">
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

            {/* Empty state with responsive design */}
            {rankings.length === 0 && (
                <div className="text-center py-8 sm:py-12 lg:py-16 px-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                        <span className="hidden sm:inline">Chưa có dữ liệu xếp hạng</span>
                        <span className="sm:hidden">Chưa có dữ liệu</span>
                    </h3>
                    <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
                        <span className="hidden sm:inline">Hãy trở thành người đầu tiên đóng góp tài liệu!</span>
                        <span className="sm:hidden">Hãy đóng góp tài liệu đầu tiên!</span>
                    </p>
                </div>
            )}
        </div>
    );
}
