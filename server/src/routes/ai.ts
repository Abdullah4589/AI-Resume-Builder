import { Router, type Request, type Response } from 'express';
import { isLive, callClaude, extractJSON } from '../services/claude.js';
import { mockBullets, mockImprove, mockATS } from '../services/mock.js';
import type { ResumeData, ATSResult } from '../types/resume.js';

export const aiRouter = Router();

const BULLETS_SYSTEM = `You are an expert resume writer. Generate 4-6 strong, concise resume bullet points for the given role. Each bullet must: start with a strong past-tense action verb, include a quantified result where plausible (even estimated), and be no longer than 20 words. Return ONLY a JSON array of strings. No preamble, no markdown.`;

const IMPROVE_SYSTEM = `You are a professional resume editor. Rewrite the provided text to be more impactful, results-oriented, and concise. Preserve all factual content. Do not add fabricated metrics. Return ONLY the improved text as a plain string — no explanation, no quotes.`;

const ATS_SYSTEM = `You are an ATS (Applicant Tracking System) expert. Analyze the provided resume JSON and job description. Return ONLY a JSON object in this exact shape: { "score": number (0-100), "missingKeywords": string[], "suggestions": string[] (exactly 3-5 items) }. No markdown, no preamble.`;

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === 'string');
}

function isATSResult(v: unknown): v is ATSResult {
  const r = v as ATSResult;
  return (
    typeof v === 'object' &&
    v !== null &&
    typeof r.score === 'number' &&
    isStringArray(r.missingKeywords) &&
    isStringArray(r.suggestions)
  );
}

// POST /api/ai/bullets
aiRouter.post('/bullets', async (req: Request, res: Response) => {
  const { jobTitle, company, description } = req.body ?? {};
  if (typeof jobTitle !== 'string' || typeof company !== 'string') {
    return res.status(400).json({ error: 'jobTitle and company are required strings' });
  }

  if (!isLive) {
    return res.json({ bullets: mockBullets(jobTitle, company, description) });
  }

  try {
    const userContent = `Job title: ${jobTitle}\nCompany: ${company}${
      description ? `\nWhat they did: ${description}` : ''
    }`;
    const text = await callClaude(BULLETS_SYSTEM, userContent);
    const parsed = extractJSON<unknown>(text);
    if (!isStringArray(parsed) || parsed.length === 0) {
      return res.status(502).json({ error: 'AI returned an unexpected response' });
    }
    return res.json({ bullets: parsed.slice(0, 6) });
  } catch {
    return res.status(502).json({ error: 'Failed to generate bullets' });
  }
});

// POST /api/ai/improve
aiRouter.post('/improve', async (req: Request, res: Response) => {
  const { text, context } = req.body ?? {};
  if (typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'text is required' });
  }
  if (context !== 'summary' && context !== 'bullet') {
    return res.status(400).json({ error: 'context must be "summary" or "bullet"' });
  }

  if (!isLive) {
    return res.json({ improved: mockImprove(text) });
  }

  try {
    const userContent = `Context: ${context}\nText to improve:\n${text}`;
    const improved = await callClaude(IMPROVE_SYSTEM, userContent);
    if (!improved) {
      return res.status(502).json({ error: 'AI returned an empty response' });
    }
    // Strip wrapping quotes the model may add despite instructions.
    return res.json({ improved: improved.replace(/^["']|["']$/g, '').trim() });
  } catch {
    return res.status(502).json({ error: 'Failed to improve text' });
  }
});

// POST /api/ai/ats
aiRouter.post('/ats', async (req: Request, res: Response) => {
  const { resumeJSON, jobDescription } = req.body ?? {};
  if (typeof jobDescription !== 'string' || !jobDescription.trim()) {
    return res.status(400).json({ error: 'jobDescription is required' });
  }
  if (typeof resumeJSON !== 'object' || resumeJSON === null) {
    return res.status(400).json({ error: 'resumeJSON is required' });
  }

  if (!isLive) {
    return res.json(mockATS(resumeJSON as ResumeData, jobDescription));
  }

  try {
    const userContent = `Resume JSON:\n${JSON.stringify(resumeJSON)}\n\nJob description:\n${jobDescription}`;
    const text = await callClaude(ATS_SYSTEM, userContent);
    const parsed = extractJSON<unknown>(text);
    if (!isATSResult(parsed)) {
      return res.status(502).json({ error: 'AI returned an unexpected response' });
    }
    const score = Math.max(0, Math.min(100, Math.round(parsed.score)));
    return res.json({
      score,
      missingKeywords: parsed.missingKeywords,
      suggestions: parsed.suggestions.slice(0, 5),
    });
  } catch {
    return res.status(502).json({ error: 'Failed to analyze resume' });
  }
});
