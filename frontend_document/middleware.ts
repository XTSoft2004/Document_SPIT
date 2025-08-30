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

const refreshToken = async () => {
  const response = await fetch(`${globalConfig.baseUrl}/auth/refresh-token`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        headers().get('Authorization') ||
        `Bearer ${cookies().get('refreshToken')?.value || ' '}`,
    },
  })

  const data = await response.json()
  return {
    ok: response.ok,
    message: data.message,
    ...data,
  } as IShowResponse<ITokenInfoResponse>
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

  const nextUrl = request.nextUrl.pathname
  const accessToken = cookies().get('accessToken')?.value
  let res = NextResponse.next()

  // Nếu không có token thì chỉ cho vào /auth
  if (!accessToken) {
    if (nextUrl.startsWith('/admin') || nextUrl.startsWith('/ban')) {
      return redirectTo('/auth', request)
    }
    return res
  }

  let userResponse = await getMe()
  const isExpired = userResponse.status === 401 || userResponse.status === 403
  if (isExpired) {
    const refreshResponse = await refreshToken()
    if (!refreshResponse.ok) return redirectTo('/', request)

    res = NextResponse.redirect(request.url)
    res.cookies.set('accessToken', refreshResponse.data.accessToken)
    res.cookies.set('refreshToken', refreshResponse.data.refreshToken)

    return res
  }

  const isLocked = userResponse.data?.islocked

  if (nextUrl.startsWith('/auth')) {
    if (isLocked) return redirectTo('/ban', request)
    return redirectTo('/', request)
  }

  if (nextUrl === '/profile') {
    if (!userResponse.ok) return redirectTo('/', request)
    if (isLocked) return redirectTo('/ban', request)
    return redirectTo(`/profile/${userResponse.data.username}`, request)
  }

  if (nextUrl.startsWith('/ban')) {
    if (!isLocked) return redirectTo('/', request)
  }

  if (nextUrl.startsWith('/admin')) {
    if (!userResponse.ok || userResponse.data.roleName !== 'Admin') {
      return redirectTo('/', request)
    }
  }

  return res
}
