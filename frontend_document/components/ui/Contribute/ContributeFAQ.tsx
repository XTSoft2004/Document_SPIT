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
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Câu hỏi thường gặp
                </h2>
                <p className="text-gray-600">
                    Những thắc mắc phổ biến về việc đóng góp tài liệu
                </p>
            </div>

            <div className="space-y-4">
                {FAQ_DATA.map((faq) => (
                    <div
                        key={faq.id}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                        <button
                            onClick={() => toggleItem(faq.id)}
                            className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                        >
                            <span className="font-medium text-gray-900">
                                {faq.question}
                            </span>
                            <svg
                                className={`w-5 h-5 text-gray-500 transition-transform ${openItems.includes(faq.id) ? 'rotate-180' : ''
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
                            <div className="px-6 py-4 bg-white border-t border-gray-200">
                                <p className="text-gray-700 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-semibold text-blue-900 mb-2">
                            Vẫn có thắc mắc?
                        </h3>
                        <p className="text-blue-800 mb-3">
                            Nếu bạn có câu hỏi khác hoặc cần hỗ trợ, đừng ngần ngại liên hệ với chúng tôi.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <a
                                href="mailto:support@example.com"
                                className="inline-flex items-center text-blue-700 hover:text-blue-800 font-medium"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                support@example.com
                            </a>
                            <a
                                href="tel:+84123456789"
                                className="inline-flex items-center text-blue-700 hover:text-blue-800 font-medium"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                0123 456 789
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
