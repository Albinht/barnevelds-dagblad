export interface AuthUser {
  username: string
  loginTime: string
}

export interface JWTPayload {
  username: string
  iat: number
  exp: number
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface SessionConfig {
  httpOnly: boolean
  secure: boolean
  sameSite: 'strict' | 'lax' | 'none'
  maxAge: number
  path: string
}