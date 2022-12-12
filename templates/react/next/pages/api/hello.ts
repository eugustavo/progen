import type { NextApiRequest, NextApiResponse } from 'next'

type HelloProps = {
  message: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<HelloProps>
) {
  res.status(200).json({ message: 'Project created from the CLI 👉 npx @eugustavo/progen' })
}
