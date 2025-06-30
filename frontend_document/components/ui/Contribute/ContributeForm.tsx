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
        <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 lg:p-8">
            {/* Form Header with responsive spacing */}
            <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    <span className="hidden sm:inline">Chia sẻ tài liệu của bạn</span>
                    <span className="sm:hidden">Chia sẻ tài liệu</span>
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                    <span className="hidden sm:inline">Điền thông tin bên dưới để đóng góp tài liệu cho cộng đồng</span>
                    <span className="sm:hidden">Điền thông tin để đóng góp tài liệu</span>
                </p>
            </div>

            <form className="space-y-4 sm:space-y-6" onSubmit={(e) => e.preventDefault()}>
                {/* Document Name Field with responsive styling */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="hidden sm:inline">Tên tài liệu</span>
                        <span className="sm:hidden">Tên tài liệu</span>
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleNameChange}
                        placeholder="Tên tài liệu..."
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                        required
                    />
                </div>

                {/* Course Selector with responsive wrapper */}
                <div className="w-full">
                    <CourseSelector
                        value={formData.subject}
                        courseId={formData.courseId}
                        onCourseSelect={handleCourseSelect}
                    />
                </div>

                {/* File Uploader with responsive wrapper */}
                <div className="w-full">
                    <FileUploader
                        file={formData.file}
                        onFileChange={handleFileChange}
                    />
                </div>

                {/* Form Actions with responsive wrapper */}
                <div className="w-full pt-2">
                    <FormActions
                        isSubmitting={isSubmitting}
                        isFormValid={isFormValid}
                        onCancel={handleCancel}
                        onSubmit={handleSubmit}
                    />
                </div>
            </form>

            {/* Guidelines with responsive design */}
            <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2 sm:mb-3 text-sm sm:text-base">
                    <span className="hidden sm:inline">Hướng dẫn đóng góp</span>
                    <span className="sm:hidden">Hướng dẫn</span>
                </h3>
                <ul className="text-xs sm:text-sm text-blue-800 space-y-1 sm:space-y-2">
                    <li className="flex items-start">
                        <span className="text-blue-600 mr-2 flex-shrink-0">•</span>
                        <span className="hidden sm:inline">Tài liệu phải có nội dung phù hợp với môn học được chọn</span>
                        <span className="sm:hidden">Nội dung phù hợp với môn học</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-blue-600 mr-2 flex-shrink-0">•</span>
                        <span className="hidden sm:inline">Không đăng tải tài liệu có bản quyền mà không có sự cho phép</span>
                        <span className="sm:hidden">Không vi phạm bản quyền</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-blue-600 mr-2 flex-shrink-0">•</span>
                        <span className="hidden sm:inline">Tên tài liệu nên mô tả rõ ràng nội dung</span>
                        <span className="sm:hidden">Tên tài liệu mô tả rõ ràng</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-blue-600 mr-2 flex-shrink-0">•</span>
                        <span className="hidden sm:inline">Tài liệu sẽ được kiểm duyệt trước khi công khai</span>
                        <span className="sm:hidden">Sẽ được kiểm duyệt trước</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
