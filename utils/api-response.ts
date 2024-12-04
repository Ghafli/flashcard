import { NextApiResponse } from 'next'

export type ApiResponse<T = any> = {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export const sendSuccess = <T>(
  res: NextApiResponse,
  data: T,
  message?: string,
  statusCode: number = 200
) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message
  })
}

export const sendError = (
  res: NextApiResponse,
  error: string,
  statusCode: number = 400
) => {
  return res.status(statusCode).json({
    success: false,
    error
  })
}

export const handleApiError = (res: NextApiResponse, error: any) => {
  console.error('API Error:', error)
  const message = error instanceof Error ? error.message : 'Internal Server Error'
  return sendError(res, message, 500)
}
