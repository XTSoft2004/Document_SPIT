'use client';

import { useState } from 'react';

const FAQ_DATA = [
    {
        id: 1,
        question: 'Tôi có thể đóng góp những loại tài liệu nào?',
        answer: 'Bạn có thể đóng góp các loại tài liệu như: bài giảng, slide, đề thi, bài tập, source code, tài liệu tham khảo, v.v. Các định dạng được hỗ trợ bao gồm PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT, ZIP, RAR.'
    },
    {
        id: 2,
        question: 'Tài liệu của tôi có được kiểm duyệt không?',
        answer: 'Có, tất cả tài liệu đóng góp sẽ được kiểm duyệt bởi đội ngũ quản trị trước khi được công khai. Quá trình này thường mất từ 1-2 ngày làm việc.'
    },
    {
        id: 3,
        question: 'Tôi có nhận được điểm thưởng khi đóng góp không?',
        answer: 'Có! Hệ thống sẽ cộng điểm thưởng dựa trên chất lượng và độ hữu ích của tài liệu. Điểm thưởng có thể được sử dụng để tải về các tài liệu premium.'
    },
    {
        id: 4,
        question: 'Làm sao để đảm bảo tài liệu không vi phạm bản quyền?',
        answer: 'Chỉ đóng góp những tài liệu mà bạn sở hữu hoặc có quyền chia sẻ. Không đăng tải sách giáo khoa có bản quyền, tài liệu thương mại mà không có sự cho phép.'
    },
    {
        id: 5,
        question: 'Kích thước tối đa của tệp là bao nhiêu?',
        answer: 'Kích thước tối đa cho mỗi tệp là 50MB. Nếu tài liệu của bạn lớn hơn, hãy thử nén tệp hoặc chia nhỏ thành nhiều phần.'
    },
    {
        id: 6,
        question: 'Tôi có thể chỉnh sửa tài liệu sau khi đã đăng không?',
        answer: 'Sau khi tài liệu được phê duyệt, bạn có thể yêu cầu chỉnh sửa thông qua hệ thống báo cáo. Tuy nhiên, tốt nhất là kiểm tra kỹ trước khi đóng góp.'
    }
];

export default function ContributeFAQ() {
    const [openItems, setOpenItems] = useState<number[]>([]);

    const toggleItem = (id: number) => {
        setOpenItems(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    return (
        <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 lg:p-8">
            <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    <span className="hidden sm:inline">Câu hỏi thường gặp</span>
                    <span className="sm:hidden">FAQ</span>
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                    <span className="hidden sm:inline">Những thắc mắc phổ biến về việc đóng góp tài liệu</span>
                    <span className="sm:hidden">Thắc mắc về đóng góp tài liệu</span>
                </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
                {FAQ_DATA.map((faq) => (
                    <div
                        key={faq.id}
                        className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:border-blue-300 hover:shadow-sm"
                    >
                        <button
                            onClick={() => toggleItem(faq.id)}
                            className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between gap-3"
                        >
                            <span className="font-medium text-gray-900 text-sm sm:text-base leading-snug flex-1 text-left">
                                {faq.question}
                            </span>
                            <svg
                                className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ${openItems.includes(faq.id) ? 'rotate-180' : ''
                                    }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>
                        {openItems.includes(faq.id) && (
                            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-white border-t border-gray-200 animate-fadeIn">
                                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                                    {faq.answer}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-3">
                    <div className="flex-shrink-0 self-center sm:self-start">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h3 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">
                            <span className="hidden sm:inline">Vẫn có thắc mắc?</span>
                            <span className="sm:hidden">Cần hỗ trợ?</span>
                        </h3>
                        <p className="text-blue-800 mb-3 text-sm sm:text-base">
                            <span className="hidden sm:inline">Nếu bạn có câu hỏi khác hoặc cần hỗ trợ, đừng ngần ngại liên hệ với chúng tôi.</span>
                            <span className="sm:hidden">Liên hệ với chúng tôi để được hỗ trợ.</span>
                        </p>
                        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3">
                            <a
                                href="mailto:support@example.com"
                                className="inline-flex items-center justify-center sm:justify-start text-blue-700 hover:text-blue-800 font-medium text-sm transition-colors duration-200 hover:bg-blue-100 px-3 py-2 rounded-lg"
                            >
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span className="hidden sm:inline">support@example.com</span>
                                <span className="sm:hidden">Email hỗ trợ</span>
                            </a>
                            <a
                                href="tel:+84123456789"
                                className="inline-flex items-center justify-center sm:justify-start text-blue-700 hover:text-blue-800 font-medium text-sm transition-colors duration-200 hover:bg-blue-100 px-3 py-2 rounded-lg"
                            >
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span className="hidden sm:inline">0123 456 789</span>
                                <span className="sm:hidden">Hotline</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
            `}</style>
        </div>
    );
}
