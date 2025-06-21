interface IGlobalConfig {
  API_HOST: string
  API_PORT: number
  baseUrl: string
}

// Config for the application
const globalConfig: IGlobalConfig = {
  API_HOST: 'xtcoder2004.io.vn',
  API_PORT: 5555,
  baseUrl: 'http://xtcoder2004.io.vn:5555',
}

export default globalConfig
