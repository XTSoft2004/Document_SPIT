'use client'

import { createCategory } from "@/actions/category.actions";
import NotificationService from "@/components/ui/Notification/NotificationService";
import { ICategoryRequest } from "@/types/category";
import { Form, Input, Modal, message } from "antd";
import { useEffect, useState } from "react";

interface ModalCreateCategoryProps {
    visible: boolean;
    onCancel: () => void;
}

export default function ModalCreateCategory({ visible, onCancel }: ModalCreateCategoryProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            form.resetFields();
        }
    }, [visible, form]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const values = await form.validateFields();
            const categoryData: ICategoryRequest = {
                name: values.name,
                description: values.description || ''
            };
            const response = await createCategory(categoryData);
            if (response.ok) {
                NotificationService.success({
                    message: response.message,
                });
                form.resetFields();
                onCancel();
            } else {
                NotificationService.error({
                    message: response.message,
                });
            }
        } catch (error) {
            message.error('Có lỗi xảy ra khi tạo danh mục: ' + error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-lg font-semibold">Thêm danh mục mới</span>
                </div>
            }
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={500}
            className="top-20"
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="mt-4"
            >
                <Form.Item
                    label={<span className="font-medium">Tên danh mục</span>}
                    name="name"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tên danh mục!' },
                        { max: 100, message: 'Tên danh mục không được vượt quá 100 ký tự!' }
                    ]}
                >
                    <Input
                        placeholder="Nhập tên danh mục"
                        className="h-10"
                    />
                </Form.Item>

                <Form.Item
                    label={<span className="font-medium">Mô tả</span>}
                    name="description"
                    rules={[
                        { max: 500, message: 'Mô tả không được vượt quá 500 ký tự!' }
                    ]}
                >
                    <Input.TextArea
                        placeholder="Nhập mô tả cho danh mục (tùy chọn)"
                        rows={3}
                        className="resize-none"
                    />
                </Form.Item>

                <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading && (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        )}
                        {loading ? 'Đang tạo...' : 'Tạo danh mục'}
                    </button>
                </div>
            </Form>
        </Modal>
    );
}
