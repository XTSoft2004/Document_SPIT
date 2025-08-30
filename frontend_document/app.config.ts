interface IGlobalConfig {
  baseUrl: string
  version?: string
}

const isBrowser = typeof window !== 'undefined'

// Config for the application
// const globalConfig: IGlobalConfig = {
//   baseUrl: isBrowser
//     ? process.env.NEXT_PUBLIC_API_URL ?? '0'
//     : process.env.NEXT_PUBLIC_INTERNAL_API_URL ?? '0',
// }

const globalConfig: IGlobalConfig = {
  baseUrl: process.env.NEXT_PUBLIC_INTERNAL_API_URL ?? 'http://backend:5000',
  version: process.env.NEXT_PUBLIC_VERSION ?? '1.0.3',
}

export default globalConfig
