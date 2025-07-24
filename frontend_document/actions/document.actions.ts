'use server'
import globalConfig from '@/app.config'
import {
  IDocumentPendingRequest,
  IDocumentRecentResponse,
  IDocumentRequest,
  IDocumentResponse,
  IDocumentReviewRequest,
  IDocumentUpdateRequest,
  IDocumentUser,
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
  formData: IDocumentPendingRequest,
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
  revalidateTag('driver.tree')

  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IBaseResponse
}

export const reviewDocument = async (
  documentId: string,
  formData: IDocumentReviewRequest,
): Promise<IBaseResponse> => {
  const response = await fetch(
    `${globalConfig.baseUrl}/document/review/${documentId}`,
    {
      method: 'POST',
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
  revalidateTag('driver.tree')

  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IBaseResponse
}

export const deleteDocument = async (id: string): Promise<IBaseResponse> => {
  const response = await fetch(`${globalConfig.baseUrl}/document/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies().get('accessToken')?.value || ''}`,
    },
    body: JSON.stringify({ id }),
  })

  const data = await response.json()

  revalidateTag('document.index')
  revalidateTag('document.show')
  revalidateTag('driver.tree')

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
  statusDocument: string = '',
) => {
  const response = await fetch(
    `${globalConfig.baseUrl}/document?search=${search}&pageNumber=${pageNumber}&pageSize=${pageSize}&statusDocument=${statusDocument}`,
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

export const getCodeView = async (documentId: number) => {
  const response = await fetch(
    `${globalConfig.baseUrl}/document/${documentId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          headers().get('Authorization') ||
          `Bearer ${cookies().get('accessToken')?.value || ' '}`,
      },
      next: {
        tags: ['document.getCodeView'],
      },
    },
  )

  const data = await response.json()
  console.log(`${globalConfig.baseUrl}/document/${documentId}`)
  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IShowResponse<{ code: string }>
}

export const getRecentDocuments = async (number: number) => {
  const response = await fetch(
    `${globalConfig.baseUrl}/document/recent/${number}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          headers().get('Authorization') ||
          `Bearer ${cookies().get('accessToken')?.value || ' '}`,
      },
      next: {
        tags: ['document.recent'],
      },
    },
  )

  const data = await response.json()

  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IIndexResponse<IDocumentRecentResponse>
}

export const getCodeDocument = async (documentId: number) => {
  const response = await fetch(
    `${globalConfig.baseUrl}/document/${documentId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          headers().get('Authorization') ||
          `Bearer ${cookies().get('accessToken')?.value || ' '}`,
      },
    },
  )

  const data = await response.json()
  revalidateTag('document.index')

  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IShowResponse<{ code: string }>
}

export const getDocumentUser = async (username: string) => {
  const response = await fetch(
    `${globalConfig.baseUrl}/document/user/${username}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        tags: ['document.user'],
      },
    },
  )

  const data = await response.json()

  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IIndexResponse<IDocumentUser>
}