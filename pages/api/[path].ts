// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { runMiddleware } from './common'
import Cors from 'cors'

const cors = Cors({
  methods: ['GET', 'HEAD'],
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res, cors)

  res.status(404).json({ error: 'Nothing is here! Did you mean `/api/me`?' })
}
