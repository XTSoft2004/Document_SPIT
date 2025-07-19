'use client';

import { useState, useEffect } from 'react';
import FilePreviewDashboard from '@/components/common/FilePreviewDashboard';

interface FileUploaderProps {
    file: File | null;
    onFileChange: (file: File | null) => void;
    acceptedTypes?: string;
    maxSize?: string;
    className?: string;
}

export default function FileUploader({
    file,
    onFileChange,
    acceptedTypes = ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif,.bmp,.webp",
    maxSize = "10MB",
    className = ""
}: FileUploaderProps) {
    const [isDragOver, setIsDragOver] = useState(false);
    const [previewSrc, setPreviewSrc] = useState<string | null>(null);
    const [previewType, setPreviewType] = useState<"image" | "pdf" | "unsupported" | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    // Detect mobile device
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Function để xử lý preview file
    const generatePreview = (file: File) => {
        const fileType = file.type.toLowerCase();
        const fileName = file.name.toLowerCase();

        // Kiểm tra nếu là ảnh
        if (fileType.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewSrc(e.target?.result as string);
                setPreviewType('image');
            };
            reader.readAsDataURL(file);
        }
        // Kiểm tra nếu là PDF
        else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
            const url = URL.createObjectURL(file);
            setPreviewSrc(url);
            setPreviewType('pdf');
        }
        // Các file khác không hỗ trợ preview
        else {
            setPreviewSrc(null);
            setPreviewType('unsupported');
        }
    };

    // useEffect để tạo preview khi file thay đổi
    useEffect(() => {
        if (file) {
            generatePreview(file);
        } else {
            setPreviewSrc(null);
            setPreviewType(null);
        }
    }, [file]);

    // Cleanup URL khi component unmount hoặc previewSrc thay đổi
    useEffect(() => {
        return () => {
            if (previewSrc && previewSrc.startsWith('blob:')) {
                URL.revokeObjectURL(previewSrc);
            }
        };
    }, [previewSrc]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] || null;
        onFileChange(selectedFile);
    };

    const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragOver(false);
        const droppedFile = event.dataTransfer.files?.[0] || null;
        onFileChange(droppedFile);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleRemoveFile = () => {
        onFileChange(null);
    };

    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="hidden sm:inline">Tệp tài liệu</span>
                <span className="sm:hidden">Tệp</span>
                <span className="text-red-500 ml-1">*</span>
            </label>
            <div
                className={`border-2 border-dashed rounded-lg p-4 sm:p-6 lg:p-8 text-center transition-all duration-200 ${isDragOver
                    ? 'border-blue-500 bg-blue-50 scale-[1.02]'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                onDrop={handleFileDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                <input
                    type="file"
                    id="file"
                    onChange={handleFileChange}
                    accept={acceptedTypes}
                    className="hidden"
                />

                {file ? (
                    <FilePreview
                        file={file}
                        onRemove={handleRemoveFile}
                        onPreview={() => setShowPreviewModal(true)}
                        canPreview={previewType === 'image' || previewType === 'pdf'}
                    />
                ) : (
                    <FileUploadPrompt
                        acceptedTypes={acceptedTypes}
                        maxSize={maxSize}
                    />
                )}
            </div>

            {/* Modal Preview File */}
            {showPreviewModal && file && (previewType === 'image' || previewType === 'pdf') && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowPreviewModal(false);
                        }
                    }}
                >
                    <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Header Modal */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <div className="flex items-center space-x-3">
                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <h3 className="text-lg font-semibold text-gray-900">Xem trước tài liệu</h3>
                            </div>
                            <button
                                onClick={() => setShowPreviewModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content Modal */}
                        <div className="flex-1 overflow-hidden">
                            <FilePreviewDashboard
                                src={previewSrc}
                                type={previewType}
                                isMobile={isMobile}
                            />
                        </div>

                        {/* Footer Modal */}
                        <div className="p-4 border-t border-gray-200 bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    <span className="font-medium">{file.name}</span>
                                    <span className="ml-2">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                </div>
                                <button
                                    onClick={() => setShowPreviewModal(false)}
                                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Thông báo cho file không hỗ trợ preview */}
            {file && previewType === 'unsupported' && (
                <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-gray-600">
                            File này không hỗ trợ xem trước. Bạn có thể tải lên bình thường.
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

interface FilePreviewProps {
    file: File;
    onRemove: () => void;
    onPreview: () => void;
    canPreview: boolean;
}

function FilePreview({ file, onRemove, onPreview, canPreview }: FilePreviewProps) {
    return (
        <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-center">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-900 break-words px-2">
                {file.name}
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <div className="flex items-center justify-center gap-2 sm:gap-3">
                {canPreview && (
                    <button
                        type="button"
                        onClick={onPreview}
                        className="text-blue-500 hover:text-blue-700 text-xs sm:text-sm font-medium transition-colors duration-200 hover:bg-blue-50 px-3 py-1 rounded-lg"
                    >
                        <span className="hidden sm:inline">Xem trước</span>
                        <span className="sm:hidden">Xem</span>
                    </button>
                )}
                <button
                    type="button"
                    onClick={onRemove}
                    className="text-red-500 hover:text-red-700 text-xs sm:text-sm font-medium transition-colors duration-200 hover:bg-red-50 px-3 py-1 rounded-lg"
                >
                    <span className="hidden sm:inline">Xóa tệp</span>
                    <span className="sm:hidden">Xóa</span>
                </button>
            </div>
        </div>
    );
}

interface FileUploadPromptProps {
    acceptedTypes: string;
    maxSize: string;
}

function FileUploadPrompt({ acceptedTypes, maxSize }: FileUploadPromptProps) {
    const formatAcceptedTypes = (types: string) => {
        return types.replace(/\./g, '').toUpperCase().replace(/,/g, ', ');
    };

    return (
        <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-center">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
            </div>
            <div className="px-2">
                <label htmlFor="file" className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base transition-colors duration-200">
                        <span className="hidden sm:inline">Nhấp để chọn tệp</span>
                        <span className="sm:hidden">Chọn tệp</span>
                    </span>
                    <span className="text-gray-500 text-sm sm:text-base">
                        <span className="hidden sm:inline"> hoặc kéo thả tệp vào đây</span>
                        <span className="sm:hidden block mt-1">hoặc kéo thả</span>
                    </span>
                </label>
            </div>
            <div className="space-y-1 px-2">
                <p className="text-xs sm:text-sm text-gray-500">
                    <span className="hidden sm:inline">Hỗ trợ: {formatAcceptedTypes(acceptedTypes)}</span>
                    <span className="sm:hidden">Hỗ trợ: PDF, DOC, PPT...</span>
                </p>
                <p className="text-xs text-gray-400">
                    <span className="hidden sm:inline">Kích thước tối đa: {maxSize}</span>
                    <span className="sm:hidden">Tối đa: {maxSize}</span>
                </p>
            </div>
        </div>
    );
}
