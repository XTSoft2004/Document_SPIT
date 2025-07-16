'use client';

import { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, message, Button } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { createDocument } from '@/actions/document.actions';
import { ICourseResponse } from '@/types/course';
import NotificationService from '@/components/ui/Notification/NotificationService';
import FilePreview from '@/components/common/FilePreview';
import { handleFilePreview } from '@/utils/filePreview';
import { IDocumentPendingRequest } from '@/types/document';
import { getCourse } from '@/actions/course.action';

interface ModalUploadFileDashboardProps {
    visible: boolean;
    file: UploadFile | null; // File được truyền từ bên ngoài
    onCancel: () => void;
    onSuccess?: () => void;
}

export default function ModalUploadFileDashboard({
    visible,
    file,
    onCancel,
    onSuccess,
}: ModalUploadFileDashboardProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [previewSrc, setPreviewSrc] = useState<string | null>(null);
    const [previewType, setPreviewType] = useState<"pdf" | "image" | "unsupported" | null>(null);

    const [loadingCourses, setLoadingCourses] = useState(false);
    const [courses, setCourses] = useState<ICourseResponse[]>([]);

    const handleSearchCourse = async (search: string) => {
        if (search && search.trim() !== '') {
            setLoadingCourses(true);
            const response = await getCourse(search, 1, 20);
            if (response.ok) {
                setCourses(response.data);
                console.log(response.data);
            }
            setLoadingCourses(false);
        }
    }

    // Reset form khi modal mở/đóng
    useEffect(() => {
        if (visible) {
            form.resetFields();
            setPreviewSrc(null);
            setPreviewType(null);
        }
    }, [visible, form]);

    // Xử lý preview file khi có file từ bên ngoài
    useEffect(() => {
        if (file && file.originFileObj) {
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
    }, [file, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            if (!file || !file.originFileObj) {
                message.error('Không tìm thấy file để upload!');
                return;
            }

            console.log('Submitting document:', values);
            console.log('File:', file);

            setLoading(true);

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

            const response = await createDocument(documentPending);
            if (response.ok) {
                NotificationService.success({
                    message: 'Tải lên tài liệu thành công',
                    description: 'Tài liệu đã được vào hàng đợi và đang chờ duyệt.',
                });
                handleCancel();
                onSuccess?.();
            } else {
                NotificationService.error({
                    message: response.message || 'Tải lên tài liệu thất bại',
                });
            }

        } catch (error: any) {
            if (error?.errorFields) {
                // Form validation errors
                NotificationService.error({
                    message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setPreviewSrc(null);
        setPreviewType(null);
        onCancel();
    };

    return (
        <Modal
            title="Tải lên tài liệu từ trang chủ"
            open={visible}
            onCancel={handleCancel}
            width={1000}
            style={{ top: 10 }}
            footer={[
                <Button
                    key="cancel"
                    onClick={handleCancel}
                    disabled={loading}
                    size="middle"
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-none rounded-md"
                >
                    Hủy
                </Button>,
                <Button
                    key="upload"
                    type="primary"
                    onClick={handleSubmit}
                    loading={loading}
                    disabled={!file}
                    size="middle"
                    className="bg-blue-500 text-white hover:bg-blue-600 border-none rounded-md"
                >
                    Tải lên tài liệu
                </Button>,
            ]}
        >
            <div className="flex gap-4">
                {/* Form bên trái */}
                <div className="flex-1 overflow-y-auto pr-2">
                    <Form
                        form={form}
                        layout="vertical"
                        size="small"
                    >
                        {/* File Info Display */}
                        <Form.Item>
                            <div className="mb-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                                        <InboxOutlined className="text-white text-xl" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-base font-semibold text-gray-800 mb-1">
                                            {file?.name || 'Chưa có file được chọn'}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            {file ? `Kích thước: ${((file.size || 0) / 1024 / 1024).toFixed(2)} MB` : 'Vui lòng chọn file từ dashboard'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${file ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {file ? 'Đã chọn' : 'Chưa chọn'}
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                                notFoundContent={loadingCourses ? 'Đang tải môn học...' : 'Không tìm thấy môn học'}
                                onSearch={handleSearchCourse}
                                options={courses.map(course => ({
                                    value: course.id,
                                    label: `${course.code} - ${course.name}`
                                }))}
                            />
                        </Form.Item>

                        <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-xs text-green-700 mb-1">
                                <strong>📋 Thông tin upload:</strong>
                            </p>
                            <ul className="text-xs text-green-600 space-y-0.5">
                                <li>• File đã được chọn từ dashboard</li>
                                <li>• Điền tên tài liệu rõ ràng</li>
                                <li>• Chọn môn học phù hợp</li>
                                <li>• Tài liệu sẽ được gửi để duyệt</li>
                            </ul>
                        </div>
                    </Form>
                </div>

                {/* Preview bên phải */}
                <div className="w-[350px] border-l border-gray-200 pl-4">
                    <div className="h-full">
                        {previewSrc && previewType !== "unsupported" ? (
                            <FilePreview
                                src={previewSrc}
                                type={previewType}
                                isMobile={false}
                            />
                        ) : (
                            <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                                <div className="text-center p-4">
                                    <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center">
                                        <InboxOutlined className="text-xl text-blue-500" />
                                    </div>
                                    <h3 className="text-base font-semibold text-gray-700 mb-1">
                                        {file ? 'Xem trước file' : 'Chưa có file'}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {file ? 'Đang xử lý xem trước...' : 'Vui lòng chọn file từ dashboard'}
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
