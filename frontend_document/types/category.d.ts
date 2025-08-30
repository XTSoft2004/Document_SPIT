export interface ICategoryResponse {
  id: number
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface ICategoryRequest {
  name: string
  description?: string
}
