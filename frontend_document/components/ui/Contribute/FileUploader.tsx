'use client';

import { useState } from 'react';

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
    acceptedTypes = ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.rar",
    maxSize = "50MB",
    className = ""
}: FileUploaderProps) {
    const [isDragOver, setIsDragOver] = useState(false);

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
                className={`border-2 border-dashed rounded-lg p-4 sm:p-6 lg:p-8 text-center transition-all duration-200 ${
                    isDragOver
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
                    <FilePreview file={file} onRemove={handleRemoveFile} />
                ) : (
                    <FileUploadPrompt 
                        acceptedTypes={acceptedTypes}
                        maxSize={maxSize}
                    />
                )}
            </div>
        </div>
    );
}

interface FilePreviewProps {
    file: File;
    onRemove: () => void;
}

function FilePreview({ file, onRemove }: FilePreviewProps) {
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
            <button
                type="button"
                onClick={onRemove}
                className="text-red-500 hover:text-red-700 text-xs sm:text-sm font-medium transition-colors duration-200 hover:bg-red-50 px-3 py-1 rounded-lg"
            >
                <span className="hidden sm:inline">Xóa tệp</span>
                <span className="sm:hidden">Xóa</span>
            </button>
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
