import RankingPageClient from "@/components/ui/Ranking/RankingPageClient";

export default function RankingPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <main className="flex-1 w-full">
                {/* Hero Section with responsive padding */}
                <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
                    <div className="max-w-7xl mx-auto">
                        {/* Header Section with mobile-first responsive design */}
                        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                            {/* Badge with responsive sizing */}
                            <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4 transition-all duration-300 hover:scale-105 hover:shadow-md">
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                                <span className="hidden xs:inline">Bảng xếp hạng đóng góp</span>
                                <span className="xs:hidden">Xếp hạng</span>
                            </div>

                            {/* Main title with responsive text sizing and spacing */}
                            <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                                <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                    <span className="block sm:inline">🏆 Bảng xếp hạng</span>
                                    <span className="block sm:inline sm:ml-2 lg:ml-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                        đóng góp
                                    </span>
                                </h1>
                            </div>

                            {/* Description with responsive text and spacing */}
                            <div className="mt-4 sm:mt-6 lg:mt-8">
                                <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-xs sm:max-w-2xl lg:max-w-4xl mx-auto leading-relaxed px-2 sm:px-0">
                                    <span className="hidden sm:inline">
                                        Chúc mừng những người đóng góp tích cực nhất cho hệ thống tài liệu!
                                        Cảm ơn bạn đã chia sẻ kiến thức và giúp đỡ cộng đồng sinh viên.
                                    </span>
                                    <span className="sm:hidden">
                                        Chúc mừng những người đóng góp tích cực nhất!
                                        Cảm ơn bạn đã chia sẻ kiến thức với cộng đồng.
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Ranking Content with responsive container */}
                        <div className="w-full">
                            <RankingPageClient />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}