'use client';

import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-white py-6 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    {/* Left: Logo & Brand */}
                    <div className="flex items-center justify-center md:justify-start gap-3">
                        <Image
                            src="/logo/logo-500x500.png"
                            alt="Logo"
                            width={32}
                            height={32}
                            className="rounded-full object-cover"
                        />
                        <div>
                            <h3 className="font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Document SPIT
                            </h3>
                            <p className="text-xs text-gray-400">Hệ thống quản lý tài liệu</p>
                        </div>
                    </div>

                    {/* Center: Quick Links */}
                    <div className="flex justify-center">
                        <div className="flex flex-wrap justify-center gap-4 text-sm">
                            <Link href="/document" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                                Tài liệu
                            </Link>
                            <Link href="/contribute" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                                Đóng góp
                            </Link>
                        </div>
                    </div>

                    {/* Right: Copyright */}
                    <div className="text-center md:text-right">
                        <p className="text-xs text-gray-400">
                            © 2025 SPIT TEAM.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;