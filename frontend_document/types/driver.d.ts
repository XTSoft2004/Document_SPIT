export interface ILoadFolder {
  id: string
  name: string
  createdTime: string
  md5Checksum: string
  isFolder: boolean
  typeDocument: string
  parentId: string
}

export interface IUploadFile {
  base64String: string
  fileName: string
  folderId: string
}

export interface IFolder {
  name: string
  folderId: string
}

export interface IDriveResponse {
  name: string
  folderId: string
  isFolder: boolean
  children: IDriveResponse[]
}
export interface IDriveItem {
  name: string
  folderId: string
  isFolder: boolean
}
