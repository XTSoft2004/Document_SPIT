'use client'
import { IRanking } from "@/types/statistical";

interface RankingCardProps {
    ranking: IRanking;
    position: number;
}

export default function RankingCard({ ranking, position }: RankingCardProps) {
    const getMedalIcon = (pos: number) => {
        switch (pos) {
            case 1:
                return (
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                    </div>
                );
            case 2:
                return (
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                    </div>
                );
            case 3:
                return (
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                    </div>
                );
            default:
                return (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">#{pos}</span>
                    </div>
                );
        }
    };

    const getCardStyle = (pos: number) => {
        switch (pos) {
            case 1:
                return "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300 shadow-xl";
            case 2:
                return "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300 shadow-lg";
            case 3:
                return "bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300 shadow-lg";
            default:
                return "bg-white border-gray-200 shadow-md hover:shadow-lg";
        }
    };

    return (
        <div className={`${getCardStyle(position)} border-2 rounded-2xl p-6 transition-all duration-300 hover:scale-105`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {getMedalIcon(position)}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">
                            {ranking.fullname}
                        </h3>
                        <p className="text-sm text-gray-600">
                            Người đóng góp
                        </p>
                    </div>
                </div>
                
                <div className="text-right">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-2xl font-bold text-gray-900">{ranking.totalUpload}</span>
                    </div>
                    <p className="text-sm text-gray-500">tài liệu</p>
                </div>
            </div>
            
            {position <= 3 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span className="text-gray-600">Top contributor</span>
                    </div>
                </div>
            )}
        </div>
    );
}
