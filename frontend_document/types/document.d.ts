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
  userId: number
  folderId: string
  typeFile: string
  createdDate: date
  modifiedDate: date
}

export interface IDocumentRecentResponse {
  id: number
  name: string
  fileId: string
  fileName: string
  fullname: string
  totalDownloads: number
  totalViews: number
  typeFile: string
  createdDate: date
  modifiedDate: date
}
