import { Router, type Request, type Response } from 'express';
import { renderPDF } from '../services/pdf.js';

export const pdfRouter = Router();

// POST /api/pdf  → application/pdf binary
pdfRouter.post('/', async (req: Request, res: Response) => {
  const { html, css } = req.body ?? {};
  if (typeof html !== 'string' || !html.trim()) {
    return res.status(400).json({ error: 'html is required' });
  }

  try {
    const pdf = await renderPDF(html, typeof css === 'string' ? css : '');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
    return res.end(Buffer.from(pdf));
  } catch {
    return res.status(500).json({ error: 'Failed to generate PDF' });
  }
});
