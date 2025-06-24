import React, { useState } from "react";
import { Modal, Button, Input, Form, message } from "antd";
import { IUserCreateRequest, IUserResponse, IUserUpdate } from "@/types/user";
import { createUser, updateUser } from "@/actions/user.action";
import NotificationService from "../../Notification/NotificationService";
import { mutateTable } from "@/utils/swrReload";

interface ModalCreateUserProps {
    visible: boolean;
    onCancel: () => void;
}

const ModalUpdateUser: React.FC<ModalCreateUserProps> = ({
    visible,
    onCancel,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleOk = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            const userCreate: IUserCreateRequest = {
                username: values.username,
                password: values.password || undefined, // Optional field
                fullname: values.fullname,
            }; const response = await createUser(userCreate);
            if (response.ok) {
                NotificationService.success({
                    message: `Tài khoản ${userCreate.fullname} đã được thêm thành công`,
                }); form.resetFields();
                // Mutate trực tiếp để có trải nghiệm mượt mà
                mutateTable('user');
            } else {
                NotificationService.error({
                    message: response.message || "Thêm tài khoản thất bại",
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
            title="Thêm tài khoản"
            open={visible}
            onOk={handleOk}
            onCancel={onCancel}
            confirmLoading={loading}
            okText="Thêm mới"
            cancelText="Hủy"
            destroyOnClose
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Tên tài khoản:"
                    name="username"
                    rules={[{ required: true, message: "Vui lòng nhập người dùng!" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Mật khẩu (nếu muốn thay đổi)"
                    name="password"
                    initialValue="12345678"
                    rules={[
                        { required: true, message: "Vui lòng nhập mật khẩu!" },
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    label="Họ và tên:"
                    name="fullname"
                    rules={[
                        { required: true, message: "Vui lòng nhập họ và tên!" },
                    ]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalUpdateUser;