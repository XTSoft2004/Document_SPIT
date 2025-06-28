'use client';

import { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, message, Button } from 'antd';
import { IDocumentRequest, IDocumentResponse, IDocumentReviewRequest } from '@/types/document';
import { reviewDocument } from '@/actions/document.actions';
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
    const [previewKey, setPreviewKey] = useState(0);
    const [currentFolderId, setCurrentFolderId] = useState<string>('');

    useEffect(() => {
        if (visible && Document) {
            form.setFieldsValue({
                name: Document.name,
                courseId: Document.courseId,
                folderId: undefined, // Để user phải chọn thư mục
            });

            const initialCourse = courses.find(course => Number(course.id) === Number(Document.courseId));
            const courseFolderId = initialCourse?.folderId || '';
            setCurrentFolderId(courseFolderId);

            if (courseFolderId) {
                setSelectedFolderId({
                    id: courseFolderId,
                    name: initialCourse?.name || 'Course Folder'
                });
            }
        } else if (visible) {
            setCurrentFolderId('');
            setSelectedFolderId(null);
        }
    }, [visible, Document, form, courses]);

    const handleSubmit = async (statusDocument: string) => {
        try {
            setLoading(true);

            // Validate form trước khi submit
            const values = await form.validateFields();

            if (!Document) {
                message.error('Không tìm thấy thông tin tài liệu');
                return;
            }

            const courseId = values.courseId || Document.courseId;
            const selectedCourse = courses.find(course => Number(course.id) === Number(courseId));
            const courseFolderId = selectedCourse?.folderId;

            const documentReview: IDocumentReviewRequest = {
                name: values.name || Document.name,
                courseId: courseId,
                folderId: values.folderId || selectedFolderId?.id || courseFolderId || '',
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
        } catch (error: any) {
            if (error?.errorFields) {
                // Form validation errors
                message.error('Vui lòng điền đầy đủ thông tin bắt buộc');
            } else {
                console.error('Error reviewing document:', error);
                message.error('Có lỗi xảy ra khi duyệt tài liệu');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setSelectedFolderId(null);
        setCurrentFolderId('');
        setPreviewKey(prev => prev + 1);
        onCancel();
    };

    const handleCourseChange = (courseId: string) => {
        form.setFieldsValue({ courseId });

        const selectedCourse = courses.find(course => Number(course.id) === Number(courseId));
        if (selectedCourse && selectedCourse.folderId) {
            setCurrentFolderId(selectedCourse.folderId);
            setSelectedFolderId({
                id: selectedCourse.folderId,
                name: selectedCourse.name
            });
        } else {
            setCurrentFolderId('');
            setSelectedFolderId(null);
            form.setFieldsValue({ folderId: undefined });
        }
        NotificationService.success({
            message: `Đã chọn môn học: ${selectedCourse?.name || 'Không tìm thấy môn học'}`,
        });
    };

    return (
        <Modal
            title="Duyệt tài liệu"
            open={visible}
            onCancel={handleCancel}
            width={1000}
            style={{ top: 20 }}
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
            <div className="flex gap-4 h-[500px]">
                <div className="flex-1 overflow-y-auto">
                    <Form form={form} layout="vertical">
                        <Form.Item
                            label="Tên tài liệu"
                            name="name"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên tài liệu' },
                                { min: 3, message: 'Tên tài liệu phải có ít nhất 3 ký tự' },
                            ]}
                        >
                            <Input placeholder="Nhập tên tài liệu" size="middle" />
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
                    </Form>
                </div>

                <div className="w-full lg:w-[320px] border-t lg:border-t-0 lg:border-l border-gray-200 pt-3 lg:pt-0 lg:pl-4 mt-3 lg:mt-0">
                    {Document ? (
                        <div className="h-[300px] lg:h-[400px]">
                            <PreviewPanel
                                key={`preview-${Document.id}-${previewKey}`}
                                selectedItem={Document}
                                onClose={() => { }}
                                className="ml-0 h-full"
                                showCloseButton={false}
                            />
                        </div>
                    ) : (
                        <div className="h-[300px] lg:h-[400px] flex items-center justify-center bg-gray-50 rounded-md">
                            <div className="text-center p-4">
                                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-1">
                                    Xem trước tài liệu
                                </h3>
                                <p className="text-xs text-gray-500">
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
