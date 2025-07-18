import globalConfig from '@/app.config';
import React, { useRef, useState, useEffect } from 'react';
import { getCodeView } from '@/actions/document.actions';
import Image from 'next/image';

interface PreviewFilePopupProps {
    open: boolean;
    onClose: () => void;
    fileName: string;
    documentId: number;
}

export default function PreviewFile({ open, onClose, fileName, documentId }: PreviewFilePopupProps) {
    const imgRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [isPanning, setIsPanning] = useState(false);
    const [origin, setOrigin] = useState({ x: 0, y: 0 });
    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [codeView, setCodeView] = useState<string | null>(null);
    const [isLoadingCodeView, setIsLoadingCodeView] = useState(false);
    const [isIframeLoading, setIsIframeLoading] = useState(false);

    const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fileName);

    const handleZoomIn = React.useCallback(() => setScale((s) => Math.min(s + 0.2, 5)), []);
    const handleZoomOut = React.useCallback(() => setScale((s) => Math.max(s - 0.2, 0.2)), []);
    const handleReset = React.useCallback(() => {
        setScale(1);
        setTranslate({ x: 0, y: 0 });
    }, []);

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

    useEffect(() => {
        if (open && documentId) {
            setIsLoading(true);
            setIsLoadingCodeView(true);
            setCodeView(null);
            setIsIframeLoading(false);

            (async () => {
                try {
                    const response = await getCodeView(documentId);
                    // NotificationService.info({ message: response.message });
                    if (response.ok) {
                        setCodeView(response.data.code);
                        // Nếu không phải là image thì set iframe loading
                        if (!isImage) {
                            setIsIframeLoading(true);
                        }
                    } else {
                        setCodeView(null);
                    }
                } catch (error) {
                    console.error('Error fetching codeView:', error);
                    setCodeView(null);
                } finally {
                    setIsLoadingCodeView(false);
                    // Delay để hiển thị loading một chút
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 500);
                }
            })();
        }
    }, [open, documentId, isImage]);

    useEffect(() => {
        if (!open) {
            setScale(1);
            setTranslate({ x: 0, y: 0 });
            setIsLoading(false);
            setIsLoadingCodeView(false);
            setCodeView(null);
            setIsIframeLoading(false);
        }
    }, [open]);

    React.useEffect(() => {
        const onFullScreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', onFullScreenChange);
        return () => document.removeEventListener('fullscreenchange', onFullScreenChange);
    }, []);

    // Keyboard shortcuts
    React.useEffect(() => {
        if (!open) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
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
    }, [open, isImage, onClose, handleZoomIn, handleZoomOut, handleReset, handleFullscreen]);

    // Mouse wheel zoom for images
    const handleWheel = React.useCallback((e: React.WheelEvent) => {
        if (!isImage) return;

        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setScale(prevScale => Math.max(0.2, Math.min(prevScale + delta, 5)));
    }, [isImage]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div
                ref={containerRef}
                className={`bg-white rounded-2xl shadow-2xl w-[95vw] max-w-6xl h-[90vh] flex flex-col relative transform transition-all duration-300 animate-in zoom-in-95 ${isFullscreen ? 'w-screen h-screen max-w-none max-h-none rounded-none' : ''}`}
                style={isFullscreen ? { width: '100vw', height: '100vh' } : {}}
                onClick={e => e.stopPropagation()}
            >
                {/* Enhanced Toolbar - 3 column layout */}
                <div className="flex items-center justify-between py-4 px-6 border-b bg-gradient-to-r from-gray-50 to-white sticky top-0 z-10 rounded-t-2xl">
                    {/* Left: File Info */}
                    <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14,2 14,8 20,8" />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <div className="text-lg font-semibold text-gray-900 truncate max-w-[200px] sm:max-w-[300px]">{fileName}</div>
                            <div className="text-sm text-gray-500">Xem trước tài liệu</div>
                        </div>
                    </div>

                    {/* Center: Toolbar Controls */}
                    {isImage && (
                        <div className="hidden sm:flex items-center gap-2 bg-white rounded-lg p-2 shadow-sm border">
                            <button
                                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-center transition-colors duration-200"
                                onClick={handleZoomOut}
                                title="Thu nhỏ"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14" />
                                </svg>
                            </button>

                            <div className="flex items-center gap-1 bg-gray-50 rounded-md px-2 py-1">
                                <input
                                    type="number"
                                    min={20}
                                    max={500}
                                    value={Math.round(scale * 100)}
                                    onChange={e => {
                                        let val = Number(e.target.value);
                                        if (isNaN(val)) val = 100;
                                        setScale(Math.max(0.2, Math.min(val / 100, 5)));
                                    }}
                                    onBlur={e => {
                                        let val = Number(e.target.value);
                                        if (isNaN(val)) val = 100;
                                        setScale(Math.max(0.2, Math.min(val / 100, 5)));
                                    }}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            let val = Number((e.target as HTMLInputElement).value);
                                            if (isNaN(val)) val = 100;
                                            setScale(Math.max(0.2, Math.min(val / 100, 5)));
                                        }
                                    }}
                                    className="w-12 bg-transparent border-none outline-none text-center text-sm font-medium"
                                />
                                <span className="text-sm text-gray-600">%</span>
                            </div>

                            <button
                                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-center transition-colors duration-200"
                                onClick={handleZoomIn}
                                title="Phóng to"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 5v14M5 12h14" />
                                </svg>
                            </button>

                            <div className="w-px h-6 bg-gray-300 mx-1"></div>

                            <button
                                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-center transition-colors duration-200"
                                onClick={handleReset}
                                title="Đặt lại"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M1 4v6h6M23 20v-6h-6" />
                                    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
                                </svg>
                            </button>

                            <button
                                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-center transition-colors duration-200"
                                onClick={handleFullscreen}
                                title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
                            >
                                {isFullscreen ? (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 0 2-2h3M3 16h3a2 2 0 0 0 2 2v3" />
                                    </svg>
                                ) : (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Right: Close Button */}
                    <div className="flex-1 flex justify-end">
                        <button
                            className="w-10 h-10 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg flex items-center justify-center transition-colors duration-200 group"
                            onClick={onClose}
                            title="Đóng"
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="group-hover:scale-110 transition-transform duration-200"
                            >
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div
                    className="flex-1 overflow-hidden flex justify-center items-center bg-gray-50 relative"
                    style={{
                        cursor: isImage && isPanning ? 'grabbing' : isImage ? 'grab' : 'default',
                        minHeight: '500px',
                        height: 'calc(90vh - 120px)' // Trừ đi height của toolbar và padding
                    }}
                    onMouseMove={isImage ? handleMouseMove : undefined}
                    onMouseUp={isImage ? handleMouseUp : undefined}
                    onMouseLeave={isImage ? handleMouseUp : undefined}
                    onWheel={isImage ? handleWheel : undefined}
                >
                    {isLoading || isLoadingCodeView ? (
                        <div className="w-full max-w-3xl mx-auto p-8">
                            <div className="flex flex-col items-center justify-center space-y-6">
                                <div className="relative">
                                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-ping"></div>
                                </div>
                                <div className="text-center space-y-2">
                                    <div className="text-lg font-medium text-gray-900">
                                        {isLoadingCodeView ? 'Đang tải thông tin tài liệu...' : 'Đang tải tài liệu...'}
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
                    ) : !isLoadingCodeView && codeView === null ? (
                        <div className="w-full h-full flex items-center justify-center p-8">
                            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                                <div className="p-4 bg-red-50 rounded-full">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="12" />
                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-lg font-semibold text-gray-900">Không thể tải tài liệu</div>
                                    <div className="text-sm text-gray-500 max-w-md">
                                        Tài liệu này hiện không thể hiển thị. Vui lòng thử lại sau hoặc liên hệ quản trị viên.
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : isImage ? (
                        <div className="relative w-full h-full flex items-center justify-center p-4">
                            <Image
                                ref={imgRef}
                                src={`${globalConfig.baseUrl}/document/view/${codeView}`}
                                alt={fileName}
                                className="shadow-lg rounded-lg transition-all duration-200"
                                style={{
                                    transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
                                    transition: isPanning ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    maxWidth: '100%',
                                    maxHeight: isFullscreen ? '90vh' : '80vh',
                                    userSelect: 'none',
                                    cursor: isPanning ? 'grabbing' : 'grab',
                                }}
                                draggable={false}
                                onMouseDown={handleMouseDown}
                                onError={(e) => {
                                    const img = e.target as HTMLImageElement;
                                    img.style.display = 'none';
                                    const errorDiv = document.createElement('div');
                                    errorDiv.className = 'flex flex-col items-center justify-center p-8 text-gray-500';
                                    errorDiv.innerHTML = `
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mb-4 text-red-400">
                                            <circle cx="12" cy="12" r="10"/>
                                            <line x1="12" y1="8" x2="12" y2="12"/>
                                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                                        </svg>
                                        <div class="text-lg font-medium text-gray-900 mb-2">Không thể tải ảnh</div>
                                        <div class="text-sm text-gray-500">Có lỗi xảy ra khi tải tài liệu</div>
                                    `;
                                    img.parentNode?.appendChild(errorDiv);
                                }}
                            />

                            {/* Zoom indicator */}
                            {scale !== 1 && (
                                <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                                    {Math.round(scale * 100)}%
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="w-full h-full relative">
                            {/* Iframe Loading Overlay */}
                            {isIframeLoading && (
                                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                                    <div className="flex flex-col items-center space-y-4">
                                        <div className="relative">
                                            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-blue-400 rounded-full animate-ping"></div>
                                        </div>
                                        <div className="text-center space-y-2">
                                            <div className="text-base font-medium text-gray-900">
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
                                src={`${globalConfig.baseUrl}/document/view/${codeView}#toolbar=0&navpanes=0&scrollbar=0`}
                                className="w-full h-full border-0"
                                style={{ minHeight: '80vh', height: '100%' }}
                                onLoad={() => setIsIframeLoading(false)}
                                onError={() => {
                                    console.error('Error loading iframe');
                                    setIsIframeLoading(false);
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}