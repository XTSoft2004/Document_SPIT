'use client'
import Image from 'next/image'
import Menu from '@/components/ui/Menu/Menu'
import MenuMobile from '@/components/ui/Menu/MenuMobile'
import NavigationLink from '@/components/ui/Navigation/NavigationLink'
import { IUserResponse } from '@/types/user'
import { getMe } from '@/actions/user.action'
import { logoutAccount } from '@/actions/auth.actions'
import React, { useEffect } from 'react'
import MenuProfile from '@/components/ui/Menu/MenuProfile'
import NotificationService from '@/components/ui/Notification/NotificationService'

import { UserOutlined } from '@ant-design/icons'
import { Avatar } from 'antd'
import { useAuth } from '@/context/AuthContext'
import { usePathname } from 'next/navigation'

const Header = () => {
  const pathname = usePathname()
  const [user, setUser] = React.useState<IUserResponse>()
  // const { getInfo } = useAuth();
  // const user = getInfo();
  const [islogin, setIsLogin] = React.useState<boolean>(false)
  const [showProfileMenu, setShowProfileMenu] = React.useState<boolean>(false)

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getMe()
      // alert(userData.status + ' ' + islogin)
      setUser(userData.data)
      if (userData.status === 200) {
        setIsLogin(true)
        return;
      }
      if (userData.status == 401 && islogin) {
        // alert('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại')
        NotificationService.warning({
          message: 'Phiên đăng nhập đã hết hạn',
          description: 'Vui lòng đăng nhập lại để tiếp tục sử dụng.',
        })
      }
      setIsLogin(false)
    }
    fetchUser()
  }, [pathname])

  const getAvatar = (name: string) => {
    // Generate a simple avatar from name initials
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
    return initials
  }

  const handleLogout = async () => {
    try {
      await logoutAccount()
      setIsLogin(false)
      // setUser(undefined);
      setShowProfileMenu(false)
      window.location.href = '/'
      localStorage.clear()
      NotificationService.success({ message: 'Đăng xuất thành công' })
    } catch (error) {
      NotificationService.error({ message: 'Đăng xuất thất bại' })
      console.error('Logout failed:', error)
    }
  }
  return (
    <header className="sticky top-0 z-40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          {/* Logo bên trái */}
          <div className="flex items-center absolute left-4 sm:left-6 lg:left-8">
            <NavigationLink href="/" className="flex items-center">
              <Image
                src="/logo/logo-500x500.png"
                alt="Logo"
                width={40}
                height={40}
                className="rounded-lg"
                priority
              />
            </NavigationLink>
          </div>

          {/* Navigation chính giữa */}
          <div className="hidden md:flex items-center">
            <Menu />
          </div>

          {/* Right side - User actions */}
          <div className="absolute right-4 sm:right-6 lg:right-8 flex items-center space-x-3">
            {/* Mobile Menu */}
            <div className="md:hidden">
              <MenuMobile
                isLoggedIn={!!user}
                onLogout={user ? handleLogout : undefined}
              />
            </div>

            {/* Desktop */}
            {user ? (
              <div className="hidden md:flex items-center space-x-3 relative">
                <span className="text-sm font-medium text-gray-700 uppercase">
                  {user?.username}
                </span>
                <button
                  onClick={() => setShowProfileMenu((prev) => !prev)}
                  className="flex items-center focus:outline-none hover:opacity-80 transition-opacity"
                >
                  <Avatar
                    size={36}
                    src={user?.avatarUrl || undefined}
                    icon={!user?.avatarUrl ? <span>{getAvatar(user?.fullname || '')}</span> : undefined}
                    className="border-2 border-gray-200"
                  />
                </button>
                {showProfileMenu && (
                  <div className="absolute right-0 top-full mt-2 z-50">
                    <MenuProfile
                      onClose={() => setShowProfileMenu(false)}
                      user={user || undefined}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center">
                <div className="relative group">
                  <div className="absolute inset-0 duration-1000 opacity-50 transition-all bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-xl blur-lg filter group-hover:opacity-75 group-hover:duration-200" />
                  <NavigationLink
                    href="/auth"
                    className="group relative inline-flex items-center justify-center text-sm rounded-xl bg-white px-6 py-2 font-semibold text-gray-900 transition-all duration-200 hover:bg-gray-50 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-gray-300/30 border border-gray-200"
                  >
                    Đăng nhập
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 10 10"
                      height={10}
                      width={10}
                      fill="none"
                      className="mt-0.5 ml-2 -mr-1 stroke-gray-900 stroke-2"
                    >
                      <path
                        d="M0 5h7"
                        className="transition opacity-0 group-hover:opacity-100"
                      />
                      <path
                        d="M1 1l4 4-4 4"
                        className="transition group-hover:translate-x-[3px]"
                      />
                    </svg>
                  </NavigationLink>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
