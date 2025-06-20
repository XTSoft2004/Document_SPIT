export interface ILoginRequest {
  username: string
  password: string
  deviceId?: string
}

export interface ILoginResponse {
  userId: number
  username: string
  fullname: string
  isLocked: boolean
  accessToken: string
  expiresAt: DateTime
  refreshToken: string
  refreshExpiresAt: DateTime
}

export interface IRegisterRequest {
  username: string
  password: string
  fullname: string
}
