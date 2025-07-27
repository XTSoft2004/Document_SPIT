'use client';

import { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, message, Button } from 'antd';
import { IDocumentRequest, IDocumentResponse, IDocumentReviewRequest } from '@/types/document';
import { reviewDocument, updateDocument } from '@/actions/document.actions';
import { IDepartmentResponse } from '@/types/department';
import FolderSelector from '@/components/common/FolderSelector';
import { ICourseResponse } from '@/types/course';
import { IFileInfo } from '@/types/driver';
import NotificationService from '@/components/ui/Notification/NotificationService';
import PreviewPanel from '@/components/common/PreviewPanel';
import { getCourse, getCourseById } from '@/actions/course.action';
import { ICategoryResponse } from '@/types/category';
import { getCategory } from '@/actions/category.actions';

interface ModalReviewDocumentProps {
    visible: boolean;
    Document?: IDocumentResponse;
    onCancel: () => void;
}

export default function ModalReviewDocument({
    visible,
    Document,
    onCancel,
}: ModalReviewDocumentProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [loadingInfo, setLoadingInfo] = useState(false);
    const [selectedFolderId, setSelectedFolderId] = useState<IFileInfo | null>(null);
    const [previewKey, setPreviewKey] = useState(0);
    const [currentFolderId, setCurrentFolderId] = useState<string>('');

    const [courses, setCourses] = useState<ICourseResponse[]>([]);
    const handleSearchCourse = async (search: string = '') => {
        const response = await getCourse(search, 1, 20);
        if (response.ok) {
            setCourses(response.data);
        }
    }

    const [categories, setCategories] = useState<ICategoryResponse[]>([]);

    useEffect(() => {
        const fetchInitialCourse = async () => {
            if (visible && Document) {
                setCourses([]);
                try {
                    const initialCourse = await getCourseById(Document.courseId);
                    if (initialCourse?.data) {
                        setCourses(pre => [...pre, initialCourse.data]);
                        const courseFolderId = initialCourse.data.folderId || '';
                        setCurrentFolderId(courseFolderId);

                        if (courseFolderId) {
                            setSelectedFolderId({
                                id: courseFolderId,
                                name: initialCourse.data.name || 'Thư mục khoá học',
                            });
                        }
                    }
                } catch (error) {
                    // handle error if needed
                }
            } else if (visible) {
                setCurrentFolderId('');
                setSelectedFolderId(null);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await getCategory();
                if (response.ok) {
                    setCategories(response.data);
                }
            } catch (error) {
                // handle error if needed
            }
        };

        const fetchData = async () => {
            setLoadingInfo(true);
            await Promise.all([
                fetchInitialCourse(),
                fetchCategories(),
                handleSearchCourse(''),
            ]);

            form.setFieldsValue({
                name: Document?.name,
                courseId: Document?.courseId,
                folderId: undefined, // Để user phải chọn thư mục
            });

            setLoadingInfo(false);
        };

        if (visible) {
            fetchData();
        }
    }, [form, visible, Document]);

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
                categoryIds: values.categoryIds || [],
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

    const handleReject = async (documentId: string) => {
        NotificationService.loading({
            message: 'Từ chối tài liệu',
            description: 'Đang xử lý yêu cầu từ chối tài liệu, vui lòng đợi trong giây lát...',
            duration: 5,
        });
        const response = await updateDocument(documentId, { statusDocument: 'REJECTED' });
        if (response.ok) {
            NotificationService.success({
                message: 'Từ chối tài liệu',
                description: response.message || 'Tài liệu đã được từ chối thành công',
            });
            form.resetFields();
            onCancel();
        } else {
            NotificationService.error({
                message: 'Có lỗi xảy ra khi từ chối tài liệu',
                description: response.message || 'Vui lòng kiểm tra lại thông tin!',
            });
        }
    }

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
                    onClick={() => handleReject(Document?.id?.toString() || '')}
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
                            <Input placeholder={loadingInfo ? "Đang tải tên tài liệu..." : "Nhập tên tài liệu"} disabled={loadingInfo} size="middle" />
                        </Form.Item>

                        <Form.Item
                            label="Môn học:"
                            name="courseId"
                            rules={[{ required: true, message: "Vui lòng chọn môn học!" }]}
                        >
                            <Select
                                showSearch
                                placeholder={loadingInfo ? "Đang tải môn học..." : "Tìm kiếm và chọn môn học..."}
                                size="middle"
                                optionFilterProp="children"
                                filterOption={false}
                                loading={loadingInfo}
                                allowClear
                                notFoundContent={loadingInfo ? 'Đang tải...' : 'Không tìm thấy môn học'}
                                options={courses.map(course => ({
                                    value: course.id,
                                    label: `${course.code} - ${course.name}`
                                }))}
                                onChange={handleCourseChange}
                                onSearch={handleSearchCourse}
                                disabled={loadingInfo}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Loại danh mục:"
                            name="categoryIds"
                            rules={[{ required: true, message: "Vui lòng chọn loại danh mục!" }]}
                        >
                            <Select
                                mode="multiple"
                                showSearch
                                placeholder={loadingInfo ? "Đang tải danh mục..." : "Chọn loại danh mục"}
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    (`${option?.label ?? ''}`).toLowerCase().includes(input.toLowerCase())
                                }
                                options={
                                    (Array.isArray(categories) ? categories : []).map(category => ({
                                        value: category.id,
                                        label: (
                                            <div className="flex items-center gap-2">
                                                <span className="inline-block w-2 h-2 rounded-full bg-blue-400" />
                                                <span>{category.name}</span>
                                            </div>
                                        )
                                    }))
                                }
                                notFoundContent={loadingInfo ? 'Đang tải...' : 'Không tìm thấy loại danh mục'}
                                className="custom-multi-select"
                                maxTagCount="responsive"
                                maxTagPlaceholder={omittedValues => `+${omittedValues.length} loại`}
                                tagRender={({ label, closable, onClose }) => (
                                    <div className="mt-1 bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center mr-1 mb-1">
                                        {label}
                                        {closable && (
                                            <span
                                                className="ml-1 cursor-pointer text-blue-500 hover:text-blue-700"
                                                onClick={onClose}
                                            >
                                                ×
                                            </span>
                                        )}
                                    </div>
                                )}
                                style={{ width: '100%' }}
                                disabled={loadingInfo}
                            />
                        </Form.Item>

                        <Form.Item name="folderId" label="Chọn thư mục" rules={[{ required: true, message: 'Vui lòng chọn thư mục' }]}>
                            <FolderSelector
                                title={`Chọn thư mục lưu tài liệu | ${selectedFolderId?.name}`}
                                onSelect={(folder, _) => {
                                    setSelectedFolderId(folder);
                                    form.setFieldsValue({ folderId: folder.id });
                                }}
                                folderIdCurrent={currentFolderId}
                            />
                        </Form.Item>
                    </Form>
                </div>

                <div className="w-[350px] border-l border-gray-200 pl-4">
                    <div className="h-full">
                        {Document ? (
                            <div className="h-full">
                                <PreviewPanel
                                    key={`preview-${Document.id}-${previewKey}`}
                                    selectedItem={Document}
                                    onClose={() => { }}
                                    className="ml-0 h-full"
                                    showCloseButton={false}
                                />
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                                <div className="text-center p-4">
                                    <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-base font-semibold text-gray-700 mb-1">
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
            </div>
        </Modal>
    );
}
