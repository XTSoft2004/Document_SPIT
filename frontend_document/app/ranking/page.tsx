import Footer from "@/layout/Footer";
import Header from "@/layout/Header";
import RankingPageClient from "@/components/ui/Ranking/RankingPageClient";

export default function RankingPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium mb-4">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            Bảng xếp hạng đóng góp
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            🏆 Bảng xếp hạng
                            <span className="ml-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Contributors
                            </span>
                        </h1>
                        
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Chúc mừng những người đóng góp tích cực nhất cho hệ thống tài liệu!
                            Cảm ơn bạn đã chia sẻ kiến thức và giúp đỡ cộng đồng sinh viên.
                        </p>
                    </div>

                    {/* Ranking Content */}
                    <RankingPageClient />
                </div>
            </main>
            <Footer />
        </div>
    );
}