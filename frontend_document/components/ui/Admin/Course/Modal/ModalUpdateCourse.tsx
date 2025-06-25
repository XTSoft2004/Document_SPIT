import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Form, message, Select } from "antd";
import NotificationService from "@/components/ui/Notification/NotificationService";
import { ICourseRequest, ICourseResponse } from "@/types/course";
import { updateCourse } from "@/actions/course.action";
import { IDepartmentResponse } from "@/types/department";

interface ModalUpdateCourseProps {
    visible: boolean;
    course?: ICourseResponse;
    departments: IDepartmentResponse[];
    onCancel: () => void;
}

const ModalUpdateCourse: React.FC<ModalUpdateCourseProps> = ({
    visible,
    course,
    departments,
    onCancel,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible && course) {
            form.setFieldsValue({
                code: course.code,
                name: course.name,
                departmentId: course.departmentId,
            });
        } else if (visible && !course) {
            form.resetFields();
        }
    }, [visible, course, form]);

    const handleOk = async () => {
        await handleSubmit();
    };

    const handleSubmit = async () => {
        if (!course?.id) {
            NotificationService.error({
                message: "Không tìm thấy thông tin khóa học để cập nhật"
            });
            return;
        }

        try {
            setLoading(true);
            const values = await form.validateFields();

            const courseRequest: ICourseRequest = {
                code: values.code,
                name: values.name,
                departmentId: values.departmentId,
            };

            const response = await updateCourse(course.id, courseRequest);
            if (response.ok) {
                NotificationService.success({
                    message: "Cập nhật khóa học thành công"
                });
                onCancel();
            } else {
                NotificationService.error({
                    message: "Cập nhật khóa học thất bại",
                    description: response.message
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
            title="Cập nhật khóa học"
            open={visible}
            onOk={handleOk}
            onCancel={onCancel}
            confirmLoading={loading}
            okText="Cập nhật"
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

export default ModalUpdateCourse;