'use server'

import globalConfig from '@/app.config'
import { IIndexResponse } from '@/types/global'
import { IHistory } from '@/types/history'
import { cookies, headers } from 'next/headers'

export const getHistory = async (sizePage: number = 10) => {
  const response = await fetch(`${globalConfig.baseUrl}/history/${sizePage}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        headers().get('Authorization') ||
        `Bearer ${cookies().get('accessToken')?.value || ''}`,
    },
  })

  const data = await response.json()

  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IIndexResponse<IHistory>
}
