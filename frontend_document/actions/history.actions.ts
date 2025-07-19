'use server'

import globalConfig from '@/app.config'
import { IIndexResponse } from '@/types/global'
import { IHistory } from '@/types/history'
import { cookies, headers } from 'next/headers'

export const getHistory = async (
  search = '',
  pageNumber = -1,
  pageSize = -1,
  isLogin = false,
  isActivity = false,
) => {
  const response = await fetch(
    `${globalConfig.baseUrl}/history?search=${search}&pageNumber=${pageNumber}&pageSize=${pageSize}&isLogin=${isLogin}&isActivity=${isActivity}`,
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
  } as IIndexResponse<IHistory>
}
