interface IGlobalConfig {
  baseUrl: string
  clientBaseUrl: string
  version?: string
}

const isBrowser = typeof window !== 'undefined'

// Config for the application
const globalConfig: IGlobalConfig = {
  // Server-side URL (for SSR)
  baseUrl: process.env.NEXT_PUBLIC_INTERNAL_API_URL ?? 'http://backend:5000',
  // Client-side URL (for browser/SignalR)
  clientBaseUrl: isBrowser
    ? (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000')
    : (process.env.NEXT_PUBLIC_INTERNAL_API_URL ?? 'http://backend:5000'),
  version: process.env.NEXT_PUBLIC_VERSION ?? '1.0.5',
}

export default globalConfig
