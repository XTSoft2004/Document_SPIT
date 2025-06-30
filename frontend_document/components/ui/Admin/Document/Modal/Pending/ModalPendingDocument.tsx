'use client';

import { useState, useEffect, use } from 'react';
import { Modal, Form, Input, Select, message, Button, Upload } from 'antd';
import { InboxOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadProps, UploadFile } from 'antd';
import { createDocument } from '@/actions/document.actions';
import { ICourseResponse } from '@/types/course';
import NotificationService from '@/components/ui/Notification/NotificationService';
import FilePreview from '@/components/common/FilePreview';
import { handleFilePreview } from '@/utils/filePreview';
import { IDocumentPendingRequest } from '@/types/document';
import { getCourse } from '@/actions/course.action';

const { Dragger } = Upload;

interface ModalPendingDocumentProps {
    visible: boolean;
    // courses: ICourseResponse[];
    onCancel: () => void;
    onSuccess?: () => void;
}

export default function ModalPendingDocument({
    visible,
    // courses,
    onCancel,
    onSuccess,
}: ModalPendingDocumentProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
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

                // // Auto fill tên file
                // if (!form.getFieldValue('name')) {
                //     const fileName = file.name.replace(/\.[^/.]+$/, "");
                //     form.setFieldsValue({ name: fileName });
                // }

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
            width={1000} // Giảm width từ 1200 xuống 1000
            style={{ top: 10 }} // Đẩy modal lên trên
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
                    disabled={fileList.length === 0}
                    size="middle"
                    className="bg-blue-500 text-white hover:bg-blue-600 border-none rounded-md"
                >
                    Upload tài liệu
                </Button>,
            ]}
        >
            <div className="flex gap-4"> {/* Giảm height từ 600px xuống 480px */}
                {/* Form bên trái */}
                <div className="flex-1 overflow-y-auto pr-2">
                    <Form
                        form={form}
                        layout="vertical"
                        size="small" // Giảm kích thước form
                    >
                        {/* Upload Area */}
                        <Form.Item>
                            <Dragger {...uploadProps} className="mb-3" style={{ minHeight: 50 }}> {/* Giảm chiều cao */}
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined className="text-3xl text-blue-500" /> {/* Giảm icon size */}
                                </p>
                                <p className="ant-upload-text text-base font-medium"> {/* Giảm text size */}
                                    Kéo thả file vào đây hoặc click để chọn
                                </p>
                                <p className="ant-upload-hint text-gray-500 text-sm"> {/* Giảm hint size */}
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
                                size="large" // Giảm size input
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
                                size="large" // Giảm size select
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

                        <div className="bg-blue-50 p-3 rounded-lg"> {/* Giảm padding */}
                            <p className="text-xs text-blue-700 mb-1"> {/* Giảm text size */}
                                <strong>📋 Hướng dẫn upload:</strong>
                            </p>
                            <ul className="text-xs text-blue-600 space-y-0.5"> {/* Giảm text size và spacing */}
                                <li>• Chọn file từ máy tính</li>
                                <li>• Điền tên tài liệu rõ ràng</li>
                                <li>• Chọn môn học phù hợp</li>
                                <li>• Tài liệu sẽ được gửi để duyệt</li>
                            </ul>
                        </div>
                    </Form>
                </div>

                {/* Preview bên phải */}
                <div className="w-[350px] border-l border-gray-200 pl-4"> {/* Giảm width và padding */}
                    <div className="h-full">
                        {previewSrc && previewType !== "unsupported" ? (
                            <FilePreview
                                src={previewSrc}
                                type={previewType}
                                isMobile={false}
                            />
                        ) : (
                            <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                                <div className="text-center p-4"> {/* Giảm padding */}
                                    <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center"> {/* Giảm size icon */}
                                        <InboxOutlined className="text-xl text-blue-500" /> {/* Giảm text size */}
                                    </div>
                                    <h3 className="text-base font-semibold text-gray-700 mb-1"> {/* Giảm text size */}
                                        Xem trước file
                                    </h3>
                                    <p className="text-xs text-gray-500"> {/* Giảm text size */}
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