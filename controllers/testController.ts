import { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.API_KEY;
const API_URL =process.env.API_URL;

export const getSymbols = async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${API_URL}currencies`, {
      headers: { apikey: API_KEY },
    });

    const rawData = response.data.data;

    const symbols: Record<string, string> = {};
    Object.keys(rawData).forEach((code) => {
      symbols[code] = rawData[code].name;
    });

    res.json({ symbols });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch currency symbols' });
  }
};

export const convertCurrency = async (req: Request, res: Response) => {
  const { from, to, amount } = req.body;

  try {
    const response = await axios.get(`${API_URL}latest`, {
      params: {
        apikey: API_KEY,
        base_currency: from,
        currencies: to,
      },
    });

    const rate = response.data.data[to];
    const result = rate * amount;

    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Conversion failed' });
  }
};
