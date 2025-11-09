import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('✅ Test API called:', req.method);
  return res.status(200).json({ 
    success: true, 
    message: 'Test API works!',
    method: req.method 
  });
}

