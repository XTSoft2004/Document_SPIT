export interface IDepartmentResponse {
  id: number
  code: string
  name: string
  folderId: string
}

export interface IDepartmentRequest {
  code: string
  name: string
}
