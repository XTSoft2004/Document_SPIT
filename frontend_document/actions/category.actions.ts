'use server'

import globalConfig from '@/app.config'
import { ICategoryRequest, ICategoryResponse } from '@/types/category'
import { IBaseResponse, IIndexResponse } from '@/types/global'
import { cookies, headers } from 'next/headers'

export async function getCategory(
  search: string = '',
  pageNumber: number = -1,
  pageSize: number = -1,
): Promise<IIndexResponse<ICategoryResponse>> {
  const response = await fetch(
    `${globalConfig.baseUrl}/category-type?search=${search}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
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
  } as IIndexResponse<ICategoryResponse>
}

export async function createCategory(
  categoryData: ICategoryRequest,
): Promise<IBaseResponse> {
  const response = await fetch(`${globalConfig.baseUrl}/category-type`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        headers().get('Authorization') ||
        `Bearer ${cookies().get('accessToken')?.value || ''}`,
    },
    body: JSON.stringify(categoryData),
  })

  const data = await response.json()

  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IBaseResponse
}

export async function updateCategory(
  idCategory: number,
  categoryData: ICategoryRequest,
): Promise<IBaseResponse> {
  const response = await fetch(
    `${globalConfig.baseUrl}/category-type/${idCategory}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          headers().get('Authorization') ||
          `Bearer ${cookies().get('accessToken')?.value || ''}`,
      },
      body: JSON.stringify(categoryData),
    },
  )

  const data = await response.json()

  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IBaseResponse
}

export async function deleteCategory(id: number): Promise<IBaseResponse> {
  const response = await fetch(`${globalConfig.baseUrl}/category-type/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        headers().get('Authorization') ||
        `Bearer ${cookies().get('accessToken')?.value || ''}`,
    },
  })

  const data = await response.json()

  return {
    ok: true,
    status: response.status,
    ...data,
  } as IBaseResponse
}
