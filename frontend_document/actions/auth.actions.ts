'use server'
import globalConfig from '@/app.config'
import { ILoginRequest, ILoginResponse, IRegisterRequest } from '@/types/auth'
import { cookies, headers } from 'next/headers'

import {
  IBaseResponse,
  IIndexResponse,
  IResponse,
  IShowResponse,
} from '@/types/global'
import { revalidateTag } from 'next/cache'

export const registerAccount = async (formData: IRegisterRequest) => {
  const response = await fetch(`${globalConfig.baseUrl}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
    next: {
      tags: ['auth.register'],
    },
  })

  const data = await response.json()

  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IBaseResponse
}

export const loginAccount = async (formData: ILoginRequest) => {
  const response = await fetch(`${globalConfig.baseUrl}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
    next: {
      tags: ['auth.login'],
    },
  })

  const data = await response.json()

  if (response.ok) {
    const result = data.data as ILoginResponse
    if (result != null) {
      cookies().set('accessToken', result.accessToken)
      cookies().set('refreshToken', result.refreshToken)
    }
  }

  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IShowResponse<ILoginResponse>
}

export const logoutAccount = async () => {
  const response = await fetch(`${globalConfig.baseUrl}/auth/logout`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${cookies().get('accessToken')?.value || ' '}`,
    },
    next: {
      tags: ['auth.logout'],
    },
  })

  const data = await response.json()

  if (response.ok) {
    cookies().delete('accessToken')
    cookies().delete('refreshToken')
  }

  return {
    ok: response.ok,
    ...data,
  } as IResponse
}

export const checkAuthSecurity = async (password: string) => {
  const response = await fetch(
    `${globalConfig.baseUrl}/auth/password-security`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          headers().get('Authorization') ||
          `Bearer ${cookies().get('accessToken')?.value || ''}`,
      },
      body: JSON.stringify({ passwordSecurity: password }),
      next: {
        tags: ['auth.passwordSecurity'],
      },
    },
  )

  const data = await response.json()

  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IBaseResponse
}
