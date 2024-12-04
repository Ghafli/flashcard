import { NextApiRequest, NextApiResponse } from 'next'
import rateLimit from 'express-rate-limit'
import { sendError } from './api-response'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})

export const applyRateLimit = (req: NextApiRequest, res: NextApiResponse) =>
  new Promise((resolve, reject) => {
    limiter(req, res, (result: any) => {
      if (result instanceof Error) {
        sendError(res, 'Too Many Requests', 429)
        return reject(result)
      }
      resolve(result)
    })
  })
