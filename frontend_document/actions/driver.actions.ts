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
import { ILoadFolder, IUploadFile } from '@/types/driver'

export const getThumbnail = async (fileId: string) => {
  const response = await fetch(
    `${globalConfig.baseUrl}/driver/thumbnail/${fileId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )

  const data = await response.json()
  revalidateTag('driver.thumbnail')
  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IBaseResponse
}

export const loadFolder = async (folderId: string) => {
  const response = await fetch(
    `${globalConfig.baseUrl}/driver/find/${folderId}`,
    {
      method: 'GET',
    },
  )

  const data = await response.json()
  revalidateTag('driver.folder')

  const res = (data as ILoadFolder[]).sort((a, b) => {
    if (a.isFolder === b.isFolder) return 0
    return a.isFolder ? -1 : 1
  })

  return {
    ok: response.ok,
    status: response.status,
    data: res,
  } as IIndexResponse<ILoadFolder>
}

export const uploadFile = async (formData: IUploadFile) => {
  const response = await fetch(`${globalConfig.baseUrl}/driver/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })

  const data = await response.json()
  revalidateTag('driver.upload')
  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IResponse
}
