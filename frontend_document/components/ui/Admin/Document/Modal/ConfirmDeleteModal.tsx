import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Typography, Space, Alert, Checkbox, Progress, notification } from 'antd';
import { ExclamationCircleOutlined, LockOutlined, DeleteOutlined, FileTextOutlined } from '@ant-design/icons';
import { IDocumentResponse } from '@/types/document';
import NotificationService from '@/components/ui/Notification/NotificationService';
import { checkAuthSecurity } from '@/actions/auth.actions';

const { Title, Text } = Typography;

interface ConfirmDeleteModalProps {
    visible: boolean;
    document?: IDocumentResponse;
    onCancel: () => void;
    onConfirm: (password: string) => Promise<void>;
    loading?: boolean;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
    visible,
    document,
    onCancel,
    onConfirm,
    loading = false
}) => {
    const [form] = Form.useForm();
    const [passwordError, setPasswordError] = useState<string>('');
    const [confirmationChecked, setConfirmationChecked] = useState(false);
    const [documentNameConfirmed, setDocumentNameConfirmed] = useState(false);
    const [countdown, setCountdown] = useState(10);
    const [canDelete, setCanDelete] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false); // Track if user has tried to submit

    // Đếm ngược 10 giây trước khi cho phép xóa
    useEffect(() => {
        if (visible && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            setCanDelete(true);
        }
    }, [visible, countdown]);

    // Reset state khi modal đóng/mở
    useEffect(() => {
        if (visible) {
            setCountdown(10);
            setCanDelete(false);
            setConfirmationChecked(false);
            setDocumentNameConfirmed(false);
            setPasswordError('');
            setHasSubmitted(false); // Reset submit state
            form.resetFields();
        }
    }, [visible, form]);

    const handleSubmit = async () => {
        console.log('🔍 Debug - handleSubmit called');
        console.log('confirmationChecked:', confirmationChecked);
        console.log('documentNameConfirmed:', documentNameConfirmed);
        console.log('canDelete:', canDelete);

        // Mark that user has attempted to submit
        setHasSubmitted(true);

        try {
            // Kiểm tra thời gian chờ trước
            if (!canDelete) {
                notification.warning({
                    message: 'Vui lòng chờ',
                    description: `Bạn cần chờ thêm ${countdown} giây trước khi có thể xóa tài liệu.`,
                    placement: 'topRight',
                    duration: 3
                });
                return;
            }

            // Kiểm tra các điều kiện bảo mật TRƯỚC khi validate form
            if (!confirmationChecked) {
                setPasswordError('Vui lòng xác nhận điều khoản');
                return;
            }

            if (!documentNameConfirmed) {
                console.log('❌ Document name not confirmed - showing notification');
                setPasswordError('Vui lòng xác nhận tên tài liệu');
                return;
            }

            // Chỉ validate form khi các điều kiện khác đã đạt
            const values = await form.validateFields();

            const responseCheckSecurity = await checkAuthSecurity(values.password);
            if (!responseCheckSecurity.ok) {
                console.log('❌ Security check failed - showing notification');
                setPasswordError('Mật khẩu bảo mật không chính xác');
                NotificationService.error({
                    message: 'Mật khẩu không đúng',
                    description: 'Mật khẩu bảo mật không chính xác. Vui lòng thử lại.'
                });
                return;
            }

            setPasswordError('');
            console.log('✅ Password: ', values.password);
            await onConfirm(values.password);
        } catch (error) {
            console.log('❌ Error in handleSubmit:', error);
            if (error instanceof Error && error.message.includes('password')) {
                setPasswordError('Mật khẩu bảo mật không chính xác');
                NotificationService.error({
                    message: 'Mật khẩu không đúng',
                    description: 'Mật khẩu bảo mật không chính xác. Vui lòng thử lại.'
                });
            }
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setPasswordError('');
        setConfirmationChecked(false);
        setDocumentNameConfirmed(false);
        setCountdown(10);
        setCanDelete(false);
        setHasSubmitted(false); // Reset submit state
        onCancel();
    };

    const handleDocumentNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDocumentNameConfirmed(value === document?.name);
    };

    const isFormValid = confirmationChecked && documentNameConfirmed && canDelete;

    return (
        <Modal
            title={
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <ExclamationCircleOutlined className="text-red-500 text-xl" />
                    </div>
                    <div>
                        <Title level={4} className="mb-0 text-red-600">
                            Xác nhận xóa tài liệu
                        </Title>
                        <Text type="secondary" className="text-sm">
                            Hành động này không thể hoàn tác
                        </Text>
                    </div>
                </div>
            }
            open={visible}
            onCancel={handleCancel}
            width={500}
            centered
            destroyOnClose
            maskClosable={false}
            footer={[
                <Button key="cancel" onClick={handleCancel} disabled={loading}>
                    Hủy bỏ
                </Button>,
                <Button
                    key="confirm"
                    type="primary"
                    danger
                    onClick={handleSubmit}
                    loading={loading}
                    disabled={!isFormValid || loading}
                    icon={<DeleteOutlined />}
                >
                    {countdown > 0 ? `Chờ ${countdown}s` : 'Xóa tài liệu'}
                </Button>
            ]}
        >
            <div className="py-4">
                {/* Countdown Progress */}
                {countdown > 0 && (
                    <div className="mb-4">
                        <Text className="text-sm text-gray-600 mb-2 block">
                            Vui lòng đợi {countdown} giây trước khi có thể xóa tài liệu
                        </Text>
                        <Progress
                            percent={((10 - countdown) / 10) * 100}
                            status="active"
                            strokeColor="#ef4444"
                            size="small"
                        />
                    </div>
                )}

                {/* Warning message */}
                <Alert
                    message="Cảnh báo!"
                    description={
                        <div>
                            <p className="mb-2">
                                Bạn đang thực hiện xóa vĩnh viễn tài liệu:
                            </p>
                            <div className="bg-gray-50 p-3 rounded-md border-l-4 border-red-400">
                                <Text strong className="text-red-600">
                                    &quot;{document?.name}&quot;
                                </Text>
                                <br />
                                <Text type="secondary" className="text-sm">
                                    Môn học: {document?.courseName}
                                </Text>
                                <br />
                                <Text type="secondary" className="text-sm">
                                    Người tạo: {document?.fullNameUser}
                                </Text>
                            </div>
                            <p className="mt-3 mb-0 text-red-600">
                                <strong>Lưu ý:</strong> Tài liệu sẽ bị xóa hoàn toàn và không thể khôi phục được.
                            </p>
                        </div>
                    }
                    type="warning"
                    showIcon
                    className="mb-6"
                />

                {/* Document name confirmation */}
                <div className={`mb-4 p-3 rounded-md border ${hasSubmitted && canDelete && !documentNameConfirmed
                    ? 'border-red-300 bg-red-50'
                    : documentNameConfirmed
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-300 bg-gray-50'
                    }`}>
                    <Form.Item
                        label={
                            <div className="flex items-center gap-2">
                                <FileTextOutlined className="text-gray-500" />
                                <span>Xác nhận tên tài liệu</span>
                                {documentNameConfirmed && <span className="text-green-500">✓</span>}
                            </div>
                        }
                        help={`Gõ chính xác tên tài liệu: "${document?.name}" để xác nhận`}
                        validateStatus={documentNameConfirmed ? 'success' : hasSubmitted && canDelete ? 'warning' : undefined}
                        className="mb-0"
                    >
                        <Input
                            placeholder={`Gõ: ${document?.name}`}
                            onChange={handleDocumentNameChange}
                            disabled={loading}
                            size="large"
                            prefix={<FileTextOutlined className="text-gray-400" />}
                        />
                    </Form.Item>
                    {hasSubmitted && canDelete && !documentNameConfirmed && (
                        <div className="mt-2">
                            <Text type="danger" className="text-xs">
                                ⚠️ Bạn cần gõ chính xác tên tài liệu để xác nhận
                            </Text>
                        </div>
                    )}
                </div>

                {/* Password form */}
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
                        label={
                            <div className="flex items-center gap-2">
                                <LockOutlined className="text-gray-500" />
                                <span>Mật khẩu bảo mật</span>
                            </div>
                        }
                        name="password"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu bảo mật!' },
                            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                        ]}
                        validateStatus={passwordError ? 'error' : ''}
                        help={passwordError || 'Nhập mật khẩu bảo mật của bạn để xác nhận xóa tài liệu'}
                    >
                        <Input.Password
                            placeholder="Nhập mật khẩu bảo mật..."
                            size="large"
                            prefix={<LockOutlined className="text-gray-400" />}
                            disabled={loading}
                        />
                    </Form.Item>
                </Form>

                {/* Confirmation checkbox */}
                <div className={`mb-4 p-3 rounded-md border ${hasSubmitted && canDelete && !confirmationChecked
                    ? 'border-red-300 bg-red-50'
                    : confirmationChecked
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-300 bg-gray-50'
                    }`}>
                    <Checkbox
                        checked={confirmationChecked}
                        onChange={(e) => setConfirmationChecked(e.target.checked)}
                        disabled={loading}
                        className={confirmationChecked ? 'text-green-700' : hasSubmitted && canDelete ? 'text-red-700' : 'text-gray-700'}
                    >
                        <Text className={`text-sm ${confirmationChecked
                            ? 'text-green-700'
                            : hasSubmitted && canDelete
                                ? 'text-red-700'
                                : 'text-gray-700'
                            }`}>
                            Tôi hiểu rằng hành động này không thể hoàn tác và chịu trách nhiệm hoàn toàn
                        </Text>
                    </Checkbox>
                    {hasSubmitted && canDelete && !confirmationChecked && (
                        <div className="mt-2">
                            <Text type="danger" className="text-xs">
                                ⚠️ Bạn cần xác nhận điều khoản này để tiếp tục
                            </Text>
                        </div>
                    )}
                </div>

                {/* Additional warning */}
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-4">
                    <div className="flex items-start gap-3">
                        <ExclamationCircleOutlined className="text-red-500 mt-0.5" />
                        <div>
                            <Text strong className="text-red-700">
                                Điều khoản xác nhận:
                            </Text>
                            <ul className="mt-2 mb-0 text-sm text-red-600 space-y-1">
                                <li>• Tôi hiểu rằng tài liệu sẽ bị xóa vĩnh viễn</li>
                                <li>• Tôi chịu trách nhiệm hoàn toàn cho hành động này</li>
                                <li>• Dữ liệu không thể được khôi phục sau khi xóa</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmDeleteModal;
