'use cl        <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 text-white py-6 mt-auto")ent';

import Image from 'next/image';
import NavigationLink from '@/components/ui/Navigation/NavigationLink';

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

                    <div className="flex justify-center">
                        <div className="flex flex-wrap justify-center gap-4 text-sm">
                            <NavigationLink href="/document" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                                Tài liệu
                            </NavigationLink>
                            <NavigationLink href="/contribute" className="text-gray-300 hover:text-purple-400 transition-colors duration-200">
                                Đóng góp
                            </NavigationLink>
                        </div>
                    </div>

                    <div className="text-center md:text-right space-y-2">
                        <div className="flex justify-center md:justify-end space-x-3">
                            <a
                                href="https://www.facebook.com/clbhtlt.ithusc/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
                            >
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                        </div>
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