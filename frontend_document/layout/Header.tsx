'use client';
import Image from 'next/image';
import Menu from '@/components/ui/Menu/Menu';
import MenuMobile from '@/components/ui/Menu/MenuMobile';
import NavigationLink from '@/components/ui/Navigation/NavigationLink';
import { IUserResponse } from '@/types/user';
import {
    getMe

} from '@/actions/user.action';
import React, { useEffect } from 'react';
import MenuProfile from '@/components/ui/Menu/MenuProfile';

import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';

const Header = () => {
    const [user, setUser] = React.useState<IUserResponse>();
    const [islogin, setIsLogin] = React.useState<boolean>(false);
    const [showProfileMenu, setShowProfileMenu] = React.useState<boolean>(false);

    useEffect(() => {
        const fetchUser = async () => {
            const userData = await getMe();
            setUser(userData.data);
            if (userData.status === 200)
                setIsLogin(true);
            else
                setIsLogin(false);
        };
        fetchUser();
    }, [])
    return (
        <header className="sticky top-0 z-40 backdrop-blur-sm">
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

                    {islogin ? (
                        <div className="flex items-center space-x-4 relative">
                            <span className="text-base font-medium uppercase">{user?.username}</span>
                            <button
                                onClick={() => setShowProfileMenu((prev) => !prev)}
                                className="flex flex-col items-center focus:outline-none"
                            >
                                <Avatar size={60} icon={<UserOutlined />} />
                            </button>
                            {showProfileMenu && (
                                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50">
                                    <MenuProfile />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <div className="md:hidden">
                                <MenuMobile />
                            </div>
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
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;