import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { aiRouter } from './routes/ai.js';
import { pdfRouter } from './routes/pdf.js';
import { isLive } from './services/claude.js';

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors());
// Raise the body limit — the PDF route receives full rendered HTML + CSS.
app.use(express.json({ limit: '4mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, aiMode: isLive ? 'live' : 'mock' });
});

app.use('/api/ai', aiRouter);
app.use('/api/pdf', pdfRouter);

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
  console.log(`[server] AI mode: ${isLive ? 'LIVE (Claude)' : 'MOCK (no API key set)'}`);
});
