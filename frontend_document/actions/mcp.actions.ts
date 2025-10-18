'use server'

import globalConfig from '@/app.config'
import {
  CreateSessionRequest,
  CreateSessionResponse,
  CloseSessionRequest,
  CloseSessionResponse,
  McpQueryRequest,
  McpQueryResponse,
  IMCPResponse,
} from '@/types/mcp'

/**
 * Tạo hoặc lấy MCP session dựa trên deviceId
 */
export async function createMcpSession(
  request: CreateSessionRequest
): Promise<CreateSessionResponse> {
  try {
    const response = await fetch(`${globalConfig.baseUrl}/mcp/session/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error('Failed to create MCP session')
    }

    return await response.json()
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to create MCP session'
    )
  }
}

/**
 * Đóng MCP session
 */
export async function closeMcpSession(
  request: CloseSessionRequest
): Promise<CloseSessionResponse> {
  try {
    const response = await fetch(`${globalConfig.baseUrl}/mcp/session/close`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error('Failed to close MCP session')
    }

    return await response.json()
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to close MCP session'
    )
  }
}

/**
 * Gửi query đến MCP chat với session management
 */
export async function sendMcpQuery(
  request: McpQueryRequest
): Promise<McpQueryResponse> {
  try {
    const response = await fetch(`${globalConfig.baseUrl}/mcp/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error('Failed to send MCP query')
    }

    return await response.json()
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to send MCP query'
    )
  }
}