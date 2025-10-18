'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import * as signalR from '@microsoft/signalr'
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
import globalConfig from '@/app.config'

interface McpProgressUpdate {
  sessionId: string
  step: string
  message: string
  progress: number
}

interface UseMcpSessionReturn {
  sessionId: string | null
  deviceId: string
  isLoading: boolean
  error: string | null
  isInitialized: boolean
  progress: McpProgressUpdate | null
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
  const [progress, setProgress] = useState<McpProgressUpdate | null>(null)
  const initializingRef = useRef<boolean>(false)
  const connectionRef = useRef<signalR.HubConnection | null>(null)

  useEffect(() => {
    const id = getOrCreateDeviceId()
    setDeviceId(id)
  }, [])

  /**
   * Khởi tạo SignalR connection
   */
  const initializeSignalR = useCallback(async (currentSessionId: string) => {
    if (connectionRef.current) {
      return
    }

    try {
      const connection = new signalR.HubConnectionBuilder()
        .withUrl(`${globalConfig.clientBaseUrl}/hubs/mcp-progress`, {
          withCredentials: true,
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build()

      connection.on('ProgressUpdate', (update: McpProgressUpdate) => {
        console.log('Progress update:', update)
        setProgress(update)
      })

      connection.on('JoinedSession', (sessionId: string) => {
        console.log('Joined session:', sessionId)
      })

      connection.on('LeftSession', (sessionId: string) => {
        console.log('Left session:', sessionId)
      })

      await connection.start()
      console.log('SignalR connected')

      await connection.invoke('JoinSession', currentSessionId)

      connectionRef.current = connection
    } catch (err) {
      console.error('SignalR connection error:', err)
    }
  }, [])

  /**
   * Đóng SignalR connection
   */
  const closeSignalR = useCallback(async () => {
    if (connectionRef.current) {
      try {
        if (sessionId) {
          await connectionRef.current.invoke('LeaveSession', sessionId)
        }
        await connectionRef.current.stop()
        connectionRef.current = null
        console.log('SignalR disconnected')
      } catch (err) {
        console.error('Error closing SignalR:', err)
      }
    }
  }, [sessionId])

  /**
   * Khởi tạo hoặc lấy session
   */
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
      console.log('MCP Session initialized:', response.sessionId)

      await initializeSignalR(response.sessionId)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create session'
      setError(errorMessage)
      console.error('Failed to initialize MCP session:', err)
    } finally {
      setIsLoading(false)
      initializingRef.current = false
    }
  }, [deviceId, isInitialized, initializeSignalR])

  /**
   * Đóng session hiện tại
   */
  const closeSession = useCallback(async () => {
    if (!sessionId || !deviceId) return

    setIsLoading(true)
    setError(null)

    try {
      await closeSignalR()

      await closeMcpSession({ sessionId, deviceId })
      setSessionId(null)
      setIsInitialized(false)
      setProgress(null)
      console.log('MCP Session closed')
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to close session'
      setError(errorMessage)
      console.error('Failed to close MCP session:', err)
    } finally {
      setIsLoading(false)
    }
  }, [sessionId, deviceId, closeSignalR])

  /**
   * Gửi query đến MCP chat
   */
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
        return response
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to send query'
        setError(errorMessage)
        console.error('Failed to send MCP query:', err)
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
        closeSignalR()
      }
    }
  }, [sessionId, closeSignalR])

  return {
    sessionId,
    deviceId,
    isLoading,
    error,
    isInitialized,
    progress,
    initializeSession,
    closeSession,
    sendQuery,
  }
}
