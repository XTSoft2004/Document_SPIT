import React, { useState } from "react";
import { Modal, Button, Input, Form, message } from "antd";
import NotificationService from "@/components/ui/Notification/NotificationService";
import { IDepartmentRequest } from "@/types/department";
import { createDepartment } from "@/actions/department.action";

interface ModalCreateDepartmentProps {
    visible: boolean;
    onCancel: () => void;
}

const ModalCreateDepartment: React.FC<ModalCreateDepartmentProps> = ({
    visible,
    onCancel,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        if (visible) {
            form.resetFields();
        }
    }, [visible, form]);

    const handleOk = async () => {
        await handleSubmit();
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            const departmentRequest: IDepartmentRequest = {
                code: values.code,
                name: values.name,
            };

            const response = await createDepartment(departmentRequest);
            if (response.ok) {
                NotificationService.success({
                    message: "Tạo phòng ban thành công"
                });
                form.resetFields();
                onCancel();
            } else {
                NotificationService.error({
                    message: "Tạo phòng ban thất bại"
                });
            }
        } catch (error) {
            // Validation failed
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Tạo phòng ban mới"
            open={visible}
            onOk={handleOk}
            onCancel={onCancel}
            confirmLoading={loading}
            okText="Tạo mới"
            cancelText="Hủy"
            destroyOnClose
        >
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
                <Form.Item
                    label="Mã phòng ban:"
                    name="code"
                    rules={[{ required: true, message: "Vui lòng nhập mã phòng ban!" }]}
                >
                    <Input placeholder="Nhập mã phòng ban" />
                </Form.Item>

                <Form.Item
                    label="Tên phòng ban:"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên phòng ban!" }]}
                >
                    <Input placeholder="Nhập tên phòng ban" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalCreateDepartment;
