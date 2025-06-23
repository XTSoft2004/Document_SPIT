import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Form, Upload, Row, Col, message } from "antd";
import { FolderFilled, UploadOutlined } from "@ant-design/icons";
import NotificationService from "@/components/ui/Notification/NotificationService";
import ModalSelectFolder from "../../Dashboard/Modal/ModalSelectFolder";
import { IFileInfo } from "@/types/driver";
import { IDocumentRequest } from "@/types/document";
import { createDocument } from "@/actions/document.actions";
import { mutate } from 'swr'; // Thêm dòng này vào đầu file

interface ModalCreateDocumentProps {
    visible: boolean;
    onCancel: () => void;
}

const ModalCreateDocument: React.FC<ModalCreateDocumentProps> = ({
    visible,
    onCancel,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [previewSrc, setPreviewSrc] = useState<string | null>(null);
    const [previewType, setPreviewType] = useState<"pdf" | "image" | "unsupported" | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    const [isModalOpenFolder, setIsModalOpenFolder] = useState(false);
    const [selectedFolderId, setSelectedFolderId] = useState<IFileInfo | null>(null);
    const [breadcrumb, setBreadcrumb] = useState<string>('');

    useEffect(() => {
        const updateMedia = () => setIsMobile(window.innerWidth <= 768);
        updateMedia();
        window.addEventListener("resize", updateMedia);
        return () => window.removeEventListener("resize", updateMedia);
    }, []);

    const handlePreviewUpdate = async (file: any) => {
        try {
            if (!file || !file.originFileObj) {
                setPreviewSrc(null);
                return;
            }

            const fileType = file.type;
            console.log("File type:", fileType);

            if (fileType.startsWith("image/")) {
                const src = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file.originFileObj as File);
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = () => reject();
                });
                setPreviewSrc(src);
                setPreviewType("image");
            } else if (fileType === "application/pdf") {
                const src = URL.createObjectURL(file.originFileObj as File);
                setPreviewSrc(src);
                setPreviewType("pdf");
            } else {
                setPreviewSrc(null);
                setPreviewType("unsupported");
                message.warning("Không thể xem trước file này.");
            }
        } catch (error) {
            setPreviewSrc(null);
            setPreviewType("unsupported");
            message.error("Lỗi khi tải xem trước file.");
        }
    };

    const handleOk = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            console.log("Form values:", values);
            const documentCreate: IDocumentRequest = {
                name: values.fileName,
                fileName: values.fileUpload[0]?.name || "",
                base64String: values.fileUpload[0]?.originFileObj ? await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(values.fileUpload[0].originFileObj);
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = () => reject();
                }) : "",
                folderId: selectedFolderId ? selectedFolderId.id : "",
            };
            console.log("Document create request:", documentCreate);
            const response = await createDocument(documentCreate);
            if (response.ok) {
                NotificationService.success({ message: "Tạo tài liệu thành công, chờ xét duyệt" });
                form.resetFields();
                setPreviewSrc(null);
                onCancel();
            } else {
                NotificationService.error({ message: response.message || "Tạo tài liệu thất bại" });
            }

            onCancel();
        } catch (error) {
            // Validation failed
        } finally {
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
            style={{ top: 20 }}
        // centered
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={async () => {
                    setLoading(true);
                    try {
                        NotificationService.success({ message: "Tạo tài liệu thành công" });
                        form.resetFields();
                        setPreviewSrc(null);
                        onCancel();
                    } catch {
                        NotificationService.error({ message: "Tạo tài liệu thất bại" });
                    } finally {
                        setLoading(false);
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
                                        handlePreviewUpdate(file);
                                    } else {
                                        setPreviewSrc(null);
                                    }
                                }}
                            >
                                <Button icon={<UploadOutlined />}>Chọn file</Button>
                            </Upload>
                        </Form.Item>

                        <Form.Item
                            name="folderId"
                            label="Chọn thư mục"
                            rules={[{ required: true, message: 'Vui lòng chọn thư mục' }]}>

                            {/* Chọn thư mục để upload */}
                            <Button
                                type="primary"
                                onClick={() => setIsModalOpenFolder(true)}
                                block
                            >
                                Chọn thư mục
                            </Button>
                            <ModalSelectFolder
                                open={isModalOpenFolder}
                                onClose={() => {
                                    setIsModalOpenFolder(false)
                                }}
                                onSelectFolder={(folder: IFileInfo, breadcrumb: string) => {
                                    setIsModalOpenFolder(false);
                                    setSelectedFolderId(folder);
                                    setBreadcrumb(breadcrumb);
                                    // Cập nhật giá trị cho trường folderId trong form
                                    form.setFieldsValue({ folderId: folder.id });
                                }}
                            />
                            <div className='flex items-center mt-2 '>
                                <FolderFilled className="text-xl" style={{ color: '#faad14' }} />
                                {selectedFolderId ? (
                                    <span className="ml-2 text-black truncate max-w-xs" title={breadcrumb}>{breadcrumb}</span>
                                ) : (
                                    <span className="ml-2 text-black">Chưa chọn thư mục</span>
                                )}
                            </div>
                        </Form.Item>
                    </Col>

                    {previewSrc && previewType !== "unsupported" && (
                        <Col xs={24} sm={24} md={12}>
                            <div style={{ border: "1px solid #eee", padding: 10 }}>
                                <h4 style={{ marginBottom: 8 }}>Xem trước</h4>

                                {previewType === "image" && (
                                    <img
                                        src={previewSrc}
                                        alt="Preview"
                                        style={{
                                            width: "100%",
                                            maxHeight: "60vh",
                                            objectFit: "contain",
                                            borderRadius: 4,
                                        }}
                                    />
                                )}

                                {previewType === "pdf" && !isMobile && (
                                    <iframe
                                        src={previewSrc}
                                        title="Preview"
                                        style={{ width: "100%", height: "60vh", border: "none" }}
                                    />
                                )}

                                {previewType === "pdf" && isMobile && (
                                    <div style={{ color: "#999" }}>
                                        Không hỗ trợ xem trước PDF trên thiết bị di động.
                                    </div>
                                )}
                            </div>
                        </Col>
                    )}
                </Row>
            </Form>
        </Modal >
    );
};

export default ModalCreateDocument;
