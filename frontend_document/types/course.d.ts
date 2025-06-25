export interface ICourseRequest {
  name: string
  code: string
  departmentId: number
}

export interface ICourseResponse {
  id: number
  name: string
  code: string
  folderId_Contribute: string
  folderId_Base: string
  departmentId: string
}
