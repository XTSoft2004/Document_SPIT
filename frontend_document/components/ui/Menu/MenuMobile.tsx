'use client';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { MenuOutlined, CloseOutlined, HomeOutlined, FolderOutlined, HeartOutlined } from '@ant-design/icons';
import { Drawer } from 'antd';
import NavigationLink from '@/components/ui/Navigation/NavigationLink';

const MenuMobile = () => {
    const pathname = usePathname();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const getActiveTab = () => {
        if (pathname === '/') return 'home';
        if (pathname.startsWith('/document')) return 'document';
        if (pathname.startsWith('/contribute')) return 'contribute';
        return 'home';
    };

    const handleNavigationClick = () => {
        setIsDrawerOpen(false);
    };

    const activeTab = getActiveTab();

    const menuItems = [
        {
            key: 'home',
            label: 'Trang chủ',
            icon: <HomeOutlined className="text-xl" />
        },
        {
            key: 'document',
            label: 'Tài liệu',
            icon: <FolderOutlined className="text-xl" />
        },
        {
            key: 'contribute',
            label: 'Đóng góp',
            icon: <HeartOutlined className="text-xl" />
        },
    ];

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsDrawerOpen(true)}
                className="md:hidden relative group"
            >
                <div className="absolute inset-0 duration-700 opacity-20 transition-all bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-xl blur-md filter group-hover:opacity-40 group-hover:duration-200 scale-110" />
                <div className="relative p-3 rounded-xl bg-white border border-gray-200/50 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-200 hover:bg-gray-50 hover:-translate-y-0.5">
                    <MenuOutlined className="text-gray-700 text-lg" />
                </div>
            </button>

            {/* Mobile Drawer */}
            <Drawer
                title={null}
                placement="right"
                closable={false}
                onClose={() => setIsDrawerOpen(false)}
                open={isDrawerOpen}
                width={320}
                className="mobile-menu-drawer"
                styles={{
                    body: {
                        padding: 0,
                        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    },
                }}
            >
                {/* Custom Header */}
                <div className="relative p-6 bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-sm border-b border-gray-200/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold text-gray-800">Menu</h3>
                        </div>
                        <button
                            onClick={() => setIsDrawerOpen(false)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        >
                            <CloseOutlined className="text-gray-500 text-lg" />
                        </button>
                    </div>
                </div>

                {/* Menu Content */}
                <div className="p-6 space-y-4">
                    {/* Navigation Items */}
                    <div className="space-y-3">
                        {menuItems.map((item) => (
                            <NavigationLink
                                key={item.key}
                                href={item.key === 'home' ? '/' : `/${item.key}`}
                                onClick={handleNavigationClick}
                                className={`
                                    group relative w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left transition-all duration-200 hover:scale-[1.01]
                                    ${activeTab === item.key
                                        ? 'bg-gradient-to-r from-blue-500/80 to-purple-600/80 text-white shadow-lg border border-blue-400/30'
                                        : 'bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-md border border-gray-200/50'
                                    }
                                `}
                            >
                                <div className={`transition-all duration-200 ${activeTab === item.key ? 'scale-110' : 'group-hover:scale-105'
                                    }`}>
                                    {item.icon}
                                </div>
                                <span className={`font-semibold transition-colors duration-200 ${activeTab === item.key
                                    ? 'text-white'
                                    : 'text-gray-800 group-hover:text-blue-600'
                                    }`}>
                                    {item.label}
                                </span>
                                {activeTab === item.key && (
                                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                                )}
                            </NavigationLink>
                        ))}
                    </div>

                    {/* Login Button */}
                    <div className="mt-6">
                        <div className="relative group">
                            <div className="absolute inset-0 duration-1000 opacity-30 transition-all bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-xl blur-lg filter group-hover:opacity-50 group-hover:duration-200" />
                            <NavigationLink
                                href="/auth"
                                onClick={handleNavigationClick}
                                className="group relative inline-flex items-center justify-center w-full text-base rounded-xl bg-white px-6 py-3 font-semibold text-gray-900 transition-all duration-200 hover:bg-gray-50 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-gray-300/30 border border-gray-200"
                            >
                                <span>Login</span>
                                <svg aria-hidden="true" viewBox="0 0 10 10" height={12} width={12} fill="none" className="mt-0.5 ml-2 -mr-1 stroke-gray-900 stroke-2">
                                    <path d="M0 5h7" className="transition opacity-0 group-hover:opacity-100" />
                                    <path d="M1 1l4 4-4 4" className="transition group-hover:translate-x-[3px]" />
                                </svg>
                            </NavigationLink>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white/95 to-transparent backdrop-blur-sm border-t border-gray-200/50">
                    <p className="text-center text-sm text-gray-500 font-medium">
                        © 2025 SPIT TEAM
                    </p>
                </div>
            </Drawer>

            <style jsx global>{`
                .mobile-menu-drawer .ant-drawer-content-wrapper {
                    box-shadow: -10px 0 25px -5px rgba(0, 0, 0, 0.1), -4px 0 10px -6px rgba(0, 0, 0, 0.1);
                }
                
                .mobile-menu-drawer .ant-drawer-body {
                    position: relative;
                    overflow: hidden;
                }
                
                .mobile-menu-drawer .ant-drawer-body::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(147, 51, 234, 0.02) 100%);
                    pointer-events: none;
                }
            `}</style>
        </>
    );
};

export default MenuMobile;
