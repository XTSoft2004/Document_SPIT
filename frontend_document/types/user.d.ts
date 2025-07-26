export interface IUserResponse {
  id: string
  username: string
  fullname: string
  islocked: boolean
  roleName: string
  avatarUrl: string
}

export interface IUserUpdate {
  fullname: string
  password: string
}

export interface IUserCreateRequest {
  username: string
  password: string
  fullname: string
}

export interface ITokenInfoResponse {
  userId: string
  accessToken: string
  expiresAt: string
  refreshToken: string
  refreshExpiresAt: string
  deviceId: string
  isLocked: boolean
  roleName: string
}

export interface IProfile {
  username: string
  fullname: string
  email: string
  roleName: string
  avatarUrl: string
}

export interface IUserUploadAvatar {
  imageBase64: string
}
