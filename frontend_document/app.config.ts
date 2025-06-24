interface IGlobalConfig {
  API_HOST: string
  API_PORT: number
  baseUrl: string
}

// Config for the application
const globalConfig: IGlobalConfig = {
  API_HOST: process.env.NEXT_PUBLIC_API_HOST || '0',
  API_PORT: Number(process.env.NEXT_PUBLIC_API_PORT) || 0,
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '0',
}

export default globalConfig
