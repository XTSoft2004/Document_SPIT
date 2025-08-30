'use client';
import { useState, useEffect } from 'react';
import Loading1 from './Loading1';
import Loading2 from './Loading2';

interface InitialLoadingProps {
    onLoadingComplete: () => void;
    duration?: number;
}

const InitialLoading = ({ onLoadingComplete, duration = 1000 }: InitialLoadingProps) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkDevice = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkDevice();
        window.addEventListener('resize', checkDevice);

        return () => window.removeEventListener('resize', checkDevice);
    }, []);

    return isMobile ? (
        <Loading2 onLoadingComplete={onLoadingComplete} duration={duration} />
    ) : (
        <Loading1 onLoadingComplete={onLoadingComplete} duration={duration} />
    );
};
export default InitialLoading;