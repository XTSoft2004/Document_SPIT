import Link from 'next/link';
import { ArrowLeft, User } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="text-center max-w-md mx-auto px-4">
                <div className="mb-8">
                    <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
                        <User className="w-12 h-12 text-blue-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                        Không tìm thấy người dùng
                    </h2>
                    <p className="text-gray-600 mb-8">
                        Người dùng này không tồn tại hoặc đã ẩn profile của họ.
                    </p>
                </div>
                
                <div className="space-y-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Về trang chủ
                    </Link>
                </div>
            </div>
        </div>
    );
}
