'use server'
import globalConfig from '@/app.config'
import {
  IDocumentRequest,
  IDocumentResponse,
  IDocumentUpdateRequest,
} from '@/types/document'
import { cookies, headers } from 'next/headers'

import {
  IBaseResponse,
  IIndexResponse,
  IResponse,
  IShowResponse,
} from '@/types/global'

import { revalidateTag } from 'next/cache'

export const createDocument = async (
  formData: IDocumentRequest,
): Promise<IBaseResponse> => {
  const response = await fetch(`${globalConfig.baseUrl}/document/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies().get('accessToken')?.value || ''}`,
    },
    body: JSON.stringify(formData),
  })

  const data = await response.json()
  revalidateTag('document.index')

  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IBaseResponse
}

export const updateDocument = async (
  documentId: string,
  formData: IDocumentUpdateRequest,
): Promise<IBaseResponse> => {
  const response = await fetch(
    `${globalConfig.baseUrl}/document/${documentId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies().get('accessToken')?.value || ''}`,
      },
      body: JSON.stringify(formData),
    },
  )

  const data = await response.json()

  revalidateTag('document.index')

  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IBaseResponse
}

export const deleteDocument = async (id: string): Promise<IBaseResponse> => {
  const response = await fetch(`${globalConfig.baseUrl}/document/delete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies().get('accessToken')?.value || ''}`,
    },
    body: JSON.stringify({ id }),
  })

  const data = await response.json()

  revalidateTag('document.index')
  revalidateTag('document.show')

  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IBaseResponse
}

export const getDocuments = async (
  search: string = '',
  pageNumber: number = -1,
  pageSize: number = -1,
) => {
  const response = await fetch(
    `${globalConfig.baseUrl}/document?search=${search}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          headers().get('Authorization') ||
          `Bearer ${cookies().get('accessToken')?.value || ' '}`,
      },
      next: {
        tags: ['document.index'],
      },
    },
  )

  const data = await response.json()

  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IIndexResponse<IDocumentResponse>
}
