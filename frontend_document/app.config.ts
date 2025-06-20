interface IGlobalConfig {
  API_HOST: string
  API_PORT: number
  baseUrl: string
}

// Config for the application
const globalConfig: IGlobalConfig = {
  API_HOST: '192.168.1.20',
  API_PORT: 5000,
  baseUrl: 'http://192.168.1.20:5000',
}

export default globalConfig
