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
  IDriveResponse,
  IInfoGoogleDriveResponse,
  ILoadFolder,
  IUploadFile,
} from '@/types/driver'

export const getInfoGoogleDriver = async () => {
  const response = await fetch(`${globalConfig.baseUrl}/driver/info`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        headers().get('Authorization') ||
        `Bearer ${cookies().get('accessToken')?.value || ' '}`,
    },
    next: {
      tags: ['driver.info'],
    },
  })

  const data = await response.json()

  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IInfoGoogleDriveResponse
}

export const loadFolder = async (
  folderId: string,
  isOnlyFolder: boolean = true,
) => {
  const response = await fetch(
    `${globalConfig.baseUrl}/driver/find/${folderId}?isOnlyFolder=${isOnlyFolder}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          headers().get('Authorization') ||
          `Bearer ${cookies().get('accessToken')?.value || ' '}`,
      },
      next: {
        tags: ['driver.folder'],
      },
    },
  )

  const data = await response.json()
  //   revalidateTag('driver.folder')

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

export const createFolder = async (name: string, parentId: string) => {
  const response = await fetch(
    `${globalConfig.baseUrl}/driver/create-folder?folderName=${name}&parentId=${parentId}`,
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

  revalidateTag('driver.folder')

  return {
    ...data,
    ok: response.ok,
    status: response.status,
  } as IBaseResponse
}

export const getTree = async () => {
  const folderId = process.env.NEXT_PUBLIC_FOLDER_ID_HOME || '0'
  const response = await fetch(
    `${globalConfig.baseUrl}/driver/tree/${folderId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        tags: ['driver.tree'],
        revalidate: 60,
      },
    },
  )

  const data = await response.json()

  return {
    ok: response.ok,
    status: response.status,
    data: data,
  } as IIndexResponse<IDriveResponse>
}
