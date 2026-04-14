const rawApiUrl = import.meta.env.VITE_API_URL?.trim()

if (!rawApiUrl) {
  throw new Error('VITE_API_URL is not configured. Please check your .env file.')
}

const sanitizedApiUrl = rawApiUrl.replace(/\/+$/, '')

export const API_BASE_URL = sanitizedApiUrl.endsWith('/api')
  ? sanitizedApiUrl
  : `${sanitizedApiUrl}/api`

// Temporary debug log to verify deployed environment wiring.
console.log('API URL:', rawApiUrl)

export const buildApiUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${normalizedPath}`
}

export const parseApiResponse = async (res: Response) => {
  const contentType = res.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    return res.json()
  }

  const text = await res.text()
  throw new Error(
    `Unexpected non-JSON response from API (${res.status}). ${text.slice(0, 200)}`
  )
}
