'use client';
import React, { useEffect, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps, UploadFile } from 'antd';
import { message } from 'antd';
import Dragger from 'antd/es/upload/Dragger';
import ModalUploadFileDashboard from './Modal/ModalUploadFileDashboard';

export default function DraggerUpload() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<UploadFile | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const props: UploadProps = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.webp,.txt',
        beforeUpload: (file) => {
            // Validate file type
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'image/jpeg',
                'image/png',
                'image/gif',
                'image/webp',
                'text/plain',
            ];

            if (!allowedTypes.includes(file.type)) {
                message.error('Loại file không được hỗ trợ!');
                return false;
            }

            if (file.size / 1024 / 1024 > 50) {
                message.error('File phải nhỏ hơn 50MB!');
                return false;
            }

            // Tạo UploadFile object với originFileObj
            const uploadFile: UploadFile = {
                uid: `${Date.now()}`,
                name: file.name,
                size: file.size,
                type: file.type,
                originFileObj: file,
                status: 'done',
            };

            setSelectedFile(uploadFile);

            // Tạo URL preview cho file
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);

            setIsModalOpen(true);
            return false; // Chặn upload tự động
        },
        showUploadList: false,
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setSelectedFile(null);
        setPreviewUrl(null);

        // Cleanup preview URL to prevent memory leaks
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
    };

    const handleSuccess = () => {
        setIsModalOpen(false);
        setSelectedFile(null);
        setPreviewUrl(null);

        // Cleanup preview URL to prevent memory leaks
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
    };

    // Cleanup on component unmount
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    return (
        <>
            <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Chọn hoặc kéo thả file vào để tải lên tài liệu</p>
                <p className="ant-upload-hint">
                    Chỉ hỗ trợ tải lên một tệp. Bạn cần cung cấp thêm thông tin trước khi tải lên.
                </p>
            </Dragger>

            <ModalUploadFileDashboard
                visible={isModalOpen}
                file={selectedFile}
                onCancel={handleCancel}
                onSuccess={handleSuccess}
            />
        </>
    );
}