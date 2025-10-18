export interface IInfoGoogleDriveResponse {
  limit: number // Dung lượng đã sử dụng
  usage: number // Dung lượng còn trống
}

export interface ILoadFolder {
  id: string
  name: string
  createdTime: string
  md5Checksum: string
  isFolder: boolean
  typeDocument: string
  parentId: string
}

export interface IFileInfo {
  id: string
  name: string
}
export interface IUploadFile {
  base64String: string
  fileName: string
  folderId: string
  courseId: number
}

export interface IFolder {
  name: string
  folderId: string
}

export interface IDriveResponse {
  documentId: number
  name: string
  totalDownloads: number
  totalViews: number
  folderId: string
  isFolder: boolean
  courseCode: string
  children: IDriveResponse[]
}
export interface IDriveItem {
  documentId: number
  name: string
  totalDownloads: number
  totalViews: number
  folderId: string
  isFolder: boolean
}
