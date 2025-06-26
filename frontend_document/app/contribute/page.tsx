import Footer from "@/layout/Footer";
import Header from "@/layout/Header";
import ContributeForm from "@/components/ui/Contribute/ContributeForm";
import RecentContributions from "@/components/ui/Contribute/RecentContributions";
import ContributeFAQ from "@/components/ui/Contribute/ContributeFAQ";

export default async function ContributePage() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Đóng góp tài liệu
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Chia sẻ tài liệu học tập của bạn để giúp đỡ cộng đồng sinh viên.
                            Mỗi tài liệu bạn đóng góp sẽ là nguồn kiến thức quý báu cho những người khác.
                        </p>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-2xl font-bold text-gray-900">1,234</p>
                                    <p className="text-sm text-gray-600">Tài liệu đã chia sẻ</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <div className="flex items-center">
                                <div className="p-3 bg-green-100 rounded-full">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-2xl font-bold text-gray-900">567</p>
                                    <p className="text-sm text-gray-600">Người đóng góp</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <div className="flex items-center">
                                <div className="p-3 bg-purple-100 rounded-full">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-2xl font-bold text-gray-900">89</p>
                                    <p className="text-sm text-gray-600">Môn học</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contribute Form */}
                    <ContributeForm />

                    {/* Recent Contributions */}
                    <div className="mt-12">
                        <RecentContributions />
                    </div>

                    {/* FAQ Section */}
                    <div className="mt-12">
                        <ContributeFAQ />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}