'use client'
import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Modal, Form, Input, Button } from 'antd';
import Dragger from 'antd/es/upload/Dragger';

export default function DraggerUpload() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fileList, setFileList] = useState<any[]>([]);
    const [form] = Form.useForm();

    const props: UploadProps = {
        name: 'file',
        multiple: false,
        beforeUpload: (file) => {
            setFileList([file]); // lưu file lại
            setIsModalOpen(true); // mở modal
            return false; // chặn upload tự động
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
        form.resetFields();
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
                title="Enter file information"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Upload"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Please enter a description' }]}
                    >
                        <Input placeholder="Enter file description" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
