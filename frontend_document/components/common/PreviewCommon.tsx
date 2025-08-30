import globalConfig from '@/app.config';
import React, { useRef, useState, useEffect } from 'react';
import { getCodeView } from '@/actions/document.actions';
import Image from 'next/image';

interface PreviewFilePopupProps {
    fileName: string;
    documentId: number;
    scale?: number;
    setScale?: React.Dispatch<React.SetStateAction<number>>;
    translate?: { x: number; y: number };
    setTranslate?: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
}

export default function PreviewFile({
    fileName,
    documentId,
    scale: externalScale,
    setScale: externalSetScale,
    translate: externalTranslate,
    setTranslate: externalSetTranslate
}: PreviewFilePopupProps) {
    const imgRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [internalScale, setInternalScale] = useState(1);
    const [isPanning, setIsPanning] = useState(false);
    const [origin, setOrigin] = useState({ x: 0, y: 0 });
    const [internalTranslate, setInternalTranslate] = useState({ x: 0, y: 0 });
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [codeView, setCodeView] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isIframeLoading, setIsIframeLoading] = useState(false);
    const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

    // Use external state if provided, otherwise use internal state
    const scale = externalScale !== undefined ? externalScale : internalScale;
    const setScale = externalSetScale || setInternalScale;
    const translate = externalTranslate !== undefined ? externalTranslate : internalTranslate;
    const setTranslate = externalSetTranslate || setInternalTranslate;

    const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fileName);

    const handleZoomIn = React.useCallback(() => setScale((s) => Math.min(s + 0.2, 5)), [setScale]);
    const handleZoomOut = React.useCallback(() => setScale((s) => Math.max(s - 0.2, 0.2)), [setScale]);
    const handleReset = React.useCallback(() => {
        setScale(1);
        setTranslate({ x: 0, y: 0 });
    }, [setScale, setTranslate]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsPanning(true);
        setOrigin({ x: e.clientX - translate.x, y: e.clientY - translate.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isPanning) return;
        setTranslate({
            x: e.clientX - origin.x,
            y: e.clientY - origin.y,
        });
    };

    const handleMouseUp = () => setIsPanning(false);

    const handleFullscreen = React.useCallback(() => {
        if (containerRef.current) {
            if (!isFullscreen) {
                if (containerRef.current.requestFullscreen) {
                    containerRef.current.requestFullscreen();
                }
                setIsFullscreen(true);
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
                setIsFullscreen(false);
            }
        }
    }, [isFullscreen]);

    // Track container dimensions for responsive layout
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const { clientWidth, clientHeight } = containerRef.current;
                setContainerDimensions({ width: clientWidth, height: clientHeight });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);

        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Calculate optimal image size based on container dimensions
    const getImageConstraints = () => {
        const { width, height } = containerDimensions;
        if (width === 0 || height === 0) return { maxWidth: '100%', maxHeight: '100%' };

        const containerAspectRatio = width / height;
        const isContainerLandscape = containerAspectRatio > 1;

        // Responsive sizing based on container orientation and size
        if (isContainerLandscape) {
            // Landscape container - optimize for width
            return {
                maxWidth: width > 1200 ? '90%' : '95%',
                maxHeight: height > 600 ? '85%' : '90%'
            };
        } else {
            // Portrait container - optimize for height
            return {
                maxWidth: width > 800 ? '85%' : '90%',
                maxHeight: height > 800 ? '80%' : '85%'
            };
        }
    };

    const imageConstraints = getImageConstraints();

    useEffect(() => {
        let isSubscribed = true;

        const loadDocument = async () => {
            if (!documentId) {
                setError("Không tìm thấy ID tài liệu");
                setIsLoading(false);
                return;
            }

            if (isSubscribed) {
                setError(null);
                setIsLoading(true);
                setCodeView(null);
                setIsInitialized(true);
            }

            try {
                const response = await getCodeView(documentId);
                if (!isSubscribed) return;

                if (response?.ok && response?.data?.code) {
                    setCodeView(response.data.code);
                    // Set iframe loading for non-image files
                    if (!isImage) {
                        setIsIframeLoading(true);
                    }
                } else {
                    setError("Không thể tải nội dung tài liệu");
                }
            } catch (err) {
                if (!isSubscribed) return;
                console.error('Error fetching document:', err);
                setError("Có lỗi xảy ra khi tải tài liệu");
            } finally {
                if (isSubscribed) {
                    setIsLoading(false);
                }
            }
        };

        loadDocument();

        return () => {
            isSubscribed = false;
        };
    }, [documentId, isImage]);

    React.useEffect(() => {
        const onFullScreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', onFullScreenChange);
        return () => document.removeEventListener('fullscreenchange', onFullScreenChange);
    }, []);

    // Keyboard shortcuts
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                // onClose();
            } else if (isImage) {
                if (e.key === '+' || e.key === '=') {
                    e.preventDefault();
                    handleZoomIn();
                } else if (e.key === '-') {
                    e.preventDefault();
                    handleZoomOut();
                } else if (e.key === '0') {
                    e.preventDefault();
                    handleReset();
                } else if (e.key === 'f' || e.key === 'F') {
                    e.preventDefault();
                    handleFullscreen();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isImage, handleZoomIn, handleZoomOut, handleReset, handleFullscreen]);

    // Mouse wheel zoom for images
    const handleWheel = React.useCallback((e: React.WheelEvent) => {
        if (!isImage) {
            // Even for non-images, prevent scroll propagation when inside preview
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        e.preventDefault();
        e.stopPropagation();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setScale(prevScale => Math.max(0.2, Math.min(prevScale + delta, 5)));
    }, [isImage, setScale]);

    if (!documentId) {
        return (
            <div className="flex items-center justify-center h-[500px] bg-gray-50">
                <div className="text-gray-500">Không tìm thấy tài liệu</div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="flex-1 overflow-hidden flex justify-center items-center bg-gray-50 relative w-full h-full"
            style={{
                cursor: isImage && isPanning ? 'grabbing' : isImage ? 'grab' : 'default',
                minHeight: '400px',
                height: '100%',
                width: '100%'
            }}
            onMouseMove={isImage ? handleMouseMove : undefined}
            onMouseUp={isImage ? handleMouseUp : undefined}
            onMouseLeave={isImage ? handleMouseUp : undefined}
            onWheel={handleWheel}
        >
            {isLoading ? (
                <div className="w-full max-w-3xl mx-auto p-8">
                    <div className="flex flex-col items-center justify-center space-y-6">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-ping"></div>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="text-lg font-medium text-gray-900">
                                Đang tải tài liệu...
                            </div>
                            <div className="text-sm text-gray-500">Vui lòng đợi trong giây lát</div>
                        </div>
                        <div className="w-full max-w-md">
                            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : error ? (
                <div className="w-full h-full flex items-center justify-center p-8">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="p-4 bg-red-50">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        </div>
                        <div className="space-y-2">
                            <div className="text-lg font-semibold text-gray-900">Không thể tải tài liệu</div>
                            <div className="text-sm text-gray-500 max-w-md">
                                {error}
                            </div>
                        </div>
                    </div>
                </div>
            ) : isImage ? (
                <div className="relative w-full h-full flex items-center justify-center">
                    <div
                        className="relative"
                        style={{
                            maxWidth: imageConstraints.maxWidth,
                            maxHeight: imageConstraints.maxHeight,
                            width: 'fit-content',
                            height: 'fit-content'
                        }}
                    >
                        <Image
                            ref={imgRef}
                            // src={`${globalConfig.baseUrl}/document/view/${codeView}`}
                            src={`/api/view/${codeView}`}
                            onContextMenu={e => e.preventDefault()}
                            alt={fileName}
                            width={0}
                            height={0}
                            sizes="100vw"
                            className="transition-all duration-200 w-auto h-auto object-contain"
                            style={{
                                transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
                                transition: isPanning ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                userSelect: 'none',
                                cursor: isPanning ? 'grabbing' : 'grab',
                                maxWidth: '100%',
                                maxHeight: '100%',
                            }}
                            draggable={false}
                            onMouseDown={handleMouseDown}
                            onError={() => {
                                setError("Không thể tải ảnh. Vui lòng thử lại sau.");
                            }}
                        />
                    </div>

                    {/* Zoom indicator */}
                    {scale !== 1 && (
                        <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                            {Math.round(scale * 100)}%
                        </div>
                    )}
                </div>
            ) : (
                <div className="w-full h-full relative">
                    {/* Iframe Loading Overlay */}
                    {isIframeLoading && (
                        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10">
                            <div className="flex flex-col items-center space-y-4">
                                <div className="relative">
                                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                    <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-blue-400 rounded-full animate-ping"></div>
                                </div>
                                <div className="text-center space-y-2">
                                    <div className="text-lg font-medium text-gray-900">
                                        Đang tải nội dung...
                                    </div>
                                    <div className="text-sm text-gray-500">Vui lòng đợi trong giây lát</div>
                                </div>
                                <div className="w-48">
                                    <div className="bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <iframe
                        src={`/api/view/${codeView}#toolbar=0&navpanes=0&scrollbar=0`}
                        className="w-full h-full border-0"
                        style={{
                            minHeight: '400px',
                            height: '100%',
                            width: '100%'
                        }}
                        onLoad={() => setIsIframeLoading(false)}
                        onError={() => {
                            console.error('Error loading iframe');
                            setIsIframeLoading(false);
                        }}
                    />
                </div>
            )}
        </div>
    );
}