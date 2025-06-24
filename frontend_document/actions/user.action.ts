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
import { IUserCreateRequest, IUserResponse, IUserUpdate } from '@/types/user'

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
        `Bearer ${cookies().get('accessToken')?.value || ' '}`,
    },
    body: JSON.stringify(user),
    next: {
      tags: ['user.update'],
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

export const setRoleUser = async (id: string, roleName: string) => {
  if (!id || !roleName) {
    return {
      ok: false,
      status: 400,
      message: 'User ID and role name are required',
    } as IResponse
  }
  const response = await fetch(
    `${globalConfig.baseUrl}/user/set-role?userId=${id}&roleName=${roleName}`,
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
