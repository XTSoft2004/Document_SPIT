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
        {
            key: 'ranking',
            label: 'Bảng xếp hạng',
            icon: <span className="text-xl"><i className="anticon anticon-trophy"><svg viewBox="64 64 896 896" focusable="false" className="" data-icon="trophy" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M908 312h-68.2c-4.4-36.6-16.7-70.7-35.7-100.2-2.9-4.5-7.9-7.2-13.2-7.2H232.1c-5.3 0-10.3 2.7-13.2 7.2-19 29.5-31.3 63.6-35.7 100.2H116c-4.4 0-8 3.6-8 8v56c0 110.2 89.8 200 200 200 9.1 0 18.1-.7 27-2.1 31.1 38.7 76.2 65.2 127 69.5V792H376c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h272c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H554v-148.6c50.8-4.3 95.9-30.8 127-69.5 8.9 1.4 17.9 2.1 27 2.1 110.2 0 200-89.8 200-200v-56c0-4.4-3.6-8-8-8zm-728 64v-40h56.2c-2.1 13.1-3.2 26.7-3.2 40.5 0 53.7 17.6 103.3 47.3 142.7C186.2 504.2 180 482.7 180 464zm332 184c-97.2 0-176-78.8-176-176 0-97.2 78.8-176 176-176s176 78.8 176 176c0 97.2-78.8 176-176 176zm332-184c0 18.7-6.2 40.2-23.5 56.2 29.7-39.4 47.3-89 47.3-142.7 0-13.8-1.1-27.4-3.2-40.5H908v40z"></path></svg></i></span>
        }
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
