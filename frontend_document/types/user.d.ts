export interface IUserResponse {
  id: string
  username: string
  fullname: string
  islocked: boolean
  roleName: string
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
