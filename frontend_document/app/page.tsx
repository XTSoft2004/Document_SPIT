'use client'
import Header from "@/layout/Header";
import Footer from "@/layout/Footer";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getRecentDocuments } from "@/actions/document.actions";
import { IDocumentRecentResponse } from "@/types/document";

export default function Home() {
  const router = useRouter();
  const [doc, setDoc] = useState<IDocumentRecentResponse[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getRecentDocuments(3);
      if (response.ok) {
        setDoc(response.data);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* <Loading isVisible={true} duration={2000} /> */}
      <Header />

      {/* Hero Section - Flex grow để chiếm không gian còn lại */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Background Animation Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-indigo-400/10 to-blue-400/10 rounded-full blur-2xl animate-bounce"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">

            {/* Left Content */}
            <div className="text-center lg:text-left space-y-6">
              <div className="space-y-4">
                <div className="mt-5 inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                  Hệ thống quản lý tài liệu
                </div>

                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
                  Document
                  <span className="ml-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    SPIT
                  </span>
                </h1>

                <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
                  Tìm kiếm tài liệu một cách dễ dàng.
                  Hệ thống hiện đại với giao diện thân thiện, giúp bạn truy cập
                  thông tin nhanh chóng và hiệu quả.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button onClick={() => router.push('/document')} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
                  <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold text-base shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3">
                    <span>Xem tài liệu</span>
                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </button>

                <button onClick={() => router.push('/contribute')} className="group bg-white text-gray-700 px-6 py-3 rounded-2xl font-semibold text-base border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-6-10h8m-7 14h6" />
                  </svg>
                  <span>Đóng góp tài liệu</span>
                </button>
              </div>
            </div>

            {/* Right Visual - Compact hơn */}
            <div className="relative">
              <div className="relative z-10 mb-5">
                {/* Main Card - Nhỏ gọn hơn */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Tài liệu mới nhất</h3>
                      </div>
                    </div>

                    {/* Document Preview - Ít item hơn */}
                    <div className="space-y-2">
                      {doc.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors duration-300 group cursor-pointer" onClick={() => router.push('/document')}>
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-gray-900">{item.fileName}</div>
                            <div className="text-xs text-gray-500">
                              Cập nhật lúc:
                              <span className="ml-1">{new Date(item.modifiedDate).toLocaleString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                              })}</span>
                            </div>
                          </div>
                          <div className="w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating Elements - Nhỏ hơn */}
                <div className="absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg animate-bounce delay-500 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>

                <div className="absolute -bottom-3 -left-3 w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl shadow-lg animate-pulse flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

    </div >
  )
}
