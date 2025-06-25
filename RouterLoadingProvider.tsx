'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import RouterLoading from './RouterLoading';

interface RouterLoadingContextType {
    showLoading: () => void;
    hideLoading: () => void;
    isLoading: boolean;
}

const RouterLoadingContext = createContext<RouterLoadingContextType | undefined>(undefined);

export const useRouterLoading = () => {
    const context = useContext(RouterLoadingContext);
    if (!context) {
        throw new Error('useRouterLoading must be used within RouterLoadingProvider');
    }
    return context;
};

interface RouterLoadingProviderProps {
    children: ReactNode;
}

export const RouterLoadingProvider = ({ children }: RouterLoadingProviderProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [loadingTimer, setLoadingTimer] = useState<NodeJS.Timeout | null>(null);

    const showLoading = () => {
        if (loadingTimer) {
            clearTimeout(loadingTimer);
            setLoadingTimer(null);
        }

        setIsLoading(true);
    };

    const hideLoading = () => {
        if (loadingTimer) {
            clearTimeout(loadingTimer);
        }
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 200);

        setLoadingTimer(timer);
    };

    return (
        <RouterLoadingContext.Provider value={{ showLoading, hideLoading, isLoading }}>
            {children}
            <RouterLoading isVisible={isLoading} duration={500} />
        </RouterLoadingContext.Provider>
    );
};