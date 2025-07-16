import React, { useState } from "react";
import { Eye, FileText, Image as ImageIcon, Smartphone } from "lucide-react";
import Image from "next/image";

interface FilePreviewProps {
    src: string | null;
    type: "image" | "pdf" | "unsupported" | null;
    isMobile: boolean;
}

const FilePreview: React.FC<FilePreviewProps> = ({ src, type, isMobile }) => {
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    // Kiểm tra xem src có phải là base64 không
    const isBase64 = src?.startsWith('data:') || false;

    if (!src || type === "unsupported") return null;

    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        {type === "image" ? (
                            <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        ) : (
                            <FileText className="w-4 h-4 text-red-600 dark:text-red-400" />
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-0">
                            Xem trước tài liệu
                        </h4>
                    </div>
                    {type === "pdf" && (
                        <span className="ml-auto px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full">
                            PDF
                        </span>
                    )}
                    {type === "image" && (
                        <span className="ml-auto px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                            Hình ảnh
                        </span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {type === "image" && (
                    <div className="relative group">
                        {imageLoading && (
                            <div className="flex items-center justify-center h-48 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Đang tải...</span>
                                </div>
                            </div>
                        )}

                        {imageError ? (
                            <div className="flex items-center justify-center h-48 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <div className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400">
                                    <ImageIcon className="w-12 h-12" />
                                    <span className="text-sm">Không thể tải hình ảnh</span>
                                    <span className="text-xs text-gray-400">
                                        {isBase64 ? 'Base64 format' : 'URL format'}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="relative overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-700 min-h-[200px]">
                                {isBase64 ? (
                                    // Sử dụng img tag cho base64
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={src}
                                        alt="Preview"
                                        className={`w-full max-h-[60vh] object-contain transition-all duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'
                                            } group-hover:scale-[1.02]`}
                                        onLoad={() => setImageLoading(false)}
                                        onError={() => {
                                            setImageLoading(false);
                                            setImageError(true);
                                        }}
                                        style={{
                                            objectFit: "contain",
                                            maxWidth: "100%",
                                            height: "auto"
                                        }}
                                    />
                                ) : (
                                    // Sử dụng Next.js Image cho URL thường
                                    <Image
                                        src={src}
                                        alt="Preview"
                                        fill
                                        className={`w-full max-h-[60vh] object-contain transition-all duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'
                                            } group-hover:scale-[1.02]`}
                                        onLoad={() => setImageLoading(false)}
                                        onError={() => {
                                            setImageLoading(false);
                                            setImageError(true);
                                        }}
                                        sizes="100vw"
                                        style={{ objectFit: "contain" }}
                                        unoptimized
                                    />
                                )}

                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        )}
                    </div>
                )}

                {type === "pdf" && !isMobile && (
                    <div className="relative overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                        <iframe
                            src={`${src}#toolbar=0&navpanes=0&scrollbar=0`}
                            title="PDF Preview"
                            className="w-full h-[60vh] border-none"
                            style={{ backgroundColor: 'transparent' }}
                        />

                        {/* PDF Loading overlay */}
                        <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-xs text-gray-600 dark:text-gray-400 shadow-sm">
                            <FileText className="w-3 h-3 inline mr-1" />
                            PDF Document
                        </div>
                    </div>
                )}

                {type === "pdf" && isMobile && (
                    <div className="flex flex-col items-center justify-center h-48 bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-600 rounded-lg border-2 border-dashed border-orange-200 dark:border-gray-500">
                        <div className="p-3 bg-orange-100 dark:bg-gray-600 rounded-full mb-3">
                            <Smartphone className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="text-center px-4">
                            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                Thiết bị di động
                            </h5>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                Xem trước PDF không được hỗ trợ trên thiết bị di động.
                                <br />Vui lòng tải xuống để xem đầy đủ.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer with file info */}
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        {isBase64 ? 'Ảnh đã tải được tải lên' : 'Đã tải thành công'}
                    </span>
                    {type === "image" && (
                        <span>Nhấp để phóng to</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FilePreview;
