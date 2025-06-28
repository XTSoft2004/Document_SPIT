'use client';

import { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, message, Button, Upload } from 'antd';
import { InboxOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadProps, UploadFile } from 'antd';
import { createDocument } from '@/actions/document.actions';
import { ICourseResponse } from '@/types/course';
import NotificationService from '@/components/ui/Notification/NotificationService';
import FilePreview from '@/components/common/FilePreview';
import { handleFilePreview } from '@/utils/filePreview';
import { IDocumentPendingRequest } from '@/types/document';

const { Dragger } = Upload;

interface ModalPendingDocumentProps {
    visible: boolean;
    courses: ICourseResponse[];
    onCancel: () => void;
    onSuccess?: () => void;
}

export default function ModalPendingDocument({
    visible,
    courses,
    onCancel,
    onSuccess,
}: ModalPendingDocumentProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewSrc, setPreviewSrc] = useState<string | null>(null);
    const [previewType, setPreviewType] = useState<"pdf" | "image" | "unsupported" | null>(null);

    // Reset form khi modal mở/đóng
    useEffect(() => {
        if (visible) {
            form.resetFields();
            setFileList([]);
            setPreviewSrc(null);
            setPreviewType(null);
        }
    }, [visible, form]);

    // Upload props
    const uploadProps: UploadProps = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        fileList,
        accept: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.webp,.txt',
        beforeUpload: (file) => {
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

            return false; // Prevent auto upload
        },
        onChange: (info) => {
            const { fileList: newFileList } = info;
            setFileList([...newFileList]);

            if (newFileList.length > 0 && newFileList[0].originFileObj) {
                const file = newFileList[0];

                // Auto fill tên file
                if (!form.getFieldValue('name')) {
                    const fileName = file.name.replace(/\.[^/.]+$/, "");
                    form.setFieldsValue({ name: fileName });
                }

                // Generate preview
                handleFilePreview(file, setPreviewSrc, setPreviewType, () => {
                    message.warning("Không thể xem trước file này.");
                    setPreviewSrc(null);
                    setPreviewType(null);
                });
            } else {
                setPreviewSrc(null);
                setPreviewType(null);
            }
        },
        onRemove: () => {
            setFileList([]);
            setPreviewSrc(null);
            setPreviewType(null);
            return true;
        },
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            if (fileList.length === 0) {
                message.error('Vui lòng chọn file để upload!');
                return;
            }

            console.log('Submitting document:', values);
            console.log('FileList:', fileList);
            
            setLoading(true);

            // Lấy file từ fileList state thay vì form values
            const file = fileList[0];
            if (!file.originFileObj) {
                message.error('Không tìm thấy file để upload!');
                return;
            }

            const base64String = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj as File);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = () => reject(new Error('Không thể đọc file'));
            });

            const documentPending: IDocumentPendingRequest = {
                name: values.name,
                fileName: file.name || "",
                base64String,
                courseId: values.courseId.toString(),
            };

            console.log('Document data:', documentPending);

            const response = await createDocument(documentPending);
            if (response.ok) {
                NotificationService.success({
                    message: 'Upload tài liệu thành công',
                    description: 'Tài liệu đã được upload và đang chờ duyệt.',
                });
                handleCancel();
                onSuccess?.();
            } else {
                NotificationService.error({
                    message: response.message || 'Upload tài liệu thất bại',
                });
            }

        } catch (error) {
            console.error('Error uploading document:', error);
            message.error('Có lỗi xảy ra khi upload tài liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setFileList([]);
        setPreviewSrc(null);
        setPreviewType(null);
        onCancel();
    };

    const clearFile = () => {
        setFileList([]);
        setPreviewSrc(null);
        setPreviewType(null);
    };

    return (
        <Modal
            title="Upload tài liệu mới"
            open={visible}
            onCancel={handleCancel}
            width={1200}
            footer={[
                <Button key="cancel" onClick={handleCancel} disabled={loading}>
                    Hủy
                </Button>,
                <Button
                    key="upload"
                    type="primary"
                    onClick={handleSubmit}
                    loading={loading}
                    disabled={fileList.length === 0}
                >
                    Upload tài liệu
                </Button>,
            ]}
        >
            <div className="flex gap-6 h-[600px]">
                {/* Form bên trái */}
                <div className="flex-1 overflow-y-auto">
                    <Form
                        form={form}
                        layout="vertical"
                        requiredMark={false}
                    >
                        {/* Upload Area */}
                        <Form.Item label="Chọn file tài liệu">
                            <Dragger {...uploadProps} className="mb-4">
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined className="text-4xl text-blue-500" />
                                </p>
                                <p className="ant-upload-text text-lg font-medium">
                                    Kéo thả file vào đây hoặc click để chọn
                                </p>
                                <p className="ant-upload-hint text-gray-500">
                                    Hỗ trợ PDF, Word, Excel, PowerPoint, hình ảnh. Tối đa 50MB.
                                </p>
                            </Dragger>
                        </Form.Item>

                        <Form.Item
                            label="Tên tài liệu"
                            name="name"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên tài liệu' },
                                { min: 3, message: 'Tên tài liệu phải có ít nhất 3 ký tự' },
                            ]}
                        >
                            <Input
                                placeholder="Nhập tên tài liệu"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Môn học"
                            name="courseId"
                            rules={[{ required: true, message: "Vui lòng chọn môn học!" }]}
                        >
                            <Select
                                showSearch
                                placeholder="Chọn môn học"
                                size="large"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    (`${option?.label ?? ''}`).toLowerCase().includes(input.toLowerCase())
                                }
                                options={courses.map(course => ({
                                    value: course.id,
                                    label: `${course.code} - ${course.name}`
                                }))}
                            />
                        </Form.Item>

                        <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm text-blue-700 mb-2">
                                <strong>📋 Hướng dẫn upload:</strong>
                            </p>
                            <ul className="text-sm text-blue-600 space-y-1">
                                <li>• Chọn file tài liệu từ máy tính của bạn</li>
                                <li>• Điền tên tài liệu rõ ràng, dễ hiểu</li>
                                <li>• Chọn môn học phù hợp</li>
                                <li>• Tài liệu sẽ được gửi đến admin để duyệt</li>
                            </ul>
                        </div>
                    </Form>
                </div>

                {/* Preview bên phải */}
                <div className="w-[400px] border-l border-gray-200 pl-6">
                    <div className="h-full">
                        {previewSrc && previewType !== "unsupported" ? (
                            <FilePreview
                                src={previewSrc}
                                type={previewType}
                                isMobile={false}
                            />
                        ) : (
                            <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                                <div className="text-center p-8">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center">
                                        <InboxOutlined className="text-2xl text-blue-500" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                        Xem trước file
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Chọn file để xem trước nội dung
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
}