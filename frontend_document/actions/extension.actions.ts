'use server'
import globalConfig from '@/app.config'
import { cookies, headers } from 'next/headers'

import {
  IBaseResponse,
  IIndexResponse,
  IResponse,
  IShowResponse,
} from '@/types/global'

export const loadFolder = async (folderId: string) => {
  const response = await fetch(
    `${globalConfig.baseUrl}/load-folder/${folderId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )

  const data = await response.json();

    return {
        ok: response.ok,
        status: response.status,
        ...data,
    } as IBaseResponse
}
