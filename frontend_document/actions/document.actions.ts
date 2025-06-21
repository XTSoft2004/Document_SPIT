'use server'
import globalConfig from '@/app.config'
import { IDocumentRequest, IDocumentResponse } from '@/types/document'
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
      Authorization: `Bearer ${cookies().get('token')?.value || ''}`,
    },
    body: JSON.stringify(formData),
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

export const updateDocument = async (
  formData: IDocumentRequest,
): Promise<IBaseResponse> => {
  const response = await fetch(`${globalConfig.baseUrl}/document/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies().get('token')?.value || ''}`,
    },
    body: JSON.stringify(formData),
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

export const deleteDocument = async (id: string): Promise<IBaseResponse> => {
  const response = await fetch(`${globalConfig.baseUrl}/document/delete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies().get('token')?.value || ''}`,
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

export const getDocuments = async () => {
  const response = await fetch(`${globalConfig.baseUrl}/document`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    next: {
      tags: ['document.index'],
    },
  })

  const data = await response.json()

  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IIndexResponse<IDocumentResponse>
}
