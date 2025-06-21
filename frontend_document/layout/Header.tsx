'use client';

import Image from 'next/image';
import { Input, Avatar } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';

const Header = () => {
    return (
        <header className="w-full flex items-center justify-between px-6 py-3 bg-white shadow-lg border-b border-gray-200">
            {/* Left: Logo */}
            <div className="flex-shrink-0">
                <Image
                    src="/logo/logo-500x500.png"
                    alt="Logo"
                    width={50}
                    height={50}
                    className="rounded-full object-cover transition-transform hover:scale-105"
                />
            </div>

            {/* Center: Search */}
            <div className="flex-1 mx-6 flex justify-center">
                <Input
                    placeholder="Tìm kiếm..."
                    prefix={<SearchOutlined className="text-gray-400" />}
                    className="rounded-full border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                    size="large"
                    style={{ maxWidth: 400, width: '100%' }}
                />
            </div>

            {/* Right: Avatar */}
            <div className="flex-shrink-0">
                <Avatar
                    shape="circle"
                    size={48}
                    icon={<UserOutlined className="text-gray-600" />}
                    className="hover:shadow-md transition-shadow duration-200"
                />
            </div>
        </header>
    );
};

export default Header;