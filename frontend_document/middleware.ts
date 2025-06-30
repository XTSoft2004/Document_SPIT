import { NextRequest, NextResponse } from 'next/server'
import { ITokenInfoResponse } from './types/user'
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

const redirectTo = (url: string, request: NextRequest) => {
  return NextResponse.redirect(new URL(url, request.url))
}

export async function middleware(request: NextRequest) {
  console.log('server >> middleware', request.nextUrl.pathname)

  const userResponse = await getMe()
  const isLocked = userResponse.data?.islocked
  const nextUrl = request.nextUrl.pathname

  // Kiểm tra xem người dùng đã đăng nhập hay chưa
  if (nextUrl.startsWith('/auth')) {
    // Nếu đã đăng nhập, chuyển hướng đến trang chủ
    const accessToken = cookies().get('accessToken')?.value

    if (accessToken) {
      // Kiểm tra xem người dùng có bị khóa hay không
      if (isLocked === true) return redirectTo('/ban', request)
      else return redirectTo('/', request)
    } else return NextResponse.next()
  }

  if (nextUrl.startsWith('/ban')) {
    if (isLocked !== true) return redirectTo('/', request)
  }

  if (nextUrl.startsWith('/admin')) {
    const accessToken = cookies().get('accessToken')?.value
    if (!accessToken) return redirectTo('/auth', request)

    // Kiểm tra xem người dùng có tồn tại hay không
    if (!userResponse.ok) return redirectTo('/auth', request)

    // Kiểm tra xem người dùng có phải là Admin hay không
    if (userResponse.data.roleName !== 'Admin') return redirectTo('/', request)
  }

  return NextResponse.next()
}
