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
    // Kiểm tra src là base64
    const isBase64 = src?.startsWith('data:');

    // Không có src hoặc không hỗ trợ thì trả về UI báo lỗi
    if (!src || type === "unsupported") {
        return (
            <div className="w-full h-[100%] flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400">
                    <FileText className="w-10 h-10" />
                    <span className="text-base font-semibold">Không thể xem trước file này</span>
                    <span className="text-xs text-gray-400">Định dạng không hỗ trợ hoặc không có dữ liệu</span>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl flex flex-col">
            {/* Header PreviewPanel */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-gray-900 rounded-xl shadow flex items-center">
                    {type === "image" ? (
                        <ImageIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    ) : (
                        <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-base font-bold text-gray-700 dark:text-gray-200">PreviewPanel</span>
                </div>
                <div className="flex-1"></div>
                {type === "pdf" && (
                    <span className="px-3 py-1 text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full">PDF</span>
                )}
                {type === "image" && (
                    <span className="px-3 py-1 text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">Hình ảnh</span>
                )}
            </div>

            {/* Content PreviewPanel */}
            <div className="flex-1 flex items-center justify-center p-4 min-h-[250px]">
                {type === "image" && (
                    <div className="relative group w-full flex items-center justify-center">
                        {imageLoading && !imageError && (
                            <div className="flex items-center justify-center h-56 w-full bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-base text-gray-500 dark:text-gray-400">Đang tải hình ảnh...</span>
                                </div>
                            </div>
                        )}
                        {imageError ? (
                            <div className="flex items-center justify-center h-56 w-full bg-gray-100 dark:bg-gray-700 rounded-xl">
                                <div className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400">
                                    <ImageIcon className="w-14 h-14" />
                                    <span className="text-base">Không thể tải hình ảnh</span>
                                    <span className="text-xs text-gray-400">{isBase64 ? 'Dữ liệu base64' : 'Đường dẫn URL'}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="relative overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-700 min-h-[250px] flex items-center justify-center">
                                {isBase64 ? (
                                    // Sử dụng img tag cho base64
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={src}
                                        alt="Preview"
                                        className={`w-full max-h-[60vh] object-contain transition-all duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'} group-hover:scale-[1.02]`}
                                        onLoad={() => setImageLoading(false)}
                                        onError={() => {
                                            setImageLoading(false);
                                            setImageError(true);
                                        }}
                                        style={{ objectFit: "contain", maxWidth: "100%", height: "auto" }}
                                    />
                                ) : (
                                    // Sử dụng Next.js Image cho URL thường
                                    <Image
                                        src={src}
                                        alt="Preview"
                                        fill
                                        className={`w-full max-h-[60vh] object-contain transition-all duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'} group-hover:scale-[1.02]`}
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
                    <div className="relative overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 w-full flex items-center justify-center min-h-[250px]">
                        <iframe
                            src={`${src}#toolbar=0&navpanes=0&scrollbar=0`}
                            title="PDF Preview"
                            className="w-full h-[60vh] border-none"
                            style={{ backgroundColor: 'transparent' }}
                        />
                        {/* PDF Loading overlay */}
                        <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-xs text-gray-600 dark:text-gray-400 shadow-sm">
                            <FileText className="w-3 h-3 inline mr-1" />PDF Document
                        </div>
                    </div>
                )}
                {type === "pdf" && isMobile && (
                    <div className="flex flex-col items-center justify-center h-56 w-full bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl border-2 border-dashed border-orange-200 dark:border-gray-500">
                        <div className="p-4 bg-orange-100 dark:bg-gray-600 rounded-full mb-3">
                            <Smartphone className="w-10 h-10 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="text-center px-4">
                            <h5 className="text-base font-bold text-gray-700 dark:text-gray-200 mb-1">Thiết bị di động</h5>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">Xem trước PDF không được hỗ trợ trên thiết bị di động.<br />Vui lòng tải xuống để xem đầy đủ.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer PreviewPanel */}
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${type === 'image' ? 'bg-blue-500' : type === 'pdf' ? 'bg-red-500' : 'bg-gray-400'}`}></div>
                        {type === 'image' ? (isBase64 ? 'Ảnh đã tải lên (base64)' : 'Ảnh từ URL') : type === 'pdf' ? 'Tài liệu PDF' : 'File đã tải'}
                    </span>
                    {type === "image" && !imageError && (
                        <span className="font-medium text-blue-500 dark:text-blue-400">Nhấp để phóng to</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FilePreview;
