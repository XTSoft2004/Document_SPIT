interface IGlobalConfig {
  baseUrl: string
}

// Config for the application
const globalConfig: IGlobalConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '0',
}

export default globalConfig
