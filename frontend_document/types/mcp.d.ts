// types/mcp.d.ts

export interface CreateSessionRequest {
  deviceId: string
}

export interface CreateSessionResponse {
  sessionId: string
  deviceId: string
  message: string
}

export interface CloseSessionRequest {
  sessionId: string
  deviceId: string
}

export interface CloseSessionResponse {
  message: string
}

export interface McpQueryRequest {
  sessionId: string
  deviceId: string
  query: string
  context?: string
}

export interface McpQueryResponse {
  sessionId: string
  intent: string
  response: string
  documents?: any[]
  success: boolean
  error?: string
}

// Legacy interface - giữ lại để tương thích
export interface IMCPQueryRequest {
  query: string
}

export interface IMCPResponse {
  ok: boolean
  status: number
  message?: string
  data?: {
    answer: string
    sources?: string[]
  }
}
