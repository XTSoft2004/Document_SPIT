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
import { IInfoGoogleDriveResponse, ILoadFolder } from '@/types/driver'

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
