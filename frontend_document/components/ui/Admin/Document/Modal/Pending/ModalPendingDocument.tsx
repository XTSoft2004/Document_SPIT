'use client';

import { useState, useEffect, use } from 'react';
import { Modal, Form, Input, Select, message, Button, Upload } from 'antd';
import { InboxOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadProps, UploadFile } from 'antd';
import { createDocument } from '@/actions/document.actions';
import { ICourseResponse } from '@/types/course';
import NotificationService from '@/components/ui/Notification/NotificationService';
import FilePreview from '@/components/common/FilePreviewDashboard';
import { handleFilePreview } from '@/utils/filePreview';
import { IDocumentPendingRequest } from '@/types/document';
import { getCourse } from '@/actions/course.action';
import FilePreviewDashboard from '@/components/common/FilePreviewDashboard';
import { convertImagesToPDF, ImageFile } from '@/utils/pdfUtils';
import ImagePreviewModal from '@/components/ui/Contribute/ImagePreviewModal';

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

    // State cho xử lý ảnh
    const [images, setImages] = useState<ImageFile[]>([]);
    const [showImagePreviewModal, setShowImagePreviewModal] = useState(false);
    const [finalFile, setFinalFile] = useState<File | null>(null);

    const [loadingCourses, setLoadingCourses] = useState(false);
    const [courses, setCourses] = useState<ICourseResponse[]>([]);
    const handleSearchCourse = async (search: string) => {
        setLoadingCourses(true);
        const response = await getCourse(search, 1, 20);
        if (response.ok) {
            setCourses(response.data);
        }
        setLoadingCourses(false);
    }

    // Reset form khi modal mở/đóng
    useEffect(() => {
        handleSearchCourse('');
        if (visible) {
            form.resetFields();
            setFileList([]);
            setPreviewSrc(null);
            setPreviewType(null);
            setImages([]);
            setShowImagePreviewModal(false);
            setFinalFile(null);
        }
    }, [visible, form]);

    // Upload props
    const uploadProps: UploadProps = {
        name: 'file',
        multiple: true, // Cho phép chọn nhiều file
        maxCount: 10, // Tối đa 10 file
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

            // Kiểm tra nếu tất cả file là ảnh
            const imageFiles = newFileList.filter(file =>
                file.originFileObj && file.originFileObj.type.startsWith('image/')
            );

            if (imageFiles.length === newFileList.length && imageFiles.length > 0) {
                // Tất cả file đều là ảnh
                const newImages: ImageFile[] = imageFiles.map(file => ({
                    id: file.uid,
                    file: file.originFileObj as File,
                    preview: URL.createObjectURL(file.originFileObj as File)
                }));

                setImages(newImages);

                if (newImages.length === 1) {
                    // 1 ảnh - set trực tiếp làm final file
                    setFinalFile(newImages[0].file);
                    // Generate preview cho ảnh đơn
                    handleFilePreview(imageFiles[0], setPreviewSrc, setPreviewType, () => {
                        message.warning("Không thể xem trước file này.");
                        setPreviewSrc(null);
                        setPreviewType(null);
                    });
                } else if (newImages.length > 1) {
                    // Nhiều ảnh - mở modal preview
                    setShowImagePreviewModal(true);
                    setFinalFile(null);
                    setPreviewSrc(null);
                    setPreviewType(null);
                }
            } else if (newFileList.length === 1 && !newFileList[0].originFileObj?.type.startsWith('image/')) {
                // File đơn không phải ảnh
                setImages([]);
                setFinalFile(newFileList[0].originFileObj as File);
                // Generate preview
                handleFilePreview(newFileList[0], setPreviewSrc, setPreviewType, () => {
                    message.warning("Không thể xem trước file này.");
                    setPreviewSrc(null);
                    setPreviewType(null);
                });
            } else {
                // Mixed files hoặc không có file
                setImages([]);
                setFinalFile(null);
                setPreviewSrc(null);
                setPreviewType(null);
            }
        },
        onRemove: () => {
            setFileList([]);
            setImages([]);
            setFinalFile(null);
            setPreviewSrc(null);
            setPreviewType(null);
            return true;
        },
    };

    const handleImagePreviewSave = async (reorderedImages: ImageFile[]) => {
        setImages(reorderedImages);
        setShowImagePreviewModal(false);

        try {
            // Convert images to PDF
            const documentName = form.getFieldValue('name') || 'document';
            const pdfFile = await convertImagesToPDF(reorderedImages, documentName);
            setFinalFile(pdfFile);

            // Generate preview for the PDF
            const fakeUploadFile = {
                uid: 'pdf-preview',
                name: `${documentName}.pdf`,
                type: 'application/pdf',
                originFileObj: pdfFile
            } as UploadFile;

            handleFilePreview(fakeUploadFile, setPreviewSrc, setPreviewType, () => {
                message.warning("Không thể xem trước file PDF.");
                setPreviewSrc(null);
                setPreviewType(null);
            });

            message.success(`Đã gộp ${reorderedImages.length} ảnh thành PDF`);
        } catch (error) {
            message.error('Có lỗi xảy ra khi gộp ảnh thành PDF');
            console.error(error);
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            // Kiểm tra có file hay không
            if (!finalFile && fileList.length === 0) {
                message.error('Vui lòng chọn file để upload!');
                return;
            }

            console.log('Submitting document:', values);
            console.log('FinalFile:', finalFile);
            console.log('FileList:', fileList);

            setLoading(true);

            let fileToUpload = finalFile;

            // Nếu chưa có finalFile, thử lấy từ fileList
            if (!fileToUpload && fileList.length > 0) {
                const file = fileList[0];
                if (!file.originFileObj) {
                    message.error('Không tìm thấy file để upload!');
                    return;
                }
                fileToUpload = file.originFileObj as File;
            }

            if (!fileToUpload) {
                message.error('Không tìm thấy file để upload!');
                return;
            }

            const base64String = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(fileToUpload as File);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = () => reject(new Error('Không thể đọc file'));
            });

            const documentPending: IDocumentPendingRequest = {
                name: values.name,
                fileName: fileToUpload.name || "",
                base64String,
                courseId: values.courseId.toString(),
            };

            const response = await createDocument(documentPending);
            if (response.ok) {
                NotificationService.success({
                    message: 'Tải tài liệu thành công',
                    description: 'Tài liệu đã được thêm vào danh sách chờ và đang chờ duyệt.',
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
        setFileList([]);
        setImages([]);
        setFinalFile(null);
        setPreviewSrc(null);
        setPreviewType(null);
        setShowImagePreviewModal(false);
        onCancel();
    };

    const clearFile = () => {
        setFileList([]);
        setImages([]);
        setFinalFile(null);
        setPreviewSrc(null);
        setPreviewType(null);
        setShowImagePreviewModal(false);
    };

    return (
        <Modal
            title="Tải lên tài liệu mới"
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
                    disabled={!finalFile && fileList.length === 0}
                    size="middle"
                    className="bg-blue-500 text-white hover:bg-blue-600 border-none rounded-md"
                >
                    Tải lên tài liệu
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
                                    Hỗ trợ PDF, Word, Excel, PowerPoint, hình ảnh. Tối đa 50MB. Có thể chọn nhiều ảnh để gộp PDF.
                                </p>
                            </Dragger>

                            {/* Preview Button cho nhiều ảnh */}
                            {images.length > 1 && (
                                <Button
                                    type="primary"
                                    onClick={() => setShowImagePreviewModal(true)}
                                    className="w-full mt-2"
                                    icon={<InboxOutlined />}
                                >
                                    Preview & Sắp xếp ảnh ({images.length})
                                </Button>
                            )}
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
                            <p className="text-sm text-blue-700 mb-1"> {/* Giảm text size */}
                                <strong>📋 Hướng dẫn upload:</strong>
                            </p>
                            <ul className="text-sm text-blue-600 space-y-0.5"> {/* Giảm text size và spacing */}
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
                        {/* Debug info */}
                        {/* <div className="text-xs text-gray-500 mb-2">
                            Debug: previewSrc={previewSrc ? 'có' : 'null'}, previewType={previewType}
                        </div> */}

                        {previewSrc && previewType !== "unsupported" ? (
                            <FilePreviewDashboard
                                src={previewSrc}
                                type={previewType}
                                isMobile={false}
                                isFooter={true}
                                isHeader={true}
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

            {/* Image Preview Modal */}
            <ImagePreviewModal
                isOpen={showImagePreviewModal}
                images={images}
                documentName={form.getFieldValue('name') || 'document'}
                onClose={() => setShowImagePreviewModal(false)}
                onSave={handleImagePreviewSave}
            />
        </Modal>
    );
}