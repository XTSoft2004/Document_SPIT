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
