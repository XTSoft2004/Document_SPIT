import React, { useState } from "react";
import { Modal, Button, Input, Form, message, Select } from "antd";
import NotificationService from "@/components/ui/Notification/NotificationService";
import { ICourseRequest } from "@/types/course";
import { createCourse } from "@/actions/course.action";
import { IDepartmentResponse } from "@/types/department";
import { getDepartment } from "@/actions/department.action";

interface ModalCreateCourseProps {
    visible: boolean;
    departments: IDepartmentResponse[];
    onCancel: () => void;
}

const ModalCreateCourse: React.FC<ModalCreateCourseProps> = ({
    visible,
    departments,
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

            const courseRequest: ICourseRequest = {
                code: values.code,
                name: values.name,
                departmentId: values.departmentId,
            };

            const response = await createCourse(courseRequest);
            if (response.ok) {
                NotificationService.success({
                    message: "Tạo khóa học thành công"
                });
                form.resetFields();
                onCancel();
            } else {
                NotificationService.error({
                    message: "Tạo khóa học thất bại"
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
            title="Tạo khóa học mới"
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
                    label="Mã khóa học:"
                    name="code"
                    rules={[{ required: true, message: "Vui lòng nhập mã khóa học!" }]}
                >
                    <Input placeholder="Nhập mã khóa học" />
                </Form.Item>

                <Form.Item
                    label="Tên khóa học:"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên khóa học!" }]}
                >
                    <Input placeholder="Nhập tên khóa học" />
                </Form.Item>

                <Form.Item
                    label="Khoa:"
                    name="departmentId"
                    rules={[{ required: true, message: "Vui lòng chọn khoa!" }]}
                >
                    <Select
                        showSearch
                        placeholder="Chọn khoa"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={departments.map(dept => ({
                            value: dept.id,
                            label: dept.name
                        }))}
                        onChange={(value) => {
                            form.setFieldsValue({ departmentId: value });
                        }}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalCreateCourse;
