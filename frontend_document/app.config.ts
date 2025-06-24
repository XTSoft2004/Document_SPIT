interface IGlobalConfig {
  API_HOST: string
  API_PORT: number
  baseUrl: string
}

// Config for the application
const globalConfig: IGlobalConfig = {
  API_HOST: 'localhost',
  API_PORT: 5000,
  baseUrl: 'http://localhost:5000',
}

export default globalConfig
