import React, { useState } from "react";
import { Modal, Button, Input, Form, message } from "antd";
import { IUserResponse, IUserUpdate } from "@/types/user";
import { updateUser } from "@/actions/user.action";
import { mutateTable, reloadTable } from "@/utils/swrReload";
import NotificationService from "@/components/ui/Notification/NotificationService";
import { IDepartmentRequest, IDepartmentResponse } from "@/types/department";
import { updateDepartment } from "@/actions/department.action";

interface ModalUpdateDepartmentProps {
    visible: boolean;
    department?: IDepartmentResponse;
    onCancel: () => void;
}

const ModalUpdateDepartment: React.FC<ModalUpdateDepartmentProps> = ({
    visible,
    department,
    onCancel,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        if (department) {
            form.setFieldsValue(department);
        } else {
            form.resetFields();
        }
    }, [department, form]); const handleOk = async () => {
        await handleSubmit();
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            const departmentUpdate: IDepartmentRequest = {
                code: values.code,
                name: values.name,
            };
            const response = await updateDepartment(form.getFieldValue("id"), departmentUpdate);
            if (response.ok) {
                NotificationService.success({
                    message: "Cập nhật phòng ban thành công"
                });
                onCancel();
            } else {
                NotificationService.error({
                    message: "Cập nhật phòng ban thất bại"
                });
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
            title="Cập nhật thông tin phòng ban"
            open={visible}
            onOk={handleOk}
            onCancel={onCancel}
            confirmLoading={loading}
            okText="Cập nhật"
            cancelText="Hủy"
            destroyOnClose        >
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
                    <Input value={form.getFieldValue("code")} />
                </Form.Item>

                <Form.Item
                    label="Tên phòng ban:"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên phòng ban!" }]}
                >
                    <Input value={form.getFieldValue("name")} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalUpdateDepartment;