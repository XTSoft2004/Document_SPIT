import React, { useEffect, useState } from "react";
import { Modal, Button, Input, Form, Upload, Row, Col, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import NotificationService from "@/components/ui/Notification/NotificationService";
import { createDocument } from "@/actions/document.actions";
import { IFileInfo } from "@/types/driver";
import { IDocumentRequest } from "@/types/document";
import FilePreview from "@/components/common/FilePreview";
import { handleFilePreview } from "@/utils/filePreview";
import FolderSelector from "@/components/common/FolderSelector";
import { mutateTable } from "@/utils/swrReload";

interface ModalCreateDocumentProps {
    visible: boolean;
    onCancel: () => void;
}

const ModalCreateDocument: React.FC<ModalCreateDocumentProps> = ({ visible, onCancel }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [previewSrc, setPreviewSrc] = useState<string | null>(null);
    const [previewType, setPreviewType] = useState<"pdf" | "image" | "unsupported" | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [selectedFolderId, setSelectedFolderId] = useState<IFileInfo | null>(null);

    useEffect(() => {
        const updateMedia = () => setIsMobile(window.innerWidth <= 768);
        updateMedia();
        window.addEventListener("resize", updateMedia);
        return () => window.removeEventListener("resize", updateMedia);
    }, []); const handleOk = async () => {
        await handleSubmit();
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            const base64String = values.fileUpload[0]?.originFileObj ? await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(values.fileUpload[0].originFileObj);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = () => reject();
            }) : "";

            const documentCreate: IDocumentRequest = {
                name: values.fileName,
                fileName: values.fileUpload[0]?.name || "",
                base64String,
                folderId: selectedFolderId ? selectedFolderId.id : "",
            }; const response = await createDocument(documentCreate);
            if (response.ok) {
                NotificationService.success({ message: "Tạo tài liệu thành công, chờ xét duyệt" });
                form.resetFields();
                setPreviewSrc(null); onCancel();
                // Mutate trực tiếp để có trải nghiệm mượt mà
                mutateTable('document');
            } else {
                NotificationService.error({ message: response.message || "Tạo tài liệu thất bại" });
            }
        } catch { } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Thêm tài liệu mới"
            open={visible}
            onOk={handleOk}
            onCancel={() => {
                onCancel();
                setPreviewSrc(null);
                form.resetFields();
            }}
            confirmLoading={loading}
            okText="Thêm mới"
            cancelText="Hủy"
            destroyOnClose
            width={isMobile ? "100%" : previewSrc ? 1000 : 600}
            style={{ top: 20 }}        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                    }
                }}
            >
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={previewSrc ? 12 : 24}>
                        <Form.Item
                            label="Tên tài liệu"
                            name="fileName"
                            rules={[{ required: true, message: "Vui lòng nhập tên tài liệu!" }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="File tài liệu"
                            name="fileUpload"
                            valuePropName="fileList"
                            getValueFromEvent={e => Array.isArray(e) ? e : e && e.fileList}
                            rules={[{ required: true, message: "Vui lòng chọn file!" }]}
                        >
                            <Upload
                                name="file"
                                listType="picture"
                                showUploadList={true}
                                maxCount={1}
                                beforeUpload={() => false}
                                onChange={({ fileList }) => {
                                    const file = fileList[0];
                                    form.setFieldsValue({ fileUpload: fileList });
                                    if (file && file.originFileObj) {
                                        handleFilePreview(file, setPreviewSrc, setPreviewType, () => {
                                            message.warning("Không thể xem trước file này.");
                                        });
                                    } else {
                                        setPreviewSrc(null);
                                    }
                                }}
                            >
                                <Button icon={<UploadOutlined />}>Chọn file</Button>
                            </Upload>
                        </Form.Item>

                        <Form.Item name="folderId" label="Chọn thư mục" rules={[{ required: true, message: 'Vui lòng chọn thư mục' }]}>
                            <FolderSelector onSelect={(folder, _) => {
                                setSelectedFolderId(folder);
                                form.setFieldsValue({ folderId: folder.id });
                            }} />
                        </Form.Item>
                    </Col>

                    {previewSrc && previewType !== "unsupported" && (
                        <Col xs={24} sm={24} md={12}>
                            <FilePreview src={previewSrc} type={previewType} isMobile={isMobile} />
                        </Col>
                    )}
                </Row>
            </Form>
        </Modal>
    );
};

export default ModalCreateDocument;