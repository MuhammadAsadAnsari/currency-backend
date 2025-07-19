import express from 'express';
import { getSymbols, convertCurrency } from '../controllers/testController';

const router = express.Router();

router.get('/symbols', getSymbols);
router.post('/convert', convertCurrency);

export default router;
