import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Typography, Alert, Checkbox, Progress, notification } from 'antd';
import { CheckCircleOutlined, LockOutlined, UndoOutlined, FileTextOutlined } from '@ant-design/icons';
import { IDocumentResponse } from '@/types/document';
import NotificationService from '@/components/ui/Notification/NotificationService';
import { checkAuthSecurity } from '@/actions/auth.actions';

const { Title, Text } = Typography;

interface ConfirmRestoreModalProps {
    visible: boolean;
    document?: IDocumentResponse;
    onCancel: () => void;
    onConfirm: (password: string) => Promise<void>;
    loading?: boolean;
}

const ConfirmRestoreModal: React.FC<ConfirmRestoreModalProps> = ({
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
    const [countdown, setCountdown] = useState(5); // Ngắn hơn vì khôi phục ít rủi ro hơn xóa
    const [canRestore, setCanRestore] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    // Đếm ngược 5 giây trước khi cho phép khôi phục
    useEffect(() => {
        if (visible && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            setCanRestore(true);
        }
    }, [visible, countdown]);

    // Reset state khi modal đóng/mở
    useEffect(() => {
        if (visible) {
            setCountdown(5);
            setCanRestore(false);
            setConfirmationChecked(false);
            setDocumentNameConfirmed(false);
            setPasswordError('');
            setHasSubmitted(false);
            form.resetFields();
        }
    }, [visible, form]);

    const handleSubmit = async () => {
        console.log('🔍 Debug - handleSubmit called (Restore)');
        console.log('confirmationChecked:', confirmationChecked);
        console.log('documentNameConfirmed:', documentNameConfirmed);
        console.log('canRestore:', canRestore);

        // Mark that user has attempted to submit
        setHasSubmitted(true);

        try {
            // Kiểm tra thời gian chờ trước
            if (!canRestore) {
                notification.warning({
                    message: 'Vui lòng chờ',
                    description: `Bạn cần chờ thêm ${countdown} giây trước khi có thể khôi phục tài liệu.`,
                    placement: 'topRight',
                    duration: 3
                });
                return;
            }

            // Kiểm tra các điều kiện bảo mật
            if (!confirmationChecked) {
                console.log('❌ Confirmation not checked - showing notification');
                setPasswordError('Vui lòng xác nhận điều khoản');

                NotificationService.error({
                    message: 'Xác nhận điều khoản',
                    description: 'Vui lòng xác nhận rằng bạn hiểu hành động này sẽ khôi phục tài liệu về trạng thái đã duyệt.'
                });

                notification.error({
                    message: 'Xác nhận điều khoản',
                    description: 'Vui lòng xác nhận rằng bạn hiểu hành động này sẽ khôi phục tài liệu về trạng thái đã duyệt.',
                    placement: 'topRight',
                    duration: 4
                });
                return;
            }

            if (!documentNameConfirmed) {
                console.log('❌ Document name not confirmed - showing notification');
                setPasswordError('Vui lòng xác nhận tên tài liệu');

                NotificationService.error({
                    message: 'Xác nhận tên tài liệu',
                    description: `Vui lòng gõ chính xác tên tài liệu: "${document?.name}" để xác nhận`
                });

                notification.error({
                    message: 'Xác nhận tên tài liệu',
                    description: `Vui lòng gõ chính xác tên tài liệu: "${document?.name}" để xác nhận`,
                    placement: 'topRight',
                    duration: 4
                });
                return;
            }

            // Validate form khi các điều kiện khác đã đạt
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
        setCountdown(5);
        setCanRestore(false);
        setHasSubmitted(false);
        onCancel();
    };

    const handleDocumentNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDocumentNameConfirmed(value === document?.name);
    };

    const isFormValid = confirmationChecked && documentNameConfirmed && canRestore;

    return (
        <Modal
            title={
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircleOutlined className="text-green-500 text-xl" />
                    </div>
                    <div>
                        <Title level={4} className="mb-0 text-green-600">
                            Xác nhận khôi phục tài liệu
                        </Title>
                        <Text type="secondary" className="text-sm">
                            Tài liệu sẽ được khôi phục về trạng thái đã duyệt
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
                    onClick={handleSubmit}
                    loading={loading}
                    disabled={!isFormValid || loading}
                    icon={<UndoOutlined />}
                    style={{ backgroundColor: '#22c55e', borderColor: '#22c55e' }}
                >
                    {countdown > 0 ? `Chờ ${countdown}s` : 'Khôi phục tài liệu'}
                </Button>
            ]}
        >
            <div className="py-4">
                {/* Countdown Progress */}
                {countdown > 0 && (
                    <div className="mb-4">
                        <Text className="text-sm text-gray-600 mb-2 block">
                            Vui lòng đợi {countdown} giây trước khi có thể khôi phục tài liệu
                        </Text>
                        <Progress
                            percent={((5 - countdown) / 5) * 100}
                            status="active"
                            strokeColor="#22c55e"
                            size="small"
                        />
                    </div>
                )}

                {/* Warning message */}
                <Alert
                    message="Xác nhận khôi phục!"
                    description={
                        <div>
                            <p className="mb-2">
                                Bạn đang thực hiện khôi phục tài liệu:
                            </p>
                            <div className="bg-gray-50 p-3 rounded-md border-l-4 border-green-400">
                                <Text strong className="text-green-600">
                                    "{document?.name}"
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
                            <p className="mt-3 mb-0 text-green-600">
                                <strong>Lưu ý:</strong> Tài liệu sẽ được khôi phục về trạng thái "Đã duyệt" và hiển thị công khai.
                            </p>
                        </div>
                    }
                    type="info"
                    showIcon
                    className="mb-6"
                />

                {/* Document name confirmation */}
                <div className={`mb-4 p-3 rounded-md border ${
                    hasSubmitted && canRestore && !documentNameConfirmed 
                        ? 'border-yellow-300 bg-yellow-50' 
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
                        validateStatus={documentNameConfirmed ? 'success' : hasSubmitted && canRestore ? 'warning' : undefined}
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
                    {hasSubmitted && canRestore && !documentNameConfirmed && (
                        <div className="mt-2">
                            <Text type="warning" className="text-xs">
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
                        help={passwordError || 'Nhập mật khẩu bảo mật của bạn để xác nhận khôi phục tài liệu'}
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
                <div className={`mb-4 p-3 rounded-md border ${
                    hasSubmitted && canRestore && !confirmationChecked 
                        ? 'border-yellow-300 bg-yellow-50' 
                        : confirmationChecked 
                            ? 'border-green-300 bg-green-50' 
                            : 'border-gray-300 bg-gray-50'
                }`}>
                    <Checkbox
                        checked={confirmationChecked}
                        onChange={(e) => setConfirmationChecked(e.target.checked)}
                        disabled={loading}
                        className={confirmationChecked ? 'text-green-700' : hasSubmitted && canRestore ? 'text-yellow-700' : 'text-gray-700'}
                    >
                        <Text className={`text-sm ${
                            confirmationChecked 
                                ? 'text-green-700' 
                                : hasSubmitted && canRestore 
                                    ? 'text-yellow-700' 
                                    : 'text-gray-700'
                        }`}>
                            Tôi hiểu rằng tài liệu sẽ được khôi phục và hiển thị công khai
                        </Text>
                    </Checkbox>
                    {hasSubmitted && canRestore && !confirmationChecked && (
                        <div className="mt-2">
                            <Text type="warning" className="text-xs">
                                ⚠️ Bạn cần xác nhận điều khoản này để tiếp tục
                            </Text>
                        </div>
                    )}
                </div>

                {/* Additional info */}
                <div className="bg-green-50 border border-green-200 rounded-md p-4 mt-4">
                    <div className="flex items-start gap-3">
                        <CheckCircleOutlined className="text-green-500 mt-0.5" />
                        <div>
                            <Text strong className="text-green-700">
                                Sau khi khôi phục:
                            </Text>
                            <ul className="mt-2 mb-0 text-sm text-green-600 space-y-1">
                                <li>• Tài liệu sẽ có trạng thái "Đã duyệt"</li>
                                <li>• Người dùng có thể tìm kiếm và tải xuống</li>
                                <li>• Tài liệu sẽ hiển thị trong danh sách công khai</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmRestoreModal;
