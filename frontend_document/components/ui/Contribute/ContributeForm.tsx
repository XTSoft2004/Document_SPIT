'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/shadcn-ui/button';

// Mock data for subjects
const SUBJECTS = [
    { id: 1, name: 'Toán cao cấp A1', code: 'MATH101' },
    { id: 2, name: 'Toán cao cấp A2', code: 'MATH102' },
    { id: 3, name: 'Vật lý đại cương A1', code: 'PHYS101' },
    { id: 4, name: 'Vật lý đại cương A2', code: 'PHYS102' },
    { id: 5, name: 'Hóa học đại cương', code: 'CHEM101' },
    { id: 6, name: 'Lập trình C/C++', code: 'PROG101' },
    { id: 7, name: 'Cấu trúc dữ liệu và giải thuật', code: 'ALGO101' },
    { id: 8, name: 'Cơ sở dữ liệu', code: 'DB101' },
    { id: 9, name: 'Mạng máy tính', code: 'NET101' },
    { id: 10, name: 'Hệ điều hành', code: 'OS101' },
    { id: 11, name: 'Kỹ thuật phần mềm', code: 'SE101' },
    { id: 12, name: 'Trí tuệ nhân tạo', code: 'AI101' },
    { id: 13, name: 'Học máy', code: 'ML101' },
    { id: 14, name: 'An toàn thông tin', code: 'SEC101' },
    { id: 15, name: 'Phân tích thiết kế hệ thống', code: 'SAD101' },
    { id: 16, name: 'Lập trình Web', code: 'WEB101' },
    { id: 17, name: 'Lập trình Mobile', code: 'MOB101' },
    { id: 18, name: 'Tiếng Anh chuyên ngành', code: 'ENG101' },
    { id: 19, name: 'Kinh tế chính trị', code: 'POL101' },
    { id: 20, name: 'Pháp luật đại cương', code: 'LAW101' },
];

interface ContributeFormData {
    name: string;
    file: File | null;
    subject: string;
}

export default function ContributeForm() {
    const [formData, setFormData] = useState<ContributeFormData>({
        name: '',
        file: null,
        subject: '',
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const filteredSubjects = SUBJECTS.filter(subject =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setFormData(prev => ({ ...prev, file }));
    };

    const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragOver(false);
        const file = event.dataTransfer.files?.[0] || null;
        setFormData(prev => ({ ...prev, file }));
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleSubjectSelect = (subject: typeof SUBJECTS[0]) => {
        setFormData(prev => ({ ...prev, subject: subject.name }));
        setSearchTerm(subject.name);
        setIsSubjectDropdownOpen(false);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Show success message
        alert('Tài liệu đã được đóng góp thành công! Cảm ơn bạn đã chia sẻ.');

        // Reset form
        setFormData({ name: '', file: null, subject: '' });
        setSearchTerm('');
        setIsSubmitting(false);
    };

    const isFormValid = formData.name.trim() && formData.file && formData.subject;

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Chia sẻ tài liệu của bạn
                </h2>
                <p className="text-gray-600">
                    Điền thông tin bên dưới để đóng góp tài liệu cho cộng đồng
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Tên tài liệu <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ví dụ: Bài giảng Toán cao cấp - Chương 1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        required
                    />
                </div>

                {/* Subject Field */}
                <div className="relative">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Môn học <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            id="subject"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setIsSubjectDropdownOpen(true);
                            }}
                            onFocus={() => setIsSubjectDropdownOpen(true)}
                            placeholder="Tìm kiếm môn học..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-10"
                            required
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Dropdown */}
                    {isSubjectDropdownOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {filteredSubjects.length > 0 ? (
                                filteredSubjects.map((subject) => (
                                    <button
                                        key={subject.id}
                                        type="button"
                                        onClick={() => handleSubjectSelect(subject)}
                                        className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                                    >
                                        <div className="font-medium text-gray-900">{subject.name}</div>
                                        <div className="text-sm text-gray-500">{subject.code}</div>
                                    </button>
                                ))
                            ) : (
                                <div className="px-4 py-3 text-gray-500">
                                    Không tìm thấy môn học nào
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* File Upload Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tệp tài liệu <span className="text-red-500">*</span>
                    </label>
                    <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragOver
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                        onDrop={handleFileDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                    >
                        <input
                            type="file"
                            id="file"
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.rar"
                            className="hidden"
                        />

                        {formData.file ? (
                            <div className="space-y-2">
                                <div className="flex items-center justify-center">
                                    <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-lg font-medium text-gray-900">{formData.file.name}</p>
                                <p className="text-sm text-gray-500">
                                    {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, file: null }))}
                                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                                >
                                    Xóa tệp
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-center">
                                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                </div>
                                <div>
                                    <label htmlFor="file" className="cursor-pointer">
                                        <span className="text-blue-600 hover:text-blue-700 font-medium">
                                            Nhấp để chọn tệp
                                        </span>
                                        <span className="text-gray-500"> hoặc kéo thả tệp vào đây</span>
                                    </label>
                                </div>
                                <p className="text-sm text-gray-500">
                                    Hỗ trợ: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT, ZIP, RAR
                                </p>
                                <p className="text-xs text-gray-400">
                                    Kích thước tối đa: 50MB
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            setFormData({ name: '', file: null, subject: '' });
                            setSearchTerm('');
                        }}
                        disabled={isSubmitting}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        disabled={!isFormValid || isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center space-x-2">
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Đang tải lên...</span>
                            </div>
                        ) : (
                            'Đóng góp tài liệu'
                        )}
                    </Button>
                </div>
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

            {/* Click outside to close dropdown */}
            {isSubjectDropdownOpen && (
                <div
                    className="fixed inset-0 z-5"
                    onClick={() => setIsSubjectDropdownOpen(false)}
                />
            )}
        </div>
    );
}
