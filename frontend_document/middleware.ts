import { NextRequest, NextResponse } from 'next/server'
import { ITokenInfoResponse } from './types/user'
import globalConfig from './app.config'

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

const getProfile = async (accessToken: string): Promise<ITokenInfoResponse> => {
  const response = await fetch(`${globalConfig.baseUrl}/user/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw response
  }

  const data = await response.json()
  // console.log('server >> getProfile', data)
  return data as ITokenInfoResponse
}

const refreshTokenNew = async (
  refreshToken: string,
): Promise<ITokenInfoResponse> => {
  const response = await fetch(`${globalConfig.baseUrl}/auth/refresh-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${refreshToken}`,
    },
  })

  if (!response.ok) {
    throw response
  }

  const data = await response.json()
  // console.log('server >> refreshTokenNew', data)
  return data as ITokenInfoResponse
}

const clearAuthCookies = (response: NextResponse) => {
  response.cookies.delete('accessToken')
  response.cookies.delete('refreshToken')
  return response
}

const redirectLogin = (request: NextRequest) => {
  const isLoginPage = request.nextUrl.pathname === '/auth'
  if (!isLoginPage) {
    const response = NextResponse.redirect(new URL('/auth', request.url))
    return clearAuthCookies(response)
  }

  const response = NextResponse.next()
  return clearAuthCookies(response)
}

const redirectLocked = (request: NextRequest) => {
  const isLockedPage = request.nextUrl.pathname === '/locked'

  if (!isLockedPage) {
    return NextResponse.redirect(new URL('/locked', request.url))
  }

  return NextResponse.next()
}

const handleError = (error: unknown, request: NextRequest) => {
  if (!(error instanceof Response)) {
    console.error('Unexpected error in middleware:', error)
    return NextResponse.redirect(new URL('/500', request.url))
  }

  const response = error as Response

  switch (response.status) {
    case 500:
      return NextResponse.redirect(new URL('/500', request.url))
    case 423:
      return redirectLocked(request)
    default:
      return redirectLogin(request)
  }
}

const handleRefreshToken = async (
  refreshToken: string,
  globalResponse: NextResponse,
): Promise<void> => {
  const newToken = await refreshTokenNew(refreshToken)

  globalResponse.cookies.set('accessToken', newToken.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  })
  globalResponse.cookies.set('refreshToken', newToken.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  })

  globalResponse.headers.set('Authorization', `Bearer ${newToken.accessToken}`)
}

export async function middleware(request: NextRequest) {
  console.log('server >> middleware', request.nextUrl.pathname)

  // Chỉ check authentication cho admin routes
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')

  if (!isAdminRoute) {
    // Nếu không phải admin route, cho phép truy cập
    return NextResponse.next()
  }

  // Từ đây chỉ xử lý admin routes
  const accessToken = request.cookies.get('accessToken')?.value ?? ''

  // Nếu không có access token, chuyển hướng đến trang đăng nhập
  if (!accessToken) {
    return redirectLogin(request)
  }

  try {
    const profile = await getProfile(accessToken)

    // Kiểm tra tài khoản có bị khóa hay không
    if (profile.isLocked) {
      return redirectLocked(request)
    }

    // Nếu có profile Admin và đang ở trang login, chuyển hướng đến dashboard
    if (profile.roleName === 'Admin' && request.nextUrl.pathname === '/auth') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    // Xử lý lỗi 401 - token hết hạn
    if (error instanceof Response && error.status === 401) {
      const refreshToken = request.cookies.get('refreshToken')?.value?.trim()

      if (!refreshToken) {
        return redirectLogin(request)
      }

      try {
        const globalResponse = NextResponse.next()
        await handleRefreshToken(refreshToken, globalResponse)
        return globalResponse
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError)
        return handleError(refreshError, request)
      }
    }

    // Xử lý các lỗi khác
    return handleError(error, request)
  }
}
