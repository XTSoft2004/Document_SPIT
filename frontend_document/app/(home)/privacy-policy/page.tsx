'use client'

const privacyPolicySections = [
  {
    title: '1. Mục đích và phạm vi áp dụng',
    content:
      'Chính sách bảo mật này áp dụng cho tất cả người dùng truy cập và sử dụng dịch vụ SPIT - Document. Chính sách mô tả cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin cá nhân và tài liệu của bạn.',
  },
  {
    title: '2. Thu thập thông tin',
    content: (
      <>
        <p className="mb-4">Chúng tôi có thể thu thập các thông tin như:</p>
        <ul className="space-y-2 sm:space-y-3">
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-bold mr-2 sm:mr-3 mt-0.5 flex-shrink-0">i</span>
            <span className="text-sm sm:text-base">Thông tin cá nhân (họ tên, email, số điện thoại)</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-bold mr-2 sm:mr-3 mt-0.5 flex-shrink-0">ii</span>
            <span className="text-sm sm:text-base">Thông tin tài liệu (tên file, loại, thời gian tải lên)</span>
          </li>
        </ul>
      </>
    ),
  },
  {
    title: '3. Mục đích sử dụng thông tin',
    content: (
      <>
        <p className="mb-4">Thông tin được sử dụng để:</p>
        <ul className="space-y-2 sm:space-y-3">
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-bold mr-2 sm:mr-3 mt-0.5 flex-shrink-0">i</span>
            <span className="text-sm sm:text-base">Tạo và quản lý tài khoản</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-bold mr-2 sm:mr-3 mt-0.5 flex-shrink-0">ii</span>
            <span className="text-sm sm:text-base">Xử lý và lưu trữ tài liệu</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-bold mr-2 sm:mr-3 mt-0.5 flex-shrink-0">iii</span>
            <span className="text-sm sm:text-base">Nâng cao chất lượng dịch vụ</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-bold mr-2 sm:mr-3 mt-0.5 flex-shrink-0">iv</span>
            <span className="text-sm sm:text-base">Liên hệ hỗ trợ người dùng</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-bold mr-2 sm:mr-3 mt-0.5 flex-shrink-0">v</span>
            <span className="text-sm sm:text-base">Ngăn chặn hành vi gian lận hoặc truy cập trái phép</span>
          </li>
        </ul>
      </>
    ),
  },
  {
    title: '4. Bảo mật và lưu trữ thông tin',
    content:
      'Thông tin cá nhân và tài liệu được lưu trữ an toàn trên hệ thống máy chủ của chúng tôi. Chúng tôi áp dụng các biện pháp bảo mật như mã hóa, kiểm soát truy cập, và tường lửa nhằm ngăn chặn truy cập trái phép, mất mát hoặc rò rỉ dữ liệu.',
  },
  {
    title: '5. Chia sẻ thông tin',
    content:
      'Chúng tôi không chia sẻ thông tin cá nhân hoặc tài liệu của bạn với bên thứ ba, trừ khi có sự đồng ý rõ ràng của bạn, hoặc theo yêu cầu pháp lý từ cơ quan chức năng có thẩm quyền.',
  },
  {
    title: '6. Quyền của người dùng',
    content:
      'Bạn có quyền truy cập, chỉnh sửa hoặc yêu cầu xóa thông tin cá nhân bất kỳ lúc nào. Bạn cũng có thể yêu cầu xóa vĩnh viễn tài khoản và các tài liệu đã tải lên bằng cách liên hệ với chúng tôi.',
  },
  {
    title: '7. Thay đổi chính sách',
    content:
      'Chúng tôi có thể cập nhật chính sách bảo mật theo thời gian. Mọi thay đổi sẽ được thông báo rõ ràng trên trang web SPIT - Document. Việc tiếp tục sử dụng dịch vụ sau khi có thay đổi được xem là bạn đồng ý với chính sách mới.',
  },
  {
    title: '8. Liên hệ',
    content: (
      <>
        Nếu bạn có bất kỳ câu hỏi nào liên quan đến chính sách bảo mật, vui lòng liên hệ qua email:{" "}
        <a
          href="mailto:xuantruong2004.dev@gmail.com"
          className="text-green-700 underline hover:text-green-900"
        >
          xuantruong2004.dev@gmail.com.
        </a>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-6 sm:py-8 md:py-12 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100 overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12 text-white">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 tracking-tight">
                Chính sách bảo mật
              </h1>
              <p className="text-green-100 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn khi sử dụng dịch vụ
                của chúng tôi. Chính sách bảo mật này giải thích cách chúng tôi thu
                thập, sử dụng và bảo vệ thông tin cá nhân của bạn.
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12">
            <div className="space-y-6 sm:space-y-8">
              {privacyPolicySections.map((section, idx) => (
                <div 
                  key={idx} 
                  className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200 hover:shadow-md transition-shadow duration-300"
                >
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 text-gray-800 border-b border-green-200 pb-2">
                    {section.title}
                  </h2>
                  <div className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg">
                    {typeof section.content === 'string' ? (
                      <p>{section.content}</p>
                    ) : (
                      section.content
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
