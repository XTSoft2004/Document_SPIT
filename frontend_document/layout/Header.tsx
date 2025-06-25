'use client';
import Image from 'next/image';
import Menu from '@/components/ui/Menu/Menu';
import MenuMobile from '@/components/ui/Menu/MenuMobile';
import NavigationLink from '@/components/ui/Navigation/NavigationLink';

const Header = () => {
    return (
        <header className="sticky top-0 z-40 border-b border-white/20 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo bên trái */}
                    <div className="flex items-center">
                        <NavigationLink href="/" className="flex items-center">
                            <Image
                                src="/logo/logo-500x500.png"
                                alt="Logo"
                                width={60}
                                height={60}
                                className="rounded-lg"
                                priority
                            />
                        </NavigationLink>
                    </div>

                    {/* Navigation chính giữa */}
                    <div className="hidden md:flex items-center">
                        <Menu />
                    </div>

                    {/* Auth buttons bên phải */}
                    <div className="flex items-center space-x-4">
                        {/* Mobile Menu - hiện ở mobile */}
                        <div className="md:hidden">
                            <MenuMobile />
                        </div>

                        {/* Login Button - chỉ hiện ở desktop */}
                        <div className="hidden md:inline-flex relative items-center justify-center gap-4 group">
                            <div className="absolute inset-0 duration-1000 opacity-50 transition-all bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-xl blur-lg filter group-hover:opacity-75 group-hover:duration-200" />
                            <NavigationLink href="/auth" className="group relative inline-flex items-center justify-center text-base rounded-xl bg-white px-8 py-2 font-semibold text-gray-900 transition-all duration-200 hover:bg-gray-50 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-gray-300/30 border border-gray-200">
                                Login
                                <svg aria-hidden="true" viewBox="0 0 10 10" height={10} width={10} fill="none" className="mt-0.5 ml-2 -mr-1 stroke-gray-900 stroke-2">
                                    <path d="M0 5h7" className="transition opacity-0 group-hover:opacity-100" />
                                    <path d="M1 1l4 4-4 4" className="transition group-hover:translate-x-[3px]" />
                                </svg>
                            </NavigationLink>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;