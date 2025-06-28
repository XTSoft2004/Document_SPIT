'use server'
import globalConfig from '@/app.config'
import { IIndexResponse } from '@/types/global'
import { IRanking } from '@/types/statistical'

export const getRanking = async () => {
  const response = await fetch(`${globalConfig.baseUrl}/statistical/ranking`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const data = await response.json()
  console.log(data);
  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IIndexResponse<IRanking>
}
