export interface IDocumentRequest {
  name: string
  fileName: string
  base64String: string
  folderId: string
}

export interface IDocumentUpdateRequest {
  name?: string
  isPrivate?: boolean
  statusDocument?: string
  base64String?: string
  fileName?: string
  folderId?: string
  courseId?: number
}

export interface IDocumentResponse {
  id: number
  name: string
  totalDownloads: number
  totalViews: number
  fileId: string
  fileName: string
  isPrivate: boolean
  statusDocument: string
  fullNameUser: string
  folderId: string
  courseId: number
  courseName: string
  typeFile: string
  createdDate: date
  modifiedDate: date
}

export interface IDocumentReviewRequest {
  name: string
  courseId?: string
  folderId?: string
  statusDocument: string
}

export interface IDocumentPendingRequest {
  name: string
  fileName: string
  base64String: string
  courseId?: string
}
