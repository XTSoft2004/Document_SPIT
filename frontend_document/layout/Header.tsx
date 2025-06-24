'use client';

import Image from 'next/image';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation'

const Header = () => {
    const router = useRouter();
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
                    onClick={() => router.push('/document')}
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