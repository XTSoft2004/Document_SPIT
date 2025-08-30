'use client';
import { useState, useEffect, ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import InitialLoading from './InitialLoading';

interface AppInitializerProps {
    children: ReactNode;
}

export default function AppInitializer({ children }: AppInitializerProps) {
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        if (isInitialLoading) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isInitialLoading]);

    const handleLoadingComplete = () => {
        setIsInitialLoading(false);
        setTimeout(() => {
            setShowContent(true);
        }, 200);
    };

    return (
        <>
            <AnimatePresence mode="wait">
                {isInitialLoading && (
                    <InitialLoading
                        key="initial-loading"
                        onLoadingComplete={handleLoadingComplete}
                        duration={2500}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showContent && (
                    <div key="main-content">
                        {children}
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
