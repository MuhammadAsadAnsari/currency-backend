import express , {Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import testRoutes from './routes/testRoutes';
import { OAuthTokenResponse } from './types';

import axios from 'axios';
dotenv.config({ path: './config.env' });

const app = express();

app.use(cors());
app.use(express.json());

// Route mount point
app.use('/api', testRoutes);

const PORT = process.env.PORT || 3000;
const CLIENT_ID = process.env.CLIENT_ID!;
const CLIENT_SECRET = process.env.CLIENT_SECRET!;
const REDIRECT_URI = process.env.REDIRECT_URI!;

app.get('/auth/install', async (req: Request, res: Response) => {
  const { code, context, scope } = req.query;

  if (!code || !context || !scope) {
    return res.status(400).send('Missing required parameters');
  }

  try {
    const response = await axios.post<OAuthTokenResponse>(
      'https://login.bigcommerce.com/oauth2/token',
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
        code,
        scope,
        context,
      }
    );

    const { access_token, context: storeContext, user } = response.data;
    const storeHash = storeContext.split('/')[1];

    console.log('✅ Installed store:', {
      storeHash,
      userId: user.id,
      email: user.email,
      accessToken: access_token,
    });

    return res.redirect(`http://localhost:${PORT}/auth/load?store_hash=${storeHash}`);
  } catch (err: any) {
    console.error('❌ OAuth Error:', err.response?.data || err.message);
    return res.status(500).send('OAuth failed');
  }
});

app.get('/auth/load', (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).send('Missing token');
  }

  try {
    const payload: any = jwt.verify(token, CLIENT_SECRET, {
      algorithms: ['HS256'],
    });

    const storeHash = payload.sub?.split('/')[1];
    console.log('✅ Load success for store:', storeHash);

    res.send(`App loaded successfully for store: ${storeHash}`);
  } catch (err: any) {
    console.error('❌ JWT Error:', err.message);
    res.status(401).send('Invalid token');
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
