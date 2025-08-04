'use client'

const termsData = [
  {
    title: '1. Sử dụng dịch vụ',
    content: (
      <>
        <p className="mb-4">
          Bạn cam kết sử dụng dịch vụ SPIT - Document với những điều kiện sau:
        </p>
        <ul className="space-y-2 sm:space-y-3">
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-bold mr-2 sm:mr-3 mt-0.5 flex-shrink-0">
              i
            </span>
            <span className="text-sm sm:text-base">Sử dụng đúng mục đích và không vi phạm pháp luật</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-bold mr-2 sm:mr-3 mt-0.5 flex-shrink-0">
              ii
            </span>
            <span className="text-sm sm:text-base">Không gây ảnh hưởng đến quyền lợi của người khác</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-bold mr-2 sm:mr-3 mt-0.5 flex-shrink-0">
              iii
            </span>
            <span className="text-sm sm:text-base">Tuân thủ các quy định về bản quyền và sở hữu trí tuệ</span>
          </li>
        </ul>
      </>
    ),
  },
  {
    title: '2. Quyền và trách nhiệm',
    content: (
      <>
        <p className="mb-4">Quyền và trách nhiệm của các bên:</p>
        <div className="space-y-3 sm:space-y-4">
          <div>
            <h4 className="font-semibold text-blue-700 mb-2 text-sm sm:text-base">
              Quyền của SPIT - Document:
            </h4>
            <ul className="space-y-2 ml-2 sm:ml-4">
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-bold mr-2 sm:mr-3 mt-0.5 flex-shrink-0">
                  i
                </span>
                <span className="text-sm sm:text-base">
                  Thay đổi, tạm ngưng hoặc chấm dứt dịch vụ bất cứ lúc nào
                </span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-bold mr-2 sm:mr-3 mt-0.5 flex-shrink-0">
                  ii
                </span>
                <span className="text-sm sm:text-base">Kiểm duyệt và xóa nội dung vi phạm</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-700 mb-2 text-sm sm:text-base">
              Trách nhiệm của người dùng:
            </h4>
            <ul className="space-y-2 ml-2 sm:ml-4">
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-bold mr-2 sm:mr-3 mt-0.5 flex-shrink-0">
                  i
                </span>
                <span className="text-sm sm:text-base">Bảo mật thông tin tài khoản của mình</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-bold mr-2 sm:mr-3 mt-0.5 flex-shrink-0">
                  ii
                </span>
                <span className="text-sm sm:text-base">Chịu trách nhiệm cho nội dung được tải lên</span>
              </li>
            </ul>
          </div>
        </div>
      </>
    ),
  },
  {
    title: '3. Bảo mật thông tin',
    content: (
      <>
        Thông tin cá nhân của bạn sẽ được bảo mật theo{' '}
        <a
          href="/privacy-policy"
          className="text-blue-700 hover:text-blue-900 underline font-semibold transition-colors duration-200"
        >
          Chính sách bảo mật
        </a>{' '}
        của chúng tôi.
      </>
    ),
  },
  {
    title: '4. Giới hạn trách nhiệm',
    content: (
      <>
        <p className="mb-4">
          SPIT - Document không chịu trách nhiệm trong các trường hợp sau:
        </p>
        <ul className="space-y-2 sm:space-y-3">
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-bold mr-2 sm:mr-3 mt-0.5 flex-shrink-0">
              i
            </span>
            <span className="text-sm sm:text-base">Thiệt hại do sử dụng sai mục đích dịch vụ</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-bold mr-2 sm:mr-3 mt-0.5 flex-shrink-0">
              ii
            </span>
            <span className="text-sm sm:text-base">Mất mát dữ liệu do lỗi người dùng</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-bold mr-2 sm:mr-3 mt-0.5 flex-shrink-0">
              iii
            </span>
            <span className="text-sm sm:text-base">Gián đoạn dịch vụ do bảo trì hoặc force majeure</span>
          </li>
        </ul>
      </>
    ),
  },
  {
    title: '5. Liên hệ và hỗ trợ',
    content: (
      <>
        Nếu bạn có bất kỳ câu hỏi nào về Điều khoản dịch vụ, vui lòng liên hệ
        với chúng tôi qua email:{' '}
        <a
          href="mailto:xuantruong2004.dev@gmail.com"
          className="text-green-700 underline hover:text-green-900"
        >
          xuantruong2004.dev@gmail.com.
        </a>
      </>
    ),
  },
]

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-6 sm:py-8 md:py-12 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100 overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12 text-white">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 tracking-tight">
                Điều Khoản Dịch Vụ
              </h1>
              <p className="text-blue-100 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                Chào mừng bạn đến với SPIT - Document. Khi sử dụng dịch vụ của
                chúng tôi, bạn đồng ý tuân thủ các điều khoản và điều kiện được
                quy định dưới đây.
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12">
            <div className="space-y-6 sm:space-y-8">
              {termsData.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200 hover:shadow-md transition-shadow duration-300"
                >
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 text-gray-800 border-b border-blue-200 pb-2">
                    {item.title}
                  </h2>
                  <div className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg">
                    {typeof item.content === 'string' ? (
                      <p>{item.content}</p>
                    ) : (
                      item.content
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
