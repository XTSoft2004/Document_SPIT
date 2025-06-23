import React, { useRef, useState } from 'react';

interface PreviewFilePopupProps {
    open: boolean;
    onClose: () => void;
    fileName: string;
    folderId: string;
    url: string;
}

export default function PreviewFile({ open, onClose, fileName, url }: PreviewFilePopupProps) {
    const imgRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [isPanning, setIsPanning] = useState(false);
    const [origin, setOrigin] = useState({ x: 0, y: 0 });
    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const [isFullscreen, setIsFullscreen] = useState(false);

    const handleZoomIn = () => setScale((s) => Math.min(s + 0.2, 5));
    const handleZoomOut = () => setScale((s) => Math.max(s - 0.2, 0.2));
    const handleReset = () => {
        setScale(1);
        setTranslate({ x: 0, y: 0 });
    };

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

    const handleFullscreen = () => {
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
    };

    React.useEffect(() => {
        const onFullScreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', onFullScreenChange);
        return () => document.removeEventListener('fullscreenchange', onFullScreenChange);
    }, []);

    if (!open) return null;

    const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fileName);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={onClose}
        >
            <div
                ref={containerRef}
                className={`bg-white rounded-xl shadow-lg w-[90vw] max-w-5xl max-h-[90vh] flex flex-col relative ${isFullscreen ? 'w-screen h-screen max-w-none max-h-none rounded-none' : ''}`}
                style={isFullscreen ? { width: '100vw', height: '100vh' } : {}}
                onClick={e => e.stopPropagation()}
            >
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-500 z-10"
                    onClick={onClose}
                    title="Đóng"
                >
                    &#10005;
                </button>
                {/* Toolbar */}
                <div className="flex justify-between items-center gap-4 py-3 border-b bg-white sticky top-0 z-10 px-6">
                    <div className="text-lg font-semibold truncate max-w-[300px]">{fileName}</div>
                    {isImage && (
                        <div className="flex items-center gap-2">
                            <button className="px-2 py-1 bg-gray-200 rounded" onClick={handleZoomOut} title="Thu nhỏ">-</button>
                            <input
                                type="number"
                                min={1}
                                max={300}
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
                                className="w-14 border-3 rounded px-1 py-0.5 appearance-none text-center"
                                style={{ textAlign: 'center' }}
                            />
                            <span>%</span>
                            <button className="px-2 py-1 bg-gray-200 rounded" onClick={handleZoomIn} title="Phóng to">+</button>
                            <button className="px-2 py-1 bg-gray-200 rounded" onClick={handleReset} title="Reset">⟳</button>
                            <button
                                className="px-2 py-1 bg-gray-200 rounded"
                                onClick={handleFullscreen}
                                title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
                            >
                                {isFullscreen ? (
                                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="#222" strokeWidth="2" d="M9 15v2a2 2 0 0 1-2 2H5m10-4v2a2 2 0 0 0 2 2h2M9 9V7a2 2 0 0 0-2-2H5m10 4V7a2 2 0 0 1 2-2h2" /></svg>
                                ) : (
                                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="#222" strokeWidth="2" d="M9 9V7a2 2 0 0 0-2-2H5m10 0h2a2 2 0 0 1 2 2v2m0 10v-2a2 2 0 0 0-2-2h-2m-10 0v2a2 2 0 0 0 2 2h2" /></svg>
                                )}
                            </button>
                        </div>
                    )}
                </div>
                <div
                    className="flex-1 overflow-auto p-1 flex justify-center items-center"
                    style={{ cursor: isImage && isPanning ? 'grabbing' : isImage ? 'grab' : 'default' }}
                    onMouseMove={isImage ? handleMouseMove : undefined}
                    onMouseUp={isImage ? handleMouseUp : undefined}
                    onMouseLeave={isImage ? handleMouseUp : undefined}
                >
                    {isImage ? (
                        <img
                            ref={imgRef}
                            src={url}
                            alt={fileName}
                            style={{
                                transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
                                transition: isPanning ? 'none' : 'transform 0.2s',
                                maxWidth: '100%',
                                maxHeight: isFullscreen ? '90vh' : '80vh',
                                userSelect: 'none',
                                cursor: isPanning ? 'grabbing' : 'grab',
                            }}
                            draggable={false}
                            onMouseDown={handleMouseDown}
                        />
                    ) : (
                        <iframe
                            src={url}
                            className="w-full h-full rounded-b-xl border-0"
                            style={{ minHeight: '80vh', height: '100%' }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}