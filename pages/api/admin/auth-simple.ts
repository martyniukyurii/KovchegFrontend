import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('🔐 Simple Auth API called:', req.method, req.body);
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const { telegram_id } = req.body;
  
  if (!telegram_id) {
    return res.status(400).json({ 
      success: false, 
      message: 'telegram_id is required' 
    });
  }
  
  // Тестова відповідь
  return res.status(200).json({
    success: true,
    token: 'test-token-123',
    admin: {
      id: 'test-id',
      first_name: 'Test',
      last_name: 'User',
      email: 'test@test.com',
      role: 'admin',
      telegram_id: telegram_id,
    },
    message: 'Test auth successful',
  });
}

