import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
    return (
        <header className="bg-white sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo bên trái */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center">
                            <Image
                                src="/logo/logo-500x500.png"
                                alt="Logo"
                                width={40}
                                height={40}
                                className="rounded-lg"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Navigation chính giữa */}
                    <nav className="hidden md:flex items-center space-x-1">
                        <Link
                            href="/"
                            className="relative group px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-all duration-300 ease-in-out"
                        >
                            <span className="relative z-10">Trang chủ</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition-all duration-300"></div>
                            <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-700 group-hover:w-full group-hover:left-0 transition-all duration-300"></div>
                        </Link>
                        <Link
                            href="/document"
                            className="relative group px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-all duration-300 ease-in-out"
                        >
                            <span className="relative z-10">Tài liệu</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition-all duration-300"></div>
                            <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-700 group-hover:w-full group-hover:left-0 transition-all duration-300"></div>
                        </Link>
                        <Link
                            href="/contribute"
                            className="relative group px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-all duration-300 ease-in-out"
                        >
                            <span className="relative z-10">Đóng góp</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition-all duration-300"></div>
                            <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-700 group-hover:w-full group-hover:left-0 transition-all duration-300"></div>
                        </Link>
                    </nav>

                    {/* Auth buttons bên phải */}
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/auth"
                            className="relative inline-flex items-center px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-full shadow-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out"
                        >
                            <span className="relative z-10">Đăng nhập</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            type="button"
                            className="text-gray-700 hover:text-blue-600 p-2"
                            aria-label="Menu"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;