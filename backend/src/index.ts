import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB, dbStatus } from './db';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', db: dbStatus() });
});

connectDB()
  .catch((err) => console.error('DB connection error:', err))
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  });
