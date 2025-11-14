'use client'

import { useCallback } from 'react'

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: Record<string, unknown>
  cache?: RequestCache
}

export const useApi = () =>
  useCallback(
    async <T>(
      path: string,
      { method = 'GET', body, cache }: RequestOptions = {}
    ): Promise<T> => {
      const response = await fetch(path, {
        method,
        cache,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: body ? JSON.stringify(body) : undefined,
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.error ?? 'Request failed')
      }

      return data as T
    },
    []
  )


