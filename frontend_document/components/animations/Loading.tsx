import { useState, useEffect } from 'react';
import Image from 'next/image';

interface LoadingProps {
    isVisible?: boolean;
    duration?: number;
    onComplete?: () => void;
}

const Loading = ({ isVisible = true, duration = 2000, onComplete }: LoadingProps) => {
    const [opacity, setOpacity] = useState(0);
    const [scale, setScale] = useState(0.3);
    const [rotation, setRotation] = useState(0);
    const [animationComplete, setAnimationComplete] = useState(false);
    const [showText, setShowText] = useState(false);
    const [startCurtainUp, setStartCurtainUp] = useState(false);

    useEffect(() => {
        if (isVisible && !animationComplete) {
            const fadeTimer = setTimeout(() => {
                setOpacity(1);
                setScale(1);
            }, 200);

            const rotationInterval = setInterval(() => {
                setRotation(prev => {
                    const newRotation = prev + (360 / (duration / 16));
                    if (newRotation >= 360) {
                        setAnimationComplete(true);
                        clearInterval(rotationInterval);

                        setTimeout(() => {
                            setShowText(true);
                            setTimeout(() => {
                                setStartCurtainUp(true);
                                setTimeout(() => {
                                    onComplete?.();
                                }, 1000);
                            }, 1500);
                        }, 300);

                        return 360;
                    }
                    return newRotation;
                });
            }, 16);

            return () => {
                clearTimeout(fadeTimer);
                clearInterval(rotationInterval);
            };
        } else if (!isVisible) {
            setOpacity(0);
            setScale(0.2);
            setRotation(0);
            setAnimationComplete(false);
            setShowText(false);
            setStartCurtainUp(false);
        }
    }, [isVisible, duration, animationComplete, onComplete]);

    if (!isVisible) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden ${startCurtainUp ? 'curtain-up' : ''}`}
            style={{
                background: 'radial-gradient(circle at center, rgba(40, 40, 40, 0.8) 0%, rgba(0, 0, 0, 0.95) 30%, rgba(0, 0, 0, 1) 100%)'
            }}>
            {/* Rest of your component remains the same */}
            <div className="relative items-center">
                {/* Logo */}
                <div
                    className={`relative ${animationComplete ? 'logo-final-position' : ''}`}
                    style={{
                        opacity,
                        transform: `scale(${scale}) rotate(${rotation}deg)`,
                        transition: animationComplete ?
                            'transform 1s ease-out' :
                            'opacity 0.8s ease-out, transform 0.8s ease-out'
                    }}
                >
                    <Image
                        src="/logo/logo-500x500.png"
                        alt="Loading..."
                        width={120}
                        height={120}
                        className="drop-shadow-lg"
                        priority
                    />
                </div>

                {/* SPIT Text */}
                {showText && (
                    <div className="absolute top-1/2 left-full ml-3 -translate-y-1/2 flex">
                        {['S', 'P', 'I', 'T'].map((letter, index) => (
                            <div
                                key={letter}
                                className="text-white text-6xl font-bold mr-3"
                                style={{
                                    animation: `flyIn 0.8s ease-out ${index * 0.1}s both`,
                                }}
                            >
                                {letter}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <style jsx>{`
                .logo-final-position {
                    transform: translateX(-20px) !important;
                }
                
                .curtain-up {
                    animation: curtainUp 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }
                
                @keyframes flyIn {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes curtainUp {
                    0% {
                        transform: translateY(0);
                        opacity: 1;
                    }
                    70% {
                        transform: translateY(-80%);
                        opacity: 0.3;
                    }
                    100% {
                        transform: translateY(-100%);
                        opacity: 0;
                }
                `}</style>
        </div>
    );
};

export default Loading;