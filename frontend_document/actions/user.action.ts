'use server'
import globalConfig from '@/app.config'
import { cookies, headers } from 'next/headers'

import {
  IBaseResponse,
  IIndexResponse,
  IResponse,
  IShowResponse,
} from '@/types/global'
import { revalidateTag } from 'next/cache'
import {
  IProfile,
  IUserCreateRequest,
  IUserResponse,
  IUserUpdate,
  IUserUploadAvatar,
} from '@/types/user'
import { IInfoUserResponse } from '@/types/auth'

export const getUsers = async (
  search: string = '',
  pageNumber: number = -1,
  pageSize: number = -1,
) => {
  const response = await fetch(
    `${globalConfig.baseUrl}/user?search=${search}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          headers().get('Authorization') ||
          `Bearer ${cookies().get('accessToken')?.value || ' '}`,
      },
      next: {
        tags: ['user.index'],
      },
    },
  )

  const data = await response.json()

  return {
    ...(data as IIndexResponse<IUserResponse>),
    ok: response.ok,
    status: response.status,
  }
}

export const updateUser = async (id: string, user: IUserUpdate) => {
  const response = await fetch(`${globalConfig.baseUrl}/user/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        headers().get('Authorization') ||
        `Bearer ${cookies().get('accessToken')?.value || ''}`,
    },
    body: JSON.stringify(user),
    next: {
      tags: ['user.update'],
    },
  })

  const data = (await response.json()) as IBaseResponse
  revalidateTag('user.index')
  revalidateTag('user.me')
  revalidateTag('user.profile')

  return {
    ...data,
    ok: response.ok,
    status: response.status,
  } as IResponse
}

export const setRoleUser = async (username: string, roleName: string) => {
  const response = await fetch(
    `${globalConfig.baseUrl}/user/set-role?username=${username}&roleName=${roleName}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          headers().get('Authorization') ||
          `Bearer ${cookies().get('accessToken')?.value || ' '}`,
      },
      body: JSON.stringify({ roleName }),
      next: {
        tags: ['user.role'],
      },
    },
  )

  const data = (await response.json()) as IBaseResponse
  revalidateTag('user.index')

  return {
    ...data,
    ok: response.ok,
    status: response.status,
  } as IResponse
}

export const banAccountId = async (id: string) => {
  const response = await fetch(
    `${globalConfig.baseUrl}/user/ban-account/${id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          headers().get('Authorization') ||
          `Bearer ${cookies().get('accessToken')?.value || ' '}`,
      },
      next: {
        tags: ['user.banAccount'],
      },
    },
  )

  const data = (await response.json()) as IBaseResponse
  revalidateTag('user.index')

  return {
    ...data,
    ok: response.ok,
    status: response.status,
  } as IResponse
}

export const createUser = async (user: IUserCreateRequest) => {
  const response = await fetch(`${globalConfig.baseUrl}/user/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        headers().get('Authorization') ||
        `Bearer ${cookies().get('accessToken')?.value || ' '}`,
    },
    body: JSON.stringify(user),
    next: {
      tags: ['user.create'],
    },
  })

  const data = (await response.json()) as IBaseResponse

  revalidateTag('user.index')

  return {
    ...data,
    ok: response.ok,
    status: response.status,
  } as IResponse
}

export const getMe = async () => {
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

export const getStars = async () => {
  const response = await fetch(`${globalConfig.baseUrl}/user/stars`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        headers().get('Authorization') ||
        `Bearer ${cookies().get('accessToken')?.value || ' '}`,
    },
    next: {
      tags: ['user.stars'],
    },
  })

  const data = await response.json()
  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IIndexResponse<number>
}

export const changeStatusStar = async (documentId: number) => {
  const response = await fetch(
    `${globalConfig.baseUrl}/user/change-status-star/${documentId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          headers().get('Authorization') ||
          `Bearer ${cookies().get('accessToken')?.value || ' '}`,
      },
    },
  )

  const data = await response.json()

  revalidateTag('user.stars')

  return {
    ok: response.ok,
    status: response.status,
    ...data,
  }
}

export const getProfileUser = async (username: string) => {
  const response = await fetch(
    `${globalConfig.baseUrl}/user/profile/${username}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          headers().get('Authorization') ||
          `Bearer ${cookies().get('accessToken')?.value || ' '}`,
      },
      next: {
        tags: [`user.profile.${username}`],
      },
    },
  )

  const data = await response.json()

  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IShowResponse<IInfoUserResponse>
}

export const uploadAvatar = async (
  username: string,
  userUpload: IUserUploadAvatar,
) => {
  const response = await fetch(`${globalConfig.baseUrl}/user/upload-avatar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        headers().get('Authorization') ||
        `Bearer ${cookies().get('accessToken')?.value || ' '}`,
    },
    body: JSON.stringify(userUpload),
    next: {
      tags: ['user.uploadAvatar'],
    },
  })

  const data = await response.json()
  revalidateTag(`user.profile.${username}`)
  revalidateTag(`auth.refreshToken`)

  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IBaseResponse
}
