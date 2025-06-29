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
                Tệp tài liệu <span className="text-red-500">*</span>
            </label>
            <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragOver
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
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
        <div className="space-y-2">
            <div className="flex items-center justify-center">
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <p className="text-lg font-medium text-gray-900">{file.name}</p>
            <p className="text-sm text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <button
                type="button"
                onClick={onRemove}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
                Xóa tệp
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
        <div className="space-y-4">
            <div className="flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
            </div>
            <div>
                <label htmlFor="file" className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-700 font-medium">
                        Nhấp để chọn tệp
                    </span>
                    <span className="text-gray-500"> hoặc kéo thả tệp vào đây</span>
                </label>
            </div>
            <p className="text-sm text-gray-500">
                Hỗ trợ: {formatAcceptedTypes(acceptedTypes)}
            </p>
            <p className="text-xs text-gray-400">
                Kích thước tối đa: {maxSize}
            </p>
        </div>
    );
}
