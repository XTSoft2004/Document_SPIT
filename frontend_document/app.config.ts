interface IGlobalConfig {
  baseUrl: string
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
}

export default globalConfig
