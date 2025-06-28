import { NextRequest, NextResponse } from 'next/server'
import { IShowResponse } from './types/global'
import { IUserResponse } from './types/user'
import globalConfig from './app.config'
import { cookies, headers } from 'next/headers'

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - images (public images folder and subdirectories)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images).*)',
  ],
}

const getMe = async () => {
  const response = await fetch(`${globalConfig.baseUrl}/user/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        headers().get('Authorization') ||
        `Bearer ${cookies().get('accessToken')?.value || ' '}`,
    },
    next: {
      tags: ['user.me'],
    },
  })

  const data = await response.json()

  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IShowResponse<IUserResponse>
}

export async function middleware(request: NextRequest) {
  console.log('server >> middleware', request.nextUrl.pathname)

  // Kiểm tra xem người dùng đã đăng nhập hay chưa
  if (request.nextUrl.pathname.startsWith('/auth')) {
    // Nếu đã đăng nhập, chuyển hướng đến trang chủ
    const accessToken = cookies().get('accessToken')?.value
    if (accessToken) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const accessToken = cookies().get('accessToken')?.value
    if (!accessToken) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }

    // Lấy thông tin người dùng từ API
    const userResponse = await getMe()

    if (!userResponse.ok) {
      // Nếu không lấy được thông tin người dùng, chuyển hướng đến trang đăng nhập
      return NextResponse.redirect(new URL('/auth', request.url))
    }

    if (userResponse.data.roleName !== 'admin') {
      // Nếu người dùng không phải là admin, chuyển hướng đến trang chủ
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Logic middleware cơ bản
  const response = NextResponse.next()

  return response
}
