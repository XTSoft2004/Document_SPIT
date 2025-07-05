import { loginAccount } from "@/actions/auth.actions"
import { ILoginRequest, ILoginResponse } from "@/types/auth"
import React, { useContext } from "react"
import { createContext, useState } from "react"

type AuthContextType = {
    info: ILoginResponse | null
    isLoggedIn: boolean
    setInfo: (info: ILoginResponse | null) => void
    login: (loginRequest: ILoginRequest) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextType>({
    info: null,
    isLoggedIn: false,
    setInfo: () => { },
    login: async () => { },
    logout: () => { },
});

export const AuthProvider: React.FC<{
    children: React.ReactNode
}> = ({ children }) => {
    const [info, setInfo] = useState<ILoginResponse | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const login = async (loginRequest: ILoginRequest) => {
        const response = await loginAccount(loginRequest);
        if (response.ok) {
            setInfo(response.data);
            setIsLoggedIn(true);
        }
    };

    React.useEffect(() => {
        setIsLoggedIn(!!info);
    }, [info]);

    const logout = () => {
        setInfo(null);
    };

    return (
        <AuthContext.Provider value={{ info, isLoggedIn, setInfo, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};