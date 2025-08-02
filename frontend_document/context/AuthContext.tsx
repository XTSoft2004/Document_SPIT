'use client'
import { loginAccount } from "@/actions/auth.actions"
import { getMe } from "@/actions/user.action"
import NotificationService from "@/components/ui/Notification/NotificationService"
import { IInfoUserResponse, ILoginRequest, ILoginResponse } from "@/types/auth"
import { IUserResponse } from "@/types/user"
import React, { useContext } from "react"
import { createContext, useState } from "react"

type AuthContextType = {
    info: IInfoUserResponse | null
    isLoggedIn: boolean
    loginUser: (loginRequest: ILoginRequest) => Promise<void>
    logout: () => void
    getInfo: () => IInfoUserResponse | null
}

const AuthContext = createContext<AuthContextType>({
    info: null,
    isLoggedIn: false,
    loginUser: async () => { },
    logout: () => { },
    getInfo: () => null,
});

export const AuthProvider: React.FC<{
    children: React.ReactNode
}> = ({ children }) => {
    const [info, setInfoState] = useState<IInfoUserResponse | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // const setInfo = (info: IInfoUserResponse | null) => {
    //     setInfoState(info);
    //     setIsLoggedIn(!!info);
    //     if (info) {
    //         localStorage.setItem('user', JSON.stringify(info));
    //         localStorage.setItem('isLoggedIn', 'true');
    //     } else {
    //         localStorage.removeItem('user');
    //         localStorage.setItem('isLoggedIn', 'false');
    //     }
    // };

    const loginUser = async (loginRequest: ILoginRequest): Promise<void> => {
        try {
            const response = await loginAccount(loginRequest);

            if (response.ok && response.data) {
                const userInfo: IInfoUserResponse = {
                    userId: response.data.userId.toString(),
                    username: response.data.username,
                    fullname: response.data.fullname,
                    roleName: response.data.roleName || 'User',
                    avatarUrl: response.data.avatarUrl || '',
                };
                // setInfo(userInfo);
                localStorage.setItem('user', JSON.stringify(userInfo));
                localStorage.setItem('isLoggedIn', 'true');
                NotificationService.success({
                    message: 'Đăng nhập thành công',
                    description: `Chào mừng bạn ${response.data.username} đã đăng nhập thành công!`,
                });
            } else {
                localStorage.removeItem('user');
                localStorage.setItem('isLoggedIn', 'false');

                NotificationService.error({
                    message: 'Đăng nhập thất bại',
                    description: response.message || 'Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.',
                    duration: 5,
                });

                throw new Error(response.message || 'Đăng nhập thất bại');
            }
        } catch (error) {
            // Ensure user stays logged out on error
            setIsLoggedIn(false);
            localStorage.removeItem('user');
            localStorage.setItem('isLoggedIn', 'false');

            console.error("Login error:", error);
            throw error;
            // Check if it's our custom login failure error
            // if (error instanceof Error && error.message.includes('Đăng nhập thất bại')) {
            //     // Don't show additional error notification for login failures
            //     throw error; // Re-throw to prevent redirect
            // } else {
            //     // Network or other errors
            //     NotificationService.error({
            //         message: "Lỗi kết nối",
            //         description: "Không thể kết nối đến server. Vui lòng thử lại sau.",
            //         duration: 5,
            //     });
            //     throw error; // Re-throw to prevent redirect
            // }
        }
    };

    // Fetch user data
    const getInfo = (): IInfoUserResponse | null => {
        try {
            const storedUser = localStorage.getItem('user');
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

            if (storedUser && isLoggedIn) {
                const userInfo: IInfoUserResponse = JSON.parse(storedUser);
                setIsLoggedIn(true);
                setInfoState(userInfo);
                return userInfo;
            } else {
                setIsLoggedIn(false);
                setInfoState(null);
                return null;
            }
        } catch (error) {
            setIsLoggedIn(false);
            setInfoState(null);
            return null;
        }
    }

    const logout = () => {
        setIsLoggedIn(false);
        NotificationService.success({
            message: 'Đăng xuất thành công',
            description: 'Bạn đã đăng xuất khỏi hệ thống.',
        });
    };

    return (
        <AuthContext.Provider value={{ info, isLoggedIn, loginUser, logout, getInfo }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};