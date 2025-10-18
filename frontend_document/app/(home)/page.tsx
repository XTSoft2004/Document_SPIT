'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getRecentDocuments } from '@/actions/document.actions'
import { IDocumentRecentResponse } from '@/types/document'
import { useTreeData } from '@/hooks/useTreeData'
import convertSlug from '@/utils/convertSlug'
import { IDriveResponse } from '@/types/driver'

export default function PageHome() {
  const router = useRouter()
  const [doc, setDoc] = useState<IDocumentRecentResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const { data } = useTreeData()

  const findPathRecursive = (
    nodes: IDriveResponse[],
    targetId: string,
    currentPath: string[] = [],
  ): string[] | null => {
    for (const node of nodes) {
      const newPath = [...currentPath, convertSlug(node.name)]
      if (node.folderId === targetId) {
        return newPath
      }

      if (node.children && node.children.length > 0) {
        const result = findPathRecursive(node.children, targetId, newPath)
        if (result) {
          return result
        }
      }
    }
    return null
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const response = await getRecentDocuments(3)
      if (response.ok) {
        setDoc(response.data)
        console.log(response.data)
      }
      setTimeout(() => {
        setIsLoading(false)
      }, 300)
    }
    fetchData()
  }, [])

  const findPath = (item: IDocumentRecentResponse) => {
    const foundPath = findPathRecursive(data ?? [], item.folderId)
    const path =
      foundPath && `/document/${foundPath.slice(0, foundPath.length).join('/')}`

    return path
  }

  const handleItemClick = (item: IDocumentRecentResponse) => {
    const path = findPath(item) ?? `/document/${convertSlug(item.name)}`
    router.push(path)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section - Flex grow để chiếm không gian còn lại */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden py-8 sm:py-12 lg:py-16">
        {/* Background Animation Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 sm:top-40 -right-16 sm:-right-32 w-48 sm:w-96 h-48 sm:h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 sm:-bottom-40 -left-16 sm:-left-32 w-48 sm:w-96 h-48 sm:h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 sm:w-64 h-32 sm:h-64 bg-gradient-to-br from-indigo-400/10 to-blue-400/10 rounded-full blur-2xl animate-bounce"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-4 sm:space-y-6 order-1 lg:order-1">
              <div className="space-y-3 sm:space-y-4">
                <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                  Hệ thống quản lý tài liệu
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Document
                  <span className="block sm:inline sm:ml-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    SPIT
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                  Tìm kiếm tài liệu một cách dễ dàng. Hệ thống hiện đại với giao
                  diện thân thiện, giúp bạn truy cập thông tin nhanh chóng và
                  hiệu quả.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start max-w-md mx-auto lg:mx-0">
                <button
                  onClick={() => router.push('/document')}
                  className="group relative w-full sm:w-auto"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
                  <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 sm:px-6 py-3 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3">
                    <span>Xem tài liệu</span>
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </button>

                <button
                  onClick={() => router.push('/contribute')}
                  className="group bg-white text-gray-700 px-4 sm:px-6 py-3 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base border-2 border-gray-200 hover:border-pink-400 hover:text-pink-700 transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500 group-hover:text-pink-700 transition-colors duration-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span>Đóng góp tài liệu</span>
                </button>
              </div>
            </div>

            {/* Right Visual - Responsive */}
            <div className="relative order-2 lg:order-2 mb-8 lg:mb-0">
              <div className="relative z-10">
                {/* Main Card - Responsive */}
                <div
                  className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20 mx-4 sm:mx-0 transform scale-95 opacity-0 animate-slide-up"
                  style={{
                    animationDelay: '0ms',
                    animationFillMode: 'forwards',
                  }}
                >
                  <div className="space-y-3 sm:space-y-4">
                    {/* Header */}
                    <div
                      className="flex items-center gap-2 sm:gap-3 transform translate-y-4 opacity-0 animate-slide-up"
                      style={{
                        animationDelay: '100ms',
                        animationFillMode: 'forwards',
                      }}
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-gray-900">
                          Tài liệu mới nhất
                        </h3>
                      </div>
                    </div>

                    {/* Document Preview - Responsive */}
                    <div className="space-y-2 min-h-[132px] sm:min-h-[156px]">
                      {isLoading ? (
                        [...Array(3)].map((_, index) => (
                          <div
                            key={index}
                            className={`flex items-center gap-2 sm:gap-3 p-2 bg-gray-100 rounded-lg sm:rounded-xl transform translate-y-4 opacity-0 animate-slide-up h-10 sm:h-12`}
                            style={{
                              animationDelay: `${index * 100}ms`,
                              animationFillMode: 'forwards',
                            }}
                          >
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded-md sm:rounded-lg animate-shimmer"></div>
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="h-3 bg-gray-300 rounded animate-shimmer"></div>
                              <div className="h-2 bg-gray-200 rounded w-3/4 animate-shimmer"></div>
                            </div>
                          </div>
                        ))
                      ) : doc.length === 0 ? (
                        <div className="flex items-center justify-center h-32 sm:h-36">
                          <div
                            className="text-center transform translate-y-4 opacity-0 animate-slide-up"
                            style={{
                              animationDelay: '100ms',
                              animationFillMode: 'forwards',
                            }}
                          >
                            <svg
                              className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            <p className="text-xs sm:text-sm text-gray-500">
                              Không có tài liệu nào được cập nhật
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          {doc.slice(0, 3).map((item, index) => (
                            <div
                              key={item.id}
                              className={`flex items-center gap-2 sm:gap-3 p-2 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-blue-50 transition-all duration-500 group cursor-pointer transform translate-y-4 opacity-0 animate-slide-up h-10 sm:h-12`}
                              style={{
                                animationDelay: `${index * 200}ms`,
                                animationFillMode: 'forwards',
                              }}
                              onClick={() => handleItemClick(item)}
                            >
                              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg
                                  className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs sm:text-sm font-bold text-blue-700 truncate">
                                  {item.name}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-400 truncate">
                                  Môn học: {item.courseName}
                                </div>
                              </div>
                              <div className="w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                          ))}
                          {doc.length < 3 &&
                            [...Array(3 - doc.length)].map((_, index) => (
                              <div
                                key={`placeholder-${index}`}
                                className="h-10 sm:h-12"
                              ></div>
                            ))}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Floating Elements - Responsive */}
                <div className="absolute -top-2 sm:-top-3 -right-2 sm:-right-3 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl sm:rounded-2xl shadow-lg animate-bounce delay-500 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 sm:w-6 sm:h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>

                <div className="absolute -bottom-2 sm:-bottom-3 -left-2 sm:-left-3 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg sm:rounded-xl shadow-lg animate-pulse flex items-center justify-center">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
