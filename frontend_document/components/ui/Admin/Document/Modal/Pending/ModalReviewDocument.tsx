'use client';

import { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, message, Button, Space } from 'antd';
import { IDocumentRequest, IDocumentResponse, IDocumentReviewRequest } from '@/types/document';
import { reviewDocument, updateDocument } from '@/actions/document.actions';
import { IDepartmentResponse } from '@/types/department';
import FolderSelector from '@/components/common/FolderSelector';
import { ICourseResponse } from '@/types/course';
import { IFileInfo } from '@/types/driver';
import NotificationService from '@/components/ui/Notification/NotificationService';
import PreviewPanel from '@/components/ui/Admin/Document/PreviewPanel';

interface ModalReviewDocumentProps {
    visible: boolean;
    Document?: IDocumentResponse;
    courses: ICourseResponse[];
    onCancel: () => void;
}

export default function ModalReviewDocument({
    visible,
    Document,
    courses,
    onCancel,
}: ModalReviewDocumentProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [selectedFolderId, setSelectedFolderId] = useState<IFileInfo | null>(null);
    const [previewKey, setPreviewKey] = useState(0); // Key để force re-render preview
    const [currentFolderId, setCurrentFolderId] = useState<string>(''); // Folder ID hiện tại cho FolderSelector

    // Load initial values when modal opens
    useEffect(() => {
        if (visible && Document) {
            form.setFieldsValue({
                name: Document.name,
                courseId: Document.courseId,
                folderId: Document.folderId,
            });
            
            // Set folder ID ban đầu từ course tương ứng với Document
            const initialCourse = courses.find(course => Number(course.id) === Number(Document.courseId));
            const courseFolderId = initialCourse?.folderId || '';
            setCurrentFolderId(courseFolderId);
            
            // Set selected folder info từ course, không phải từ document
            if (courseFolderId) {
                setSelectedFolderId({
                    id: courseFolderId,
                    name: initialCourse?.name || 'Course Folder'
                });
            }
        } else if (visible) {
            // Reset khi mở modal mà không có Document
            setCurrentFolderId('');
            setSelectedFolderId(null);
        }
    }, [visible, Document, form, courses]);

    const handleSubmit = async (statusDocument: string) => {
        try {
            setLoading(true);

            if (!Document) {
                message.error('Không tìm thấy thông tin tài liệu');
                return;
            }

            // Lấy courseId từ form
            const courseId = form.getFieldValue('courseId') || Document.courseId;
            
            // Tìm course tương ứng để lấy folderId
            const selectedCourse = courses.find(course => Number(course.id) === Number(courseId));
            const courseFolderId = selectedCourse?.folderId;

            const documentReview: IDocumentReviewRequest = {
                name: form.getFieldValue('name') || Document.name,
                courseId: courseId,
                folderId: selectedFolderId?.id || courseFolderId || '', // Ưu tiên folder được chọn, sau đó là folderId của course
                statusDocument: statusDocument,
            };

            const response = await reviewDocument(Document.id.toString(), documentReview);

            if (response.ok) {
                NotificationService.success({
                    message: statusDocument === 'APPROVED' ? 'Duyệt tài liệu thành công' : 'Từ chối tài liệu thành công',
                });
                form.resetFields();
                onCancel();
            } else {
                NotificationService.error({
                    message: response.message || 'Xảy ra lỗi khi duyệt tài liệu',
                });
            }
        } catch (error) {
            console.error('Error reviewing document:', error);
            message.error('Có lỗi xảy ra khi duyệt tài liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setSelectedFolderId(null);
        setCurrentFolderId('');
        setPreviewKey(prev => prev + 1); // Reset preview
        onCancel();
    };

    const handleCourseChange = (courseId: string) => {
        // Cập nhật courseId trong form
        form.setFieldsValue({ courseId });
        
        // Tìm course tương ứng và cập nhật folderId từ course
        const selectedCourse = courses.find(course => Number(course.id) === Number(courseId));
        if (selectedCourse && selectedCourse.folderId) {
            setCurrentFolderId(selectedCourse.folderId);
            // Set selected folder từ course
            setSelectedFolderId({
                id: selectedCourse.folderId,
                name: selectedCourse.name
            });
            form.setFieldsValue({ folderId: selectedCourse.folderId });
        } else {
            // Reset nếu course không có folderId
            setCurrentFolderId('');
            setSelectedFolderId(null);
            form.setFieldsValue({ folderId: undefined });
        }
        NotificationService.success({
            message: `Đã chọn môn học: ${selectedCourse?.name || 'Không tìm thấy môn học'}`,
        });
    };

    const handleReload = () => {
        setPreviewKey(prev => prev + 1); // Force refresh preview
    };

    return (
        <Modal
            title="Duyệt tài liệu"
            open={visible}
            onCancel={handleCancel}
            width={1200} // Tăng width để chứa preview
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Hủy
                </Button>,
                <Button
                    key="reject"
                    danger
                    onClick={() => handleSubmit('REJECTED')}
                    loading={loading}
                >
                    Từ chối
                </Button>,
                <Button
                    key="approve"
                    type="primary"
                    onClick={() => handleSubmit('APPROVED')}
                    loading={loading}
                >
                    Duyệt
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
                                size="middle"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Môn học:"
                            name="courseId"
                            rules={[{ required: true, message: "Vui lòng chọn môn học!" }]}
                        >
                            <Select
                                showSearch
                                placeholder="Chọn môn học"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    (`${option?.label ?? ''}`).toLowerCase().includes(input.toLowerCase())
                                }
                                options={courses.map(course => ({
                                    value: course.id,
                                    label: `${course.code} - ${course.name}`
                                }))}
                                onChange={handleCourseChange}
                            />
                        </Form.Item>

                        <Form.Item name="folderId" label="Chọn thư mục" rules={[{ required: true, message: 'Vui lòng chọn thư mục' }]}>
                            <FolderSelector
                                onSelect={(folder, _) => {
                                    setSelectedFolderId(folder);
                                    form.setFieldsValue({ folderId: folder.id });
                                }}
                                folderIdCurrent={currentFolderId}
                            />
                        </Form.Item>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600 mb-2">
                                <strong>Hướng dẫn:</strong>
                            </p>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Kiểm tra và chỉnh sửa tên tài liệu nếu cần</li>
                                <li>• Chọn môn học phù hợp cho tài liệu</li>
                                <li>• Chọn thư mục để lưu trữ tài liệu</li>
                                <li>• Nhấn "Duyệt" để phê duyệt hoặc "Từ chối" để từ chối tài liệu</li>
                            </ul>
                        </div>
                    </Form>
                </div>

                {/* Preview bên phải */}
                <div className="w-[400px] border-l border-gray-200 pl-6">
                    {Document ? (
                        <PreviewPanel
                            key={`preview-${Document.id}-${previewKey}`}
                            selectedItem={Document}
                            onClose={() => { }} // Không cần close vì đã trong modal
                            className="ml-0" // Override margin left
                            showCloseButton={false} // Ẩn nút close trong modal
                        />
                    ) : (
                        <div className="h-[80%] flex items-center justify-center bg-gray-50 rounded-lg">
                            <div className="text-center p-8">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center">
                                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                    Xem trước tài liệu
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Chọn tài liệu để xem trước
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}
