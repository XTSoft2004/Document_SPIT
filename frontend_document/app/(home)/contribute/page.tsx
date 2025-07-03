import Footer from "@/layout/Footer";
import Header from "@/layout/Header";
import ContributeForm from "@/components/ui/Contribute/ContributeForm";
import RecentContributions from "@/components/ui/Contribute/RecentContributions";
import ContributeFAQ from "@/components/ui/Contribute/ContributeFAQ";

export default async function ContributePage() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <main className="flex-1 w-full">
                {/* Hero Section with responsive padding */}
                <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
                    <div className="max-w-6xl mx-auto">
                        {/* Header Section with mobile-first responsive design */}
                        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                            {/* Badge for larger screens */}
                            <div className="hidden sm:inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium mb-4 transition-all duration-300 hover:scale-105 hover:shadow-md">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                                Đóng góp tài liệu học tập
                            </div>

                            {/* Main title with responsive text sizing */}
                            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                                <span className="block sm:inline">📚 Đóng góp</span>
                                <span className="block sm:inline sm:ml-2 lg:ml-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    tài liệu
                                </span>
                            </h1>

                            {/* Description with responsive text and spacing */}
                            <div className="mt-4 sm:mt-6 lg:mt-8">
                                <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-xs sm:max-w-2xl lg:max-w-4xl mx-auto leading-relaxed px-2 sm:px-0">
                                    <span className="hidden sm:inline">
                                        Chia sẻ tài liệu học tập của bạn để giúp đỡ cộng đồng sinh viên.
                                        Mỗi tài liệu bạn đóng góp sẽ là nguồn kiến thức quý báu cho những người khác.
                                    </span>
                                    <span className="sm:hidden">
                                        Chia sẻ tài liệu học tập để giúp đỡ cộng đồng sinh viên.
                                        Mỗi tài liệu đóng góp là nguồn kiến thức quý báu.
                                    </span>
                                </p>
                            </div>

                            {/* Call to action for mobile */}
                            <div className="mt-6 sm:hidden">
                                <div className="inline-flex items-center px-3 py-1.5 bg-blue-500/10 text-blue-700 rounded-full text-xs font-medium">
                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                    Đóng góp tài liệu
                                </div>
                            </div>
                        </div>

                        {/* Stats Section with improved responsive grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                            {/* Documents Shared Card */}
                            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:scale-[1.02] group">
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                    <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300 flex-shrink-0">
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-lg sm:text-xl font-bold text-gray-900 mb-0.5">1,234</p>
                                        <p className="text-xs sm:text-sm text-gray-600 font-medium">
                                            Tài liệu đã chia sẻ
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Contributors Card */}
                            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:scale-[1.02] group">
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                    <div className="p-2 bg-gradient-to-br from-green-100 to-green-200 rounded-lg group-hover:from-green-200 group-hover:to-green-300 transition-all duration-300 flex-shrink-0">
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-lg sm:text-xl font-bold text-gray-900 mb-0.5">567</p>
                                        <p className="text-xs sm:text-sm text-gray-600 font-medium">
                                            Người đóng góp
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Subjects Card */}
                            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:scale-[1.02] group">
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                    <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-300 flex-shrink-0">
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                        </svg>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-lg sm:text-xl font-bold text-gray-900 mb-0.5">89</p>
                                        <p className="text-xs sm:text-sm text-gray-600 font-medium">
                                            Môn học
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contribute Form with responsive wrapper */}
                        <div className="w-full mb-8 sm:mb-12">
                            <ContributeForm />
                        </div>

                        {/* Recent Contributions with responsive spacing */}
                        <div className="w-full mb-8 sm:mb-12">
                            <RecentContributions />
                        </div>

                        {/* FAQ Section with responsive spacing */}
                        <div className="w-full">
                            <ContributeFAQ />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}