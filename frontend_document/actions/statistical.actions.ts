'use server'
import globalConfig from '@/app.config'
import { IIndexResponse, IShowResponse } from '@/types/global'
import { IParameterDocument, IRanking } from '@/types/statistical'

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
