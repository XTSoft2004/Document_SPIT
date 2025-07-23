'use client'
import { loginAccount } from "@/actions/auth.actions"
import NotificationService from "@/components/ui/Notification/NotificationService"
import { IInfoUserResponse, ILoginRequest, ILoginResponse } from "@/types/auth"
import React, { useContext } from "react"
import { createContext, useState } from "react"

type AuthContextType = {
    info: IInfoUserResponse | null
    isLoggedIn: boolean
    setInfo: (info: ILoginResponse | null) => void
    loginUser: (loginRequest: ILoginRequest) => Promise<void>
    logout: () => void
    getInfo: () => IInfoUserResponse | null
}

const AuthContext = createContext<AuthContextType>({
    info: null,
    isLoggedIn: false,
    setInfo: () => { },
    loginUser: async () => { },
    logout: () => { },
    getInfo: () => null,
});

export const AuthProvider: React.FC<{
    children: React.ReactNode
}> = ({ children }) => {
    const [info, setInfoState] = useState<IInfoUserResponse | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const setInfo = (info: IInfoUserResponse | null) => {
        setInfoState(info);
        setIsLoggedIn(!!info);
        if (info) {
            localStorage.setItem('user', JSON.stringify(info));
            localStorage.setItem('isLoggedIn', 'true');
        } else {
            localStorage.removeItem('user');
            localStorage.setItem('isLoggedIn', 'false');
        }
    };

    const loginUser = async (loginRequest: ILoginRequest): Promise<void> => {
        try {
            const response = await loginAccount(loginRequest);

            if (response.ok) {
                // Map ILoginResponse to IInfoUserResponse
                const userInfo: IInfoUserResponse = {
                    userId: response.data.userId,
                    username: response.data.username,
                    fullname: response.data.fullname,
                    roleName: response.data.roleName || 'User', // Default role if not provided
                    email: response.data.email,
                    avatarUrl: response.data.avatarUrl || '', // Ensure avatarUrl is set
                };
                setInfo(userInfo);
                setIsLoggedIn(true);
                localStorage.setItem('user', JSON.stringify(userInfo));
                localStorage.setItem('isLoggedIn', 'true');
                NotificationService.success({
                    message: 'Đăng nhập thành công',
                    description: `Chào mừng bạn ${response.data.username} đã đăng nhập thành công!`,
                });
            } else {
                NotificationService.error({
                    message: response.message || 'Đăng nhập thất bại',
                });
            }
        } catch (error) {
            console.error("Login error:", error);
            NotificationService.error({
                message: "Lỗi kết nối đến server",
            });
        }
    };

    const getInfo = (): IInfoUserResponse | null => {
        if (typeof window === 'undefined') return null;
        
        if (localStorage.getItem('isLoggedIn') === 'false')
            return null;

        const user = localStorage.getItem('user');
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (user && isLoggedIn) {
            return JSON.parse(user) as IInfoUserResponse;
        }
        return null;
    };

    const logout = () => {
        setInfo(null);
        setIsLoggedIn(false);
        NotificationService.success({
            message: 'Đăng xuất thành công',
            description: 'Bạn đã đăng xuất khỏi hệ thống.',
        });
    };

    return (
        <AuthContext.Provider value={{ info, isLoggedIn, setInfo, loginUser, logout, getInfo }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};