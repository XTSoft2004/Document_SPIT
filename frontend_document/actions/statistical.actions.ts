'use server'
import globalConfig from '@/app.config'
import { IIndexResponse, IShowResponse } from '@/types/global'
import {
  ILineChartDate,
  IParameterDocument,
  IRanking,
  IStatisticalAdmin,
  IStatisticalUser,
} from '@/types/statistical'
import { cookies, headers } from 'next/headers'

export const getRanking = async () => {
  const response = await fetch(`${globalConfig.baseUrl}/statistical/ranking`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const data = await response.json()

  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IIndexResponse<IRanking>
}

export const getParameterDocument = async () => {
  const response = await fetch(
    `${globalConfig.baseUrl}/statistical/parameter-document`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )

  const data = await response.json()
  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IShowResponse<IParameterDocument>
}

export const getLineChartDate = async () => {
  const response = await fetch(
    `${globalConfig.baseUrl}/statistical/line-chart-date?numberDay=15`,
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
  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IIndexResponse<ILineChartDate>
}

export const getStatisticalAdmin = async () => {
  const response = await fetch(
    `${globalConfig.baseUrl}/statistical/statistical-admin`,
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
  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IShowResponse<IStatisticalAdmin>
}

export const getStatisticalUser = async (username: string) => {
  const response = await fetch(
    `${globalConfig.baseUrl}/statistical/statistical-user/${username}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )

  const data = await response.json()
  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IShowResponse<IStatisticalUser>
}