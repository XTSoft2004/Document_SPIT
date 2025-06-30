'use client'
import { IRanking } from "@/types/statistical";

interface RankingCardProps {
    ranking: IRanking;
    position: number;
}

export default function RankingCard({ ranking, position }: RankingCardProps) {
    const getMedalIcon = (pos: number) => {
        const baseClasses = "w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center shadow-lg flex-shrink-0";
        const iconClasses = "w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white";
        const textClasses = "text-white font-bold text-sm sm:text-base lg:text-lg";

        switch (pos) {
            case 1:
                return (
                    <div className={`${baseClasses} bg-gradient-to-br from-yellow-400 to-yellow-600`}>
                        <svg className={iconClasses} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                    </div>
                );
            case 2:
                return (
                    <div className={`${baseClasses} bg-gradient-to-br from-gray-400 to-gray-600`}>
                        <svg className={iconClasses} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                    </div>
                );
            case 3:
                return (
                    <div className={`${baseClasses} bg-gradient-to-br from-orange-400 to-orange-600`}>
                        <svg className={iconClasses} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                    </div>
                );
            default:
                return (
                    <div className={`${baseClasses} bg-gradient-to-br from-blue-500 to-purple-600`}>
                        <span className={textClasses}>#{pos}</span>
                    </div>
                );
        }
    };

    const getCardStyle = (pos: number) => {
        const baseClasses = "border-2 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]";
        switch (pos) {
            case 1:
                return `${baseClasses} bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300 shadow-xl hover:shadow-2xl`;
            case 2:
                return `${baseClasses} bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300 shadow-lg hover:shadow-xl`;
            case 3:
                return `${baseClasses} bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300 shadow-lg hover:shadow-xl`;
            default:
                return `${baseClasses} bg-white border-gray-200 shadow-md hover:shadow-lg`;
        }
    };

    return (
        <div className={`${getCardStyle(position)} p-4 sm:p-5 lg:p-6`}>
            <div className="flex items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    {getMedalIcon(position)}
                    <div className="min-w-0 flex-1">
                        <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 truncate">
                            {ranking.fullname}
                        </h3>
                    </div>
                </div>

                <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 sm:gap-2 justify-end">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{ranking.totalUpload}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500">
                        <span className="inline">tài liệu</span>
                    </p>
                </div>
            </div>

            {position <= 3 && (
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-600">
                            <span className="hidden sm:inline">Top contributor</span>
                            <span className="sm:hidden">Top</span>
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
