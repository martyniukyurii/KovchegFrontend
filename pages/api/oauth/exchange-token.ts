import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code is required' });
  }

  try {
    // Отримуємо credentials з environment variables
    const clientId = process.env.OLX_CLIENT_ID;
    const clientSecret = process.env.OLX_CLIENT_SECRET;
    const redirectUri = 'https://www.kovcheg.cv.ua/oauth/callback';

    if (!clientId || !clientSecret) {
      console.error('OLX credentials not configured');
      return res.status(500).json({ 
        error: 'OLX credentials not configured. Please set OLX_CLIENT_ID and OLX_CLIENT_SECRET environment variables.' 
      });
    }

    // Формуємо запит до OLX для обміну коду на токен
    const tokenResponse = await fetch('https://www.olx.ua/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('OLX token exchange error:', tokenData);
      return res.status(tokenResponse.status).json({ 
        error: `OLX API error: ${tokenData.error || 'Unknown error'}`,
        details: tokenData
      });
    }

    // Повертаємо access token
    return res.status(200).json({
      access_token: tokenData.access_token,
      token_type: tokenData.token_type,
      expires_in: tokenData.expires_in,
      refresh_token: tokenData.refresh_token,
    });

  } catch (error) {
    console.error('Error exchanging code for token:', error);
    return res.status(500).json({ 
      error: 'Internal server error during token exchange' 
    });
  }
} 