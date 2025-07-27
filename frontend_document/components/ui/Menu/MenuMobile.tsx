'use client';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MenuOutlined, CloseOutlined, HomeOutlined, FolderOutlined, HeartOutlined, LogoutOutlined, LoginOutlined, UserOutlined } from '@ant-design/icons';
import { Drawer } from 'antd';
import NavigationLink from '@/components/ui/Navigation/NavigationLink';
import { useAuth } from '@/context/AuthContext';

interface MenuMobileProps {
    isLoggedIn?: boolean;
    onLogout?: () => void;
}

const MenuMobile = ({ isLoggedIn = false, onLogout }: MenuMobileProps) => {
    const pathname = usePathname();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [activeItem, setActiveItem] = useState<string | null>(null);
    const { getInfo } = useAuth();
    useEffect(() => {
        if (isDrawerOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isDrawerOpen]);

    const getActiveTab = () => {
        if (pathname === '/') return 'home';
        if (pathname.startsWith('/document')) return 'document';
        if (pathname.startsWith('/contribute')) return 'contribute';
        if (pathname.startsWith('/ranking')) return 'ranking';
        return 'home';
    };

    const handleNavigationClick = () => {
        setIsDrawerOpen(false);
    };

    const handleMenuItemClick = (itemKey: string) => {
        setActiveItem(itemKey);
        setTimeout(() => {
            setActiveItem(null);
            handleNavigationClick();
        }, 150);
    };

    const activeTab = getActiveTab();

    const menuItems = [
        // Conditionally add admin menu item if user is admin
        ...(getInfo()?.roleName === 'Admin'
            ? [{
                key: 'admin/dashboard',
                label: 'Quản trị',
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 0v4m0-4h4m-4 0H8m6 8H6a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2h-6z" />
                    </svg>
                )
            }]
            : []
        ),
        {
            key: 'profile',
            label: 'Hồ sơ',
            icon: <UserOutlined className="text-xl" />
        },
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
                className="md:hidden relative group active:scale-95 transition-transform duration-150"
            >
                <div className="absolute inset-0 duration-700 opacity-20 transition-all bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-xl blur-md filter group-hover:opacity-40 group-hover:duration-200 group-active:opacity-60 scale-110" />
                <div className="relative p-3 rounded-xl bg-white border border-gray-200/50 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-200 hover:bg-gray-50 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md">
                    <MenuOutlined className="text-gray-700 text-lg transition-transform duration-150 group-active:scale-95" />
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
                <div className={`relative p-6 bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-sm border-b border-gray-200/50 transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
                    }`} style={{ transitionDelay: '50ms' }}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold text-gray-800">Menu</h3>
                        </div>
                        <button
                            onClick={() => setIsDrawerOpen(false)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 active:scale-95 hover:rotate-90"
                        >
                            <CloseOutlined className="text-gray-500 text-lg transition-transform duration-200" />
                        </button>
                    </div>
                </div>

                {/* Menu Content */}
                <div className="p-6 space-y-4">
                    {/* Navigation Items */}
                    <div className="space-y-3">
                        {menuItems.map((item, index) => (
                            <div
                                key={item.key}
                                className={`transition-all duration-500 ease-out ${isVisible
                                    ? 'translate-x-0 opacity-100'
                                    : 'translate-x-8 opacity-0'
                                    }`}
                                style={{
                                    transitionDelay: `${100 + index * 75}ms`
                                }}
                            >
                                <NavigationLink
                                    href={item.key === 'home' ? '/' : `/${item.key}`}
                                    onClick={() => handleMenuItemClick(item.key)}
                                    className={`
                                        group relative w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] transform-gpu
                                        ${activeTab === item.key
                                            ? 'bg-gradient-to-r from-blue-500/80 to-purple-600/80 text-white shadow-lg border border-blue-400/30 scale-[1.01]'
                                            : 'bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-md border border-gray-200/50'
                                        }
                                        ${activeItem === item.key ? 'scale-95 brightness-110' : ''}
                                    `}
                                >
                                    {/* Ripple effect background */}
                                    <div className="absolute inset-0 rounded-lg overflow-hidden">
                                        <div className={`absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 scale-0 transition-transform duration-300 ease-out rounded-lg ${activeItem === item.key ? 'scale-150' : 'group-active:scale-100'
                                            }`} />
                                    </div>

                                    {/* Icon with enhanced animation */}
                                    <div className={`transition-all duration-300 z-10 relative ${activeTab === item.key
                                        ? 'scale-110 rotate-3'
                                        : 'group-hover:scale-110 group-hover:-rotate-3 group-active:scale-95'
                                        }`}>
                                        {item.icon}
                                    </div>

                                    {/* Text with slide animation */}
                                    <span className={`font-semibold transition-all duration-300 z-10 relative ${activeTab === item.key
                                        ? 'text-white translate-x-1'
                                        : 'text-gray-800 group-hover:text-blue-600 group-hover:translate-x-1'
                                        }`}>
                                        {item.label}
                                    </span>

                                    {/* Active indicator with pulse */}
                                    {activeTab === item.key && (
                                        <div className="ml-auto flex items-center space-x-1 z-10">
                                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                            <div className="w-1 h-1 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                                        </div>
                                    )}

                                    {/* Hover indicator arrow */}
                                    {activeTab !== item.key && (
                                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 z-10">
                                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    )}
                                </NavigationLink>
                            </div>
                        ))}
                    </div>

                    {/* Login/Logout Button with enhanced animation */}
                    <div className={`mt-6 transition-all duration-500 ease-out ${isVisible
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-6 opacity-0'
                        }`} style={{ transitionDelay: `${100 + menuItems.length * 75 + 50}ms` }}>
                        <div className="relative group">
                            <div className="absolute inset-0 duration-1000 opacity-30 transition-all bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-xl blur-lg filter group-hover:opacity-50 group-hover:duration-200 group-hover:scale-105" />
                            {isLoggedIn ? (
                                <button
                                    onClick={() => {
                                        onLogout?.();
                                        handleNavigationClick();
                                    }}
                                    className="group relative inline-flex items-center justify-center w-full text-base rounded-xl bg-white px-6 py-3 font-semibold text-red-600 transition-all duration-300 hover:bg-red-50 hover:shadow-lg hover:-translate-y-1 hover:shadow-red-300/30 border border-red-200 active:scale-95 active:translate-y-0 transform-gpu"
                                >
                                    <LogoutOutlined className="mr-2 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12" />
                                    <span className="transition-all duration-300 group-hover:translate-x-0.5">Logout</span>

                                    {/* Animated background on hover */}
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/5 to-pink-500/5 scale-0 group-hover:scale-100 transition-transform duration-300 ease-out" />
                                </button>
                            ) : (
                                <NavigationLink
                                    href="/auth"
                                    onClick={handleNavigationClick}
                                    className="group relative inline-flex items-center justify-center w-full text-base rounded-xl bg-white px-6 py-3 font-semibold text-gray-900 transition-all duration-300 hover:bg-gray-50 hover:shadow-lg hover:-translate-y-1 hover:shadow-gray-300/30 border border-gray-200 active:scale-95 active:translate-y-0 transform-gpu overflow-hidden"
                                >
                                    <LoginOutlined className="mr-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                                    <span className="transition-all duration-300 group-hover:translate-x-0.5">Login</span>
                                    <svg aria-hidden="true" viewBox="0 0 10 10" height={12} width={12} fill="none" className="mt-0.5 ml-2 -mr-1 stroke-gray-900 stroke-2 transition-all duration-300">
                                        <path d="M0 5h7" className="transition-all duration-300 opacity-0 group-hover:opacity-100" />
                                        <path d="M1 1l4 4-4 4" className="transition-all duration-300 group-hover:translate-x-[3px]" />
                                    </svg>

                                    {/* Animated background on hover */}
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 scale-0 group-hover:scale-100 transition-transform duration-300 ease-out" />
                                </NavigationLink>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer with fade-in animation */}
                <div className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white/95 to-transparent backdrop-blur-sm border-t border-gray-200/50 transition-all duration-700 ${isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-4 opacity-0'
                    }`} style={{ transitionDelay: `${100 + menuItems.length * 75 + 100}ms` }}>
                    <p className="text-center text-sm text-gray-500 font-medium">
                        © 2025 SPIT TEAM
                    </p>
                </div>
            </Drawer>

            <style jsx global>{`
                .mobile-menu-drawer .ant-drawer-content-wrapper {
                    box-shadow: -10px 0 25px -5px rgba(0, 0, 0, 0.1), -4px 0 10px -6px rgba(0, 0, 0, 0.1);
                    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
                }
                
                .mobile-menu-drawer .ant-drawer-body {
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s ease-out;
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
                    transition: opacity 0.3s ease-out;
                }

                /* Enhanced slide animation for drawer */
                .ant-drawer.mobile-menu-drawer .ant-drawer-content-wrapper {
                    transform: translateX(100%);
                    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease-out;
                }

                .ant-drawer.mobile-menu-drawer.ant-drawer-open .ant-drawer-content-wrapper {
                    transform: translateX(0);
                }

                /* Custom keyframes for staggered animations */
                @keyframes slideInFromRight {
                    from {
                        transform: translateX(20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                @keyframes fadeInUp {
                    from {
                        transform: translateY(10px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                @keyframes ripple {
                    0% {
                        transform: scale(0);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(4);
                        opacity: 0;
                    }
                }

                .animate-ripple {
                    animation: ripple 0.6s linear;
                }

                /* Hardware acceleration for smooth animations */
                .mobile-menu-drawer * {
                    transform: translateZ(0);
                    will-change: transform, opacity;
                }

                /* Backdrop blur enhancement */
                .ant-drawer-mask {
                    backdrop-filter: blur(8px);
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }
            `}</style>
        </>
    );
};

export default MenuMobile;
