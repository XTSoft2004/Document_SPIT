import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Modal, Button, Input, Form, Select, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import NotificationService from "@/components/ui/Notification/NotificationService";
import { IFileInfo } from "@/types/driver";
import { IDocumentResponse, IDocumentUpdateRequest } from "@/types/document";
import { updateDocument } from "@/actions/document.actions";
import FolderSelector from "@/components/common/FolderSelector";
import { mutateTable } from "@/utils/swrReload";
import PreviewPanel from "@/components/ui/Admin/Document/PreviewPanel";
import { ICourseResponse } from "@/types/course";
import { handleFilePreview } from "@/utils/filePreview";
import FilePreview from "@/components/common/FilePreview";
import { getCourse, getCourseById } from "@/actions/course.action";

interface ModalUpdateDocumentProps {
    visible: boolean;
    Document?: IDocumentResponse;
    onCancel: () => void;
}

const ModalUpdateDocument: React.FC<ModalUpdateDocumentProps> = ({ visible, Document, onCancel }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [selectedFolderId, setSelectedFolderId] = useState<IFileInfo | null>(null);
    const [previewKey, setPreviewKey] = useState(0);
    const [currentFolderId, setCurrentFolderId] = useState<string>('');
    const [showFolderSelector, setShowFolderSelector] = useState(false);
    const [originalCourseId, setOriginalCourseId] = useState<number | null>(null);
    const [previewSrc, setPreviewSrc] = useState<string | null>(null);
    const [previewType, setPreviewType] = useState<"pdf" | "image" | "unsupported" | null>(null);
    const [courses, setCourses] = useState<ICourseResponse[]>([]);

    // Debounced search function
    const handleSearchCourse = useCallback(async (search: string) => {
        if (!search?.trim()) return;

        try {
            setLoadingCourses(true);
            const response = await getCourse(search, 1, 20);
            if (response.ok) {
                setCourses(response.data);
            } else {
                console.error('Failed to fetch courses:', response.message);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoadingCourses(false);
        }
    }, []);

    // Get current course folder ID
    const getCurrentCourseFolderId = useCallback(async () => {
        const courseId = form.getFieldValue('courseId') || Document?.courseId;
        if (!courseId) return '';

        try {
            const selectedCourse = await getCourseById(courseId);
            return selectedCourse?.data?.folderId || '';
        } catch (error) {
            console.error('Error getting course folder:', error);
            return '';
        }
    }, [form, Document]);

    // Update folder from course
    const updateFolderFromCourse = useCallback(async (courseId: number) => {
        try {
            const selectedCourse = await getCourseById(courseId);
            if (selectedCourse?.data?.folderId) {
                setCurrentFolderId(selectedCourse.data.folderId);
                setSelectedFolderId({
                    id: selectedCourse.data.folderId,
                    name: selectedCourse.data.name
                });
                form.setFieldsValue({ folderId: selectedCourse.data.folderId });
            } else {
                setCurrentFolderId('');
                setSelectedFolderId(null);
                form.setFieldsValue({ folderId: undefined });
            }
            return selectedCourse;
        } catch (error) {
            console.error('Error updating folder from course:', error);
            return null;
        }
    }, [form]);

    // Reset all states
    const resetAllStates = useCallback(() => {
        form.resetFields();
        setSelectedFolderId(null);
        setCurrentFolderId('');
        setShowFolderSelector(false);
        setOriginalCourseId(null);
        setPreviewKey(prev => prev + 1);
        setPreviewSrc(null);
        setPreviewType(null);
        setCourses([]);
    }, [form]);

    // Memoized course options
    const courseOptions = useMemo(() => {
        return courses.map(course => ({
            value: course.id,
            label: `${course.code} - ${course.name}`
        }));
    }, [courses]);

    // Get current course for folder selector title
    const currentCourse = useMemo(() => {
        const courseId = form.getFieldValue('courseId');
        return courses.find(course => course.id === courseId);
    }, [courses, form]);

    // Initialize modal data
    useEffect(() => {
        const initializeModal = async () => {
            if (!visible) {
                resetAllStates();
                return;
            }

            if (Document) {
                try {
                    // Set form values
                    form.setFieldsValue({
                        name: Document.name,
                        courseId: Document.courseId,
                        folderId: Document.folderId,
                    });

                    // Set original course ID
                    setOriginalCourseId(Document.courseId);

                    // Load initial course and set it in courses list
                    const initialCourse = await getCourseById(Document.courseId);
                    if (initialCourse?.data) {
                        setCourses([initialCourse.data]);

                        // Update folder from course
                        await updateFolderFromCourse(Document.courseId);
                    }

                    // Don't show folder selector initially
                    setShowFolderSelector(false);
                } catch (error) {
                    console.error('Error initializing modal:', error);
                    message.error('Không thể tải thông tin môn học');
                }
            }
        };

        initializeModal();
    }, [visible, Document, form, updateFolderFromCourse, resetAllStates]);

    const handleSubmit = useCallback(async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            let folderId = "";
            let base64String = "";
            let fileName = "";

            if (showFolderSelector) {
                folderId = values.folderId || await getCurrentCourseFolderId();

                // Handle file upload
                if (values.fileUpload && values.fileUpload[0]?.originFileObj) {
                    try {
                        base64String = await new Promise<string>((resolve, reject) => {
                            const reader = new FileReader();
                            reader.readAsDataURL(values.fileUpload[0].originFileObj);
                            reader.onload = () => resolve(reader.result as string);
                            reader.onerror = () => reject(new Error('Cannot read file'));
                        });
                        fileName = values.fileUpload[0].name || '';
                    } catch (error) {
                        message.error('Không thể đọc file');
                        return;
                    }
                }
            } else {
                folderId = await getCurrentCourseFolderId();
            }

            const DocumentUpdate: IDocumentUpdateRequest = {
                name: values.name,
                folderId: folderId || "",
                base64String,
                fileName,
                courseId: values.courseId || 0,
            };

            const response = await updateDocument(String(Document?.id || ''), DocumentUpdate);

            if (response.ok) {
                NotificationService.success({ message: "Cập nhật tài liệu thành công" });
                handleCancel();
                mutateTable('document');
            } else {
                NotificationService.error({
                    message: response.message || "Cập nhật tài liệu thất bại"
                });
            }
        } catch (error) {
            console.error('Error updating document:', error);
            NotificationService.error({ message: "Có lỗi xảy ra khi cập nhật tài liệu" });
        } finally {
            setLoading(false);
        }
    }, [Document, showFolderSelector, getCurrentCourseFolderId, form]);

    const handleCancel = useCallback(() => {
        resetAllStates();
        onCancel();
    }, [resetAllStates, onCancel]);

    const handleCourseChange = useCallback((courseId: number) => {
        form.setFieldsValue({ courseId });

        const isDifferentFromOriginal = courseId !== originalCourseId;

        updateFolderFromCourse(courseId).then((selectedCourse) => {
            setShowFolderSelector(isDifferentFromOriginal && !!selectedCourse?.data?.folderId);

            const message = isDifferentFromOriginal
                ? `Đã chọn môn học khác: ${selectedCourse?.data?.name || 'Không tìm thấy môn học'}. Vui lòng chọn thư mục mới.`
                : `Trở về môn học ban đầu: ${selectedCourse?.data?.name || 'Không tìm thấy môn học'}`;

            const notificationType = isDifferentFromOriginal ? 'info' : 'success';
            NotificationService[notificationType]({ message });
        });
    }, [originalCourseId, updateFolderFromCourse, form]);

    const handleFolderSelect = useCallback((folder: IFileInfo) => {
        setSelectedFolderId(folder);
        form.setFieldsValue({ folderId: folder.id, fileUpload: [] });
        setPreviewSrc(null);
        setPreviewType(null);
        NotificationService.info({
            message: `Đã chọn thư mục: ${folder.id}`
        });
    }, [form]);

    const handleFileChange = useCallback(({ fileList }: any) => {
        form.setFieldsValue({ fileUpload: fileList });

        if (fileList.length > 0) {
            if (selectedFolderId) {
                form.setFieldsValue({ folderId: selectedFolderId.id });
            }

            const file = fileList[0];
            if (file?.originFileObj) {
                handleFilePreview(file, setPreviewSrc, setPreviewType, () => {
                    message.warning("Không thể xem trước file này.");
                });
            } else {
                setPreviewSrc(null);
                setPreviewType(null);
            }
        } else {
            setPreviewSrc(null);
            setPreviewType(null);
        }
    }, [selectedFolderId, form]);

    return (
        <Modal
            title="Cập nhật thông tin tài liệu"
            open={visible}
            onCancel={handleCancel}
            width={900}
            centered
            destroyOnClose={true}
            maskClosable={false}
            style={{ top: 10, maxHeight: '90vh' }}
            footer={[
                <Button
                    key="cancel"
                    onClick={handleCancel}
                    size="middle"
                    disabled={loading}
                >
                    Hủy
                </Button>,
                <Button
                    key="update"
                    type="primary"
                    onClick={handleSubmit}
                    loading={loading}
                    size="middle"
                >
                    Cập nhật
                </Button>,
            ]}
        >
            <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[480px]">
                {/* Form bên trái */}
                <div className="flex-1 overflow-y-auto max-h-[400px] lg:max-h-none">
                    <Form
                        form={form}
                        layout="vertical"
                        size="middle"
                        className="space-y-2"
                        onFinish={handleSubmit}
                        preserve={false}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                    >
                        <Form.Item
                            label="Tên tài liệu"
                            name="name"
                            className="mb-3"
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
                            label="Môn học"
                            name="courseId"
                            className="mb-3"
                            rules={[{ required: true, message: "Vui lòng chọn môn học!" }]}
                        >
                            <Select
                                showSearch
                                placeholder="Tìm kiếm và chọn môn học..."
                                size="middle"
                                filterOption={false}
                                loading={loadingCourses}
                                allowClear
                                notFoundContent={loadingCourses ? 'Đang tìm kiếm...' : 'Không tìm thấy môn học'}
                                options={courseOptions}
                                onChange={handleCourseChange}
                                onSearch={handleSearchCourse}
                            />
                        </Form.Item>

                        {showFolderSelector && (
                            <>
                                <Form.Item
                                    name="folderId"
                                    label="Chọn thư mục:"
                                    rules={[
                                        { required: showFolderSelector, message: 'Vui lòng chọn thư mục' }
                                    ]}
                                >
                                    <FolderSelector
                                        title={`Chọn thư mục của môn học | ${currentCourse?.code || ''} - ${currentCourse?.name || ''}`}
                                        onSelect={handleFolderSelect}
                                        folderIdCurrent={currentFolderId}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="File tài liệu:"
                                    name="fileUpload"
                                    valuePropName="fileList"
                                    getValueFromEvent={e => Array.isArray(e) ? e : e && e.fileList}
                                // rules={[
                                //     { required: showFolderSelector, message: "Vui lòng chọn file!" }
                                // ]}
                                >
                                    <Upload
                                        name="file"
                                        listType="picture"
                                        showUploadList={true}
                                        maxCount={1}
                                        beforeUpload={() => false}
                                        onChange={handleFileChange}
                                    >
                                        <Button icon={<UploadOutlined />} size="middle">
                                            Chọn file
                                        </Button>
                                    </Upload>
                                </Form.Item>
                            </>
                        )}

                        {!showFolderSelector && (
                            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
                                <p className="text-sm text-blue-700 flex items-center gap-2">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    Sử dụng thư mục mặc định. Chọn môn học khác để thay đổi.
                                </p>
                            </div>
                        )}

                        <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="font-bold text-sm text-blue-700 mb-1">
                                Hướng dẫn:
                            </p>
                            <ul className="text-sm text-blue-600 space-y-0.5">
                                <li>• Chỉnh sửa tên tài liệu</li>
                                <li>• Chọn môn học và thư mục</li>
                                <li>• Nhấn <span className="font-bold">"Cập nhật"</span></li>
                            </ul>
                        </div>
                    </Form>
                </div>

                {/* Preview bên phải */}
                <div className="w-full lg:w-[320px] border-t lg:border-t-0 lg:border-l border-gray-200 pt-3 lg:pt-0 lg:pl-4 mt-3 lg:mt-0">
                    {previewSrc ? (
                        <div className="h-[300px] lg:h-[470px]">
                            <FilePreview src={previewSrc} type={previewType} isMobile={false} />
                        </div>
                    ) : Document ? (
                        <div className="h-[300px] lg:h-[470px]">
                            <PreviewPanel
                                key={`preview-${Document.id}-${previewKey}`}
                                selectedItem={Document}
                                onClose={() => { }}
                                className="ml-0 h-full"
                                showCloseButton={false}
                            />
                        </div>
                    ) : (
                        <div className="h-[300px] lg:h-[470px] flex items-center justify-center bg-gray-50 rounded-md">
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
};

export default ModalUpdateDocument;