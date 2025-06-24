import React, { useState } from "react";
import { Modal, Button, Input, Form, message } from "antd";
import { IUserResponse, IUserUpdate } from "@/types/user";
import { updateUser } from "@/actions/user.action";
import NotificationService from "../../Notification/NotificationService";
import { mutateTable } from "@/utils/swrReload";

interface ModalUpdateUserProps {
    visible: boolean;
    user?: IUserResponse;
    onCancel: () => void;
}

const ModalUpdateUser: React.FC<ModalUpdateUserProps> = ({
    visible,
    user,
    onCancel,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        if (user) {
            form.setFieldsValue(user);
        } else {
            form.resetFields();
        }
    }, [user, form]); const handleOk = async () => {
        await handleSubmit();
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            const userUpdate: IUserUpdate = {
                fullname: values.fullname,
                password: values.password || undefined, // Optional field
            }; const response = await updateUser(form.getFieldValue("id"), userUpdate);
            if (response.ok) {
                NotificationService.success({
                    message: "Cập nhật người dùng thành công"
                }); onCancel();
                // Mutate trực tiếp để có trải nghiệm mượt mà
                mutateTable('user');
            } else {
                NotificationService.error({
                    message: "Cập nhật người dùng thất bại"
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
            title="Cập nhật thông tin người dùng"
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
                    label="Tên tài khoản:"
                    name="username"
                    rules={[{ required: true, message: "Vui lòng nhập người dùng!" }]}
                >
                    <Input disabled value={form.getFieldValue("username")} />
                </Form.Item>
                <Form.Item
                    label="Họ và tên:"
                    name="fullname"
                    rules={[
                        { required: true, message: "Vui lòng nhập họ và tên!" },
                    ]}
                >
                    <Input value={form.getFieldValue("fullname")} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalUpdateUser;