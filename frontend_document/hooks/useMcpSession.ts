'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { getOrCreateDeviceId } from '@/utils/deviceId'
import {
  createMcpSession,
  closeMcpSession,
  sendMcpQuery,
} from '@/actions/mcp.actions'
import {
  CreateSessionResponse,
  McpQueryRequest,
  McpQueryResponse,
} from '@/types/mcp'

interface UseMcpSessionReturn {
  sessionId: string | null
  deviceId: string
  isLoading: boolean
  error: string | null
  isInitialized: boolean
  initializeSession: () => Promise<void>
  closeSession: () => Promise<void>
  sendQuery: (
    query: string,
    context?: string,
  ) => Promise<McpQueryResponse | null>
}

export function useMcpSession(): UseMcpSessionReturn {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [deviceId, setDeviceId] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const initializingRef = useRef<boolean>(false)

  useEffect(() => {
    const id = getOrCreateDeviceId()
    setDeviceId(id)
  }, [])

  const initializeSession = useCallback(async () => {
    if (!deviceId || initializingRef.current || isInitialized) return

    initializingRef.current = true
    setIsLoading(true)
    setError(null)

    try {
      const response: CreateSessionResponse = await createMcpSession({
        deviceId,
      })
      setSessionId(response.sessionId)
      setIsInitialized(true)
      console.log('✅ Session initialized:', response.sessionId)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create session'
      setError(errorMessage)
      console.error('❌ Failed to initialize MCP session:', err)
    } finally {
      setIsLoading(false)
      initializingRef.current = false
    }
  }, [deviceId, isInitialized])

  const closeSession = useCallback(async () => {
    if (!sessionId || !deviceId) return

    setIsLoading(true)
    setError(null)

    try {
      await closeMcpSession({ sessionId, deviceId })
      setSessionId(null)
      setIsInitialized(false)
      console.log('✅ Session closed successfully')
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to close session'
      setError(errorMessage)
      console.error('❌ Failed to close MCP session:', err)
    } finally {
      setIsLoading(false)
    }
  }, [sessionId, deviceId])

  const sendQuery = useCallback(
    async (
      query: string,
      context?: string,
    ): Promise<McpQueryResponse | null> => {
      if (!sessionId || !deviceId) {
        setError('Session not initialized')
        return null
      }

      setIsLoading(true)
      setError(null)

      try {
        const request: McpQueryRequest = {
          sessionId,
          deviceId,
          query,
          context,
        }
        const response = await sendMcpQuery(request)
        console.log('✅ Query sent successfully')
        return response
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to send query'
        setError(errorMessage)
        console.error('❌ Failed to send MCP query:', err)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [sessionId, deviceId],
  )

  useEffect(() => {
    if (deviceId && !isInitialized && !initializingRef.current) {
      initializeSession()
    }
  }, [deviceId, isInitialized, initializeSession])

  useEffect(() => {
    return () => {
      if (sessionId) {
        closeSession()
      }
    }
  }, [sessionId, closeSession])

  return {
    sessionId,
    deviceId,
    isLoading,
    error,
    isInitialized,
    initializeSession,
    closeSession,
    sendQuery,
  }
}
