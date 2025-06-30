import React, { useEffect, useRef, useState } from 'react';
import {
    HomeOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { logoutAccount } from '@/actions/auth.actions';
import NotificationService from '../Notification/NotificationService';

interface MenuProfileProps {
    onClose?: () => void;
}

const MenuProfile = ({ onClose }: MenuProfileProps) => {
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);


    useEffect(() => {
        setIsVisible(true);
    }, []);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                handleClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };

        document.addEventListener('keydown', handleEscKey);
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose?.();
        }, 200);
    };

    const handleLogout = async () => {
        try {
            handleClose();
            await logoutAccount();
            window.location.href = '/';
            NotificationService.success({ message: 'Đăng xuất thành công' });
        } catch (error) {
            NotificationService.error({ message: 'Đăng xuất thất bại' });
            console.error('Logout failed:', error);
        }
    };

    const handleGoHome = () => {
        handleClose();
        router.push('/');
    };

    return (
        <div
            ref={menuRef}
            className={`relative transition-all duration-200 ease-out ${isVisible && !isClosing
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-95 -translate-y-2'
                }`}
        >
            {/* Background overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br from-blue-50/80 to-purple-50/80 backdrop-blur-sm rounded-xl transition-all duration-200 ${isVisible && !isClosing ? 'opacity-100' : 'opacity-0'
                }`}></div>

            {/* Main content */}
            <div className={`relative bg-white/90 backdrop-blur-md p-2 shadow-xl shadow-gray-200/60 rounded-xl border border-white/50 min-w-[200px] transition-all duration-200 ${isVisible && !isClosing ? 'scale-100' : 'scale-95'
                }`}>
                {/* Menu items */}
                <div className="space-y-1">
                    {/* Home button */}
                    <button
                        onClick={handleGoHome}
                        className="group w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02] transform"
                    >
                        <div className="relative">
                            <HomeOutlined className="text-lg transition-transform duration-300 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-blue-400 opacity-0 group-hover:opacity-20 rounded-full blur-sm transition-opacity duration-300"></div>
                        </div>
                        <span className="transition-all duration-300">Trang chủ</span>
                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1 group-hover:translate-x-0">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </button>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-2"></div>

                    {/* Logout button */}
                    <button
                        onClick={handleLogout}
                        className="group w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 hover:text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02] transform"
                    >
                        <div className="relative">
                            <LogoutOutlined className="text-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                            <div className="absolute inset-0 bg-red-400 opacity-0 group-hover:opacity-20 rounded-full blur-sm transition-opacity duration-300"></div>
                        </div>
                        <span className="transition-all duration-300">Đăng xuất</span>
                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1 group-hover:translate-x-0">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
                            </svg>
                        </div>
                    </button>
                </div>

                {/* Bottom decoration */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2">
                    <div className="w-6 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-30"></div>
                </div>
            </div>
        </div>
    );
}

export default MenuProfile;
