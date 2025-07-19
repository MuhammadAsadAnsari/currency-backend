import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import testRoutes from './routes/testRoutes';

dotenv.config({ path: './config.env' });

const app = express();

app.use(cors());
app.use(express.json());

// Route mount point
app.use('/api', testRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
