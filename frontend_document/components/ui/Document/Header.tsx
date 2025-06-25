'use client';

import Image from 'next/image';
import { Avatar, Input } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ITreeNode } from '@/types/tree';
import { IDriveItem } from '@/types/driver';
import MenuMobile from '../Menu/MenuMobile';

interface HeaderProps {
    treeData?: ITreeNode[];
    allItems?: IDriveItem[];
    onMobileSearch?: (results: IDriveItem[] | null) => void;
    isMobile?: boolean;
}

const Header = ({ treeData, allItems, onMobileSearch, isMobile }: HeaderProps) => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (allItems && onMobileSearch) {
            if (!searchQuery.trim()) {
                onMobileSearch(null);
            } else {
                const lower = searchQuery.toLowerCase();
                const filtered = allItems.filter(item =>
                    item.name.toLowerCase().includes(lower)
                );
                onMobileSearch(filtered);
            }
        }
    }, [searchQuery, allItems, onMobileSearch]);
    return (
        <header className="w-full flex flex-col">
            {/* Main header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3">
                {/* Left: Logo */}
                <div className="flex-shrink-0">
                    <Image
                        src="/logo/logo-500x500.png"
                        alt="Logo"
                        width={40}
                        height={40}
                        className="sm:w-[50px] sm:h-[50px] rounded-full object-cover transition-transform hover:scale-105 cursor-pointer"
                        onClick={() => router.push('/document')}
                    />
                </div>

                {/* Only show search bar on mobile */}
                {allItems && isMobile && (
                    <div className="flex-1 flex justify-center items-center w-full">
                        <div className="w-full max-w-xs">
                            <Input
                                allowClear
                                placeholder="Tìm kiếm toàn bộ file hoặc thư mục..."
                                prefix={<SearchOutlined className="text-blue-500" />}
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="rounded-lg shadow-sm border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                                size="large"
                                style={{
                                    width: '100%',
                                    minWidth: 60,
                                    transition: 'max-width 0.3s, min-width 0.3s'
                                }}
                            />
                        </div>
                    </div>
                )}
                {/* Mobile Menu - hiện ở mobile */}
                <div className="md:hidden">
                    <MenuMobile />
                </div>
            </div>
        </header>
    );
};

export default Header;