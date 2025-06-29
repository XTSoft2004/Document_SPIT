'use client';

import { useState } from 'react';
import { ICourseResponse } from '@/types/course';
import CourseSelector from './CourseSelector';
import FileUploader from './FileUploader';
import FormActions from './FormActions';
import {
    ContributeFormData,
    createEmptyFormData,
    validateForm,
    uploadDocument
} from './contributeUtils';
import NotificationService from '../Notification/NotificationService';

export default function ContributeForm() {
    const [formData, setFormData] = useState<ContributeFormData>(createEmptyFormData());
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, name: e.target.value }));
    };

    const handleCourseSelect = (course: ICourseResponse) => {
        setFormData(prev => ({
            ...prev,
            subject: course.name,
            courseId: course.id
        }));
    };

    const handleFileChange = (file: File | null) => {
        setFormData(prev => ({ ...prev, file }));
    };

    const handleCancel = () => {
        setFormData(createEmptyFormData());
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            await uploadDocument(formData);

            NotificationService.success({ message: 'Tài liệu đã được gửi thành công!', description: 'Chúng tôi sẽ xem xét và phê duyệt trong thời gian sớm nhất.' });

            setFormData(createEmptyFormData());
        } catch (error) {
            console.error('Error uploading file:', error);
            NotificationService.error({ message: 'Đã xảy ra lỗi khi gửi tài liệu', description: 'Vui lòng thử lại sau.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = validateForm(formData);

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            {/* Form Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Chia sẻ tài liệu của bạn
                </h2>
                <p className="text-gray-600">
                    Điền thông tin bên dưới để đóng góp tài liệu cho cộng đồng
                </p>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                {/* Document Name Field */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Tên tài liệu <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleNameChange}
                        placeholder="Ví dụ: Bài giảng Toán cao cấp - Chương 1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        required
                    />
                </div>

                <CourseSelector
                    value={formData.subject}
                    courseId={formData.courseId}
                    onCourseSelect={handleCourseSelect}
                />

                <FileUploader
                    file={formData.file}
                    onFileChange={handleFileChange}
                />

                <FormActions
                    isSubmitting={isSubmitting}
                    isFormValid={isFormValid}
                    onCancel={handleCancel}
                    onSubmit={handleSubmit}
                />
            </form>

            {/* Guidelines */}
            <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-3">Hướng dẫn đóng góp</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Tài liệu phải có nội dung phù hợp với môn học được chọn</li>
                    <li>• Không đăng tải tài liệu có bản quyền mà không có sự cho phép</li>
                    <li>• Tên tài liệu nên mô tả rõ ràng nội dung</li>
                    <li>• Tài liệu sẽ được kiểm duyệt trước khi công khai</li>
                </ul>
            </div>
        </div>
    );
}
