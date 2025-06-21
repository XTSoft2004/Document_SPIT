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
import { ILoadFolder, IUploadFile, IFolder } from '@/types/driver'

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

  // Sort theo folder, = folder thì sort theo tên
  const res = (data as ILoadFolder[]).sort((a, b) => {
    if (a.isFolder && b.isFolder)
      if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) return -1
      else return 1

    if (a.isFolder && !b.isFolder) return -1
    if (!a.isFolder && b.isFolder) return 1

    if (!a.isFolder && !b.isFolder)
      if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) return -1
      else return 1
    return 0
  })

  return {
    ok: response.ok,
    status: response.status,
    data: res,
  } as IIndexResponse<ILoadFolder>
}

export const loadOnlyFolder = async (folderId: string) => {
  const response = await fetch(
    `${globalConfig.baseUrl}/driver/findFolder/${folderId}`,
    {
      method: 'GET',
    },
  )

  const data = await response.json()
  revalidateTag('driver.folder')

  // Sort theo folder, = folder thì sort theo tên
  const res = (data as ILoadFolder[]).sort((a, b) => {
    if (a.isFolder && b.isFolder)
      if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) return -1
      else return 1

    if (a.isFolder && !b.isFolder) return -1
    if (!a.isFolder && b.isFolder) return 1

    if (!a.isFolder && !b.isFolder)
      if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) return -1
      else return 1
    return 0
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

export const findFolderByName = async (name: string, parentId: string) => {
  const response = await fetch(
    `${globalConfig.baseUrl}/driver/find/${parentId}`,
    {
      method: 'GET',
    },
  )

  const data = await response.json()
  revalidateTag('driver.folder')

  const folder = (data as ILoadFolder[]).find(
    (item) => item.name.toLocaleLowerCase() === name.toLocaleLowerCase(),
  )

  const res = {
    name: folder?.name || '',
    folderId: folder?.id || '',
  } as IFolder

  return {
    ok: response.ok,
    status: response.status,
    data: res,
  } as IShowResponse<IFolder>
}
