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
import { IDepartmentRequest, IDepartmentResponse } from '@/types/department'

export const createDepartment = async (
  department: IDepartmentRequest,
): Promise<IBaseResponse> => {
  const response = await fetch(`${globalConfig.baseUrl}/department`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies().get('accessToken')?.value || ''}`,
    },
    body: JSON.stringify(department),
  })

  const data = await response.json()
  revalidateTag('department.index')

  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IBaseResponse
}

export const updateDepartment = async (
  departmentId: string,
  department: IDepartmentRequest,
): Promise<IBaseResponse> => {
  const response = await fetch(
    `${globalConfig.baseUrl}/department/${departmentId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies().get('accessToken')?.value || ''}`,
      },
      body: JSON.stringify(department),
    },
  )

  const data = await response.json()
  revalidateTag('department.index')

  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IBaseResponse
}

export const deleteDepartment = async (
  departmentId: string,
): Promise<IBaseResponse> => {
  const response = await fetch(
    `${globalConfig.baseUrl}/department/${departmentId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${cookies().get('accessToken')?.value || ''}`,
      },
    },
  )

  const data = await response.json()
  revalidateTag('department.index')

  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IBaseResponse
}

export const getDepartment = async (
  search: string = '',
  pageNumber: number = -1,
  pageSize: number = -1,
) => {
  const response = await fetch(
    `${globalConfig.baseUrl}/department?search=${search}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          headers().get('Authorization') ||
          `Bearer ${cookies().get('accessToken')?.value || ''}`,
      },
    },
  )

  const data = await response.json()
  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IIndexResponse<IDepartmentResponse>
}
