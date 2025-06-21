'use client';
import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Modal, Form, Input, Button } from 'antd';
import Dragger from 'antd/es/upload/Dragger';

export default function DraggerUpload() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fileList, setFileList] = useState<any[]>([]);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [fileType, setFileType] = useState<string | null>(null);
    const [form] = Form.useForm();

    const props: UploadProps = {
        name: 'file',
        multiple: false,
        beforeUpload: (file) => {
            setFileList([file]);
            setFileType(file.type);

            // Tạo URL preview cho file
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);

            setIsModalOpen(true);
            return false; // Chặn upload tự động
        },
        showUploadList: false,
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            const formData = new FormData();
            formData.append('file', fileList[0]);
            formData.append('description', values.description);

            const response = await fetch('https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                message.success(`${fileList[0].name} uploaded successfully with description.`);
                setFileList([]);
                setPreviewUrl(null); // Xóa URL preview
                setFileType(null);
                form.resetFields();
                setIsModalOpen(false);
            } else {
                message.error(`${fileList[0].name} upload failed.`);
            }
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setFileList([]);
        setPreviewUrl(null); // Xóa URL preview
        setFileType(null);
        form.resetFields();
    };

    // Hàm để render preview dựa trên loại file
    const renderPreview = () => {
        if (!previewUrl || !fileType) return null;

        if (fileType.startsWith('image/')) {
            return <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />;
        } else if (fileType === 'application/pdf') {
            return (
                <iframe
                    src={previewUrl}
                    style={{ width: '100%', height: '200px', border: 'none' }}
                    title="PDF Preview"
                />
            );
        } else {
            return <p>🚨 Tài liệu này không hỗ trợ xem trước <b>{fileList[0]?.name}</b></p>;
        }
    };

    return (
        <>
            <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Support for a single file upload. You need to provide additional information before upload.
                </p>
            </Dragger>

            <Modal
                title="Tải lên tài liệu"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Upload"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Tên tài liệu"
                        rules={[{ required: true, message: 'Vui lòng nhập tên tài liệu' }]}
                    >
                        <Input placeholder="Tên tài liệu" />
                    </Form.Item>


                    <Form.Item label="Xem trước tài liệu">
                        {renderPreview()}
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}