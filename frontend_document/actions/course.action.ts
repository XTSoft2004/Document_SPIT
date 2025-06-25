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
import { ICourseRequest, ICourseResponse } from '@/types/course'

export const createCourse = async (
  Course: ICourseRequest,
): Promise<IBaseResponse> => {
  const response = await fetch(`${globalConfig.baseUrl}/course`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies().get('accessToken')?.value || ''}`,
    },
    body: JSON.stringify(Course),
  })

  const data = await response.json()
  revalidateTag('course.index')

  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IBaseResponse
}

export const updateCourse = async (
  courseId: number,
  Course: ICourseRequest,
): Promise<IBaseResponse> => {
  const response = await fetch(`${globalConfig.baseUrl}/course/${courseId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies().get('accessToken')?.value || ''}`,
    },
    body: JSON.stringify(Course),
  })

  const data = await response.json()
  revalidateTag('course.index')

  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IBaseResponse
}

export const deleteCourse = async (
  courseId: string,
): Promise<IBaseResponse> => {
  const response = await fetch(`${globalConfig.baseUrl}/course/${courseId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${cookies().get('accessToken')?.value || ''}`,
    },
  })

  const data = await response.json()
  revalidateTag('course.index')

  return {
    ok: response.ok,
    status: response.status,
    ...data,
  } as IBaseResponse
}

export const getCourse = async (
  search: string = '',
  pageNumber: number = -1,
  pageSize: number = -1,
) => {
  const response = await fetch(
    `${globalConfig.baseUrl}/course?search=${search}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
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
  } as IIndexResponse<ICourseResponse>
}
