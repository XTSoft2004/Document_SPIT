import React, { useEffect, useState } from "react";
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

interface ModalUpdateDocumentProps {
    visible: boolean;
    Document?: IDocumentResponse;
    courses: ICourseResponse[];
    onCancel: () => void;
}

const ModalUpdateDocument: React.FC<ModalUpdateDocumentProps> = ({ visible, Document, courses, onCancel }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [selectedFolderId, setSelectedFolderId] = useState<IFileInfo | null>(null);
    const [previewKey, setPreviewKey] = useState(0); // Key để force re-render preview
    const [currentFolderId, setCurrentFolderId] = useState<string>(''); // Folder ID hiện tại cho FolderSelector
    const [showFolderSelector, setShowFolderSelector] = useState(false); // Điều khiển hiển thị FolderSelector
    const [originalCourseId, setOriginalCourseId] = useState<string>(''); // Lưu courseId ban đầu để so sánh


    const [previewSrc, setPreviewSrc] = useState<string | null>(null);
    const [previewType, setPreviewType] = useState<"pdf" | "image" | "unsupported" | null>(null);

    // Helper function để lấy folderId từ course hiện tại
    const getCurrentCourseFolderId = () => {
        const courseId = form.getFieldValue('courseId') || Document?.courseId;
        const selectedCourse = courses.find(course => Number(course.id) === Number(courseId));
        return selectedCourse?.folderId || '';
    };

    // Helper function để cập nhật folder dựa trên course
    const updateFolderFromCourse = (courseId: string) => {
        const selectedCourse = courses.find(course => Number(course.id) === Number(courseId));
        if (selectedCourse?.folderId) {
            setCurrentFolderId(selectedCourse.folderId);
            setSelectedFolderId({
                id: selectedCourse.folderId,
                name: selectedCourse.name
            });
            form.setFieldsValue({ folderId: selectedCourse.folderId });
            return selectedCourse;
        }

        // Reset nếu course không có folderId
        setCurrentFolderId('');
        setSelectedFolderId(null);
        form.setFieldsValue({ folderId: undefined });
        return selectedCourse;
    };

    // Helper function để reset tất cả state
    const resetAllStates = () => {
        form.resetFields();
        setSelectedFolderId(null);
        setCurrentFolderId('');
        setShowFolderSelector(false);
        setOriginalCourseId('');
        setPreviewKey(prev => prev + 1);
        setPreviewSrc(null);
        setPreviewType(null);
    };

    useEffect(() => {
        if (visible && Document) {
            form.setFieldsValue({
                name: Document.name,
                courseId: Document.courseId,
                folderId: Document.folderId,
            });

            // Lưu courseId ban đầu
            setOriginalCourseId(String(Document.courseId));

            // Cập nhật folder từ course ban đầu
            updateFolderFromCourse(String(Document.courseId));

            // Không hiển thị FolderSelector ban đầu vì dùng course gốc
            setShowFolderSelector(false);
        } else if (visible) {
            // Reset khi mở modal mà không có Document
            resetAllStates();
        }
    }, [visible, Document, form, courses]);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            // Lấy folderId từ selectedFolderId hoặc fallback to current course folder
            // const folderId = selectedFolderId?.id || getCurrentCourseFolderId();

            let folderId = "";
            let base64String = "";
            let fileName = "";
            if (showFolderSelector) {
                folderId = values.folderId || getCurrentCourseFolderId();
                base64String = values.fileUpload && values.fileUpload[0]?.originFileObj
                    ? await new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(values.fileUpload[0].originFileObj);
                        reader.onload = () => resolve(reader.result as string);
                        reader.onerror = () => reject();
                    })
                    : "";
                fileName = values.fileUpload && values.fileUpload[0]?.name ? values.fileUpload[0].name : ''; // Lấy tên file từ fileUpload
            } else {
                folderId = getCurrentCourseFolderId();
                base64String = "";
            }

            const DocumentUpdate: IDocumentUpdateRequest = {
                name: values.name,
                folderId: folderId || "",
                base64String: base64String,
                fileName: fileName,
                courseId: values.courseId || 0,
            };

            const response = await updateDocument(String(Document?.id || ''), DocumentUpdate);
            if (response.ok) {
                NotificationService.success({ message: "Cập nhật tài liệu thành công" });
                onCancel();
                mutateTable('document');
            } else {
                NotificationService.error({ message: "Cập nhật tài liệu thất bại" });
            }
        } catch {
            NotificationService.error({ message: "Có lỗi xảy ra khi cập nhật tài liệu" });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        resetAllStates();
        onCancel();
    };

    const handleCourseChange = (courseId: string) => {
        // Cập nhật courseId trong form
        form.setFieldsValue({ courseId });

        // Kiểm tra nếu courseId khác với courseId ban đầu
        const isDifferentFromOriginal = courseId !== originalCourseId;

        // Cập nhật folder từ course được chọn
        const selectedCourse = updateFolderFromCourse(courseId);

        // Chỉ hiển thị FolderSelector khi chọn môn học khác với ban đầu và course có folderId
        setShowFolderSelector(isDifferentFromOriginal && !!selectedCourse?.folderId);

        // Thông báo phù hợp
        const message = isDifferentFromOriginal
            ? `Đã chọn môn học khác: ${selectedCourse?.name || 'Không tìm thấy môn học'}. Vui lòng chọn thư mục mới.`
            : `Trở về môn học ban đầu: ${selectedCourse?.name || 'Không tìm thấy môn học'}`;

        const notificationType = isDifferentFromOriginal ? 'info' : 'success';
        NotificationService[notificationType]({ message });
    };

    const handleReload = () => {
        setPreviewKey(prev => prev + 1); // Force refresh preview
    };

    return (
        <Modal
            title="Cập nhật thông tin tài liệu"
            open={visible}
            onCancel={handleCancel}
            width={900}
            centered
            destroyOnClose={true}
            maskClosable={false}
            style={{
                top: 10,
                maxHeight: '90vh'
            }}
            footer={[
                <Button key="cancel" onClick={handleCancel} size="middle">
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
                        size="small"
                        className="space-y-2"
                        onFinish={handleSubmit}
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
                                placeholder="Chọn môn học"
                                size="middle"
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
                                        title={`Chọn thư mục của môn học | ${courses.find(course => course.id === form.getFieldValue('courseId'))?.code || ''} - ${courses.find(course => course.id === form.getFieldValue('courseId'))?.name || ''}`}
                                        onSelect={(folder, _) => {
                                            setSelectedFolderId(folder);
                                            form.setFieldsValue({ folderId: folder.id, fileUpload: [] }); // Reset file khi đổi thư mục
                                            setPreviewSrc(null);
                                            setPreviewType(null);
                                            NotificationService.info({
                                                message: `Đã chọn thư mục: ${folder.id}`
                                            });
                                        }}
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
                                        onChange={({ fileList }) => {
                                            form.setFieldsValue({ fileUpload: fileList });
                                            if (fileList.length > 0) {
                                                // Nếu có file mới, set lại folderId (nếu cần)
                                                if (selectedFolderId) {
                                                    form.setFieldsValue({ folderId: selectedFolderId.id });
                                                }
                                                const file = fileList[0];
                                                if (file && file.originFileObj) {
                                                    handleFilePreview(file, setPreviewSrc, setPreviewType, () => {
                                                        message.warning("Không thể xem trước file này.");
                                                    });
                                                } else {
                                                    setPreviewSrc(null);
                                                }
                                            } else {
                                                setPreviewSrc(null);
                                            }
                                        }}
                                    >
                                        <Button icon={<UploadOutlined />} size="middle">Chọn file</Button>
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
                        {/* 
                        <Form.Item name="folderId" label="Chọn thư mục" rules={[{ required: true, message: 'Vui lòng chọn thư mục' }]}>
                            <FolderSelector onSelect={(folder, _) => {
                                setSelectedFolderId(folder);
                                form.setFieldsValue({ folderId: folder.id });
                            }} />
                        </Form.Item> */}

                        <div className="bg-blue-50 p-3 rounded-lg"> {/* Giảm padding */}
                            <p className="font-bold text-sm text-blue-700 mb-1"> {/* Giảm text size */}
                                Hướng dẫn:
                            </p>
                            <ul className="text-sm text-blue-600 space-y-0.5"> {/* Giảm text size và spacing */}
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