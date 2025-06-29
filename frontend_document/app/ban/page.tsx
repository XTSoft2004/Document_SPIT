export default function BannedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-center border border-red-100 relative">
                {/* Icon */}
                <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636 5.636 18.364" />
                    </svg>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    Tài khoản bị khóa
                </h1>

                {/* Description */}
                <p className="text-sm sm:text-base text-gray-600 mb-6 leading-relaxed">
                    Tài khoản của bạn đã bị khóa do vi phạm quy định của hệ thống.
                    Vui lòng liên hệ với quản trị viên để biết thêm chi tiết.
                </p>

                {/* Warning Box */}
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-semibold text-red-800">Lý do khóa</p>
                            <p className="text-xs text-red-600">Vi phạm quy định sử dụng hệ thống</p>
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-3">
                    <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">Liên hệ hỗ trợ</span>
                        </div>
                        <p className="text-sm text-gray-600">admin@husc.edu.vn</p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">Hotline</span>
                        </div>
                        <p className="text-sm text-gray-600">024 3555 2008</p>
                    </div>
                </div>

                {/* Animation Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-red-200 rounded-full opacity-60 animate-ping"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-orange-200 rounded-full opacity-60 animate-ping delay-1000"></div>
            </div>
        </div>
    );
}