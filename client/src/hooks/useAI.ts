import { useCallback, useState } from 'react';
import { useToast } from '../components/ui/Toast';
import type {
  ATSResult,
  BulletsResponse,
  ImproveContext,
  ImproveResponse,
  ResumeData,
} from '../types/resume';

interface ApiError {
  error: string;
}

async function postJSON<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as T | ApiError;
  if (!res.ok || (data as ApiError).error) {
    throw new Error((data as ApiError).error || `Request failed (${res.status})`);
  }
  return data as T;
}

function isBulletsResponse(d: unknown): d is BulletsResponse {
  return (
    typeof d === 'object' &&
    d !== null &&
    Array.isArray((d as BulletsResponse).bullets) &&
    (d as BulletsResponse).bullets.every((b) => typeof b === 'string')
  );
}

function isImproveResponse(d: unknown): d is ImproveResponse {
  return typeof d === 'object' && d !== null && typeof (d as ImproveResponse).improved === 'string';
}

function isATSResult(d: unknown): d is ATSResult {
  const r = d as ATSResult;
  return (
    typeof d === 'object' &&
    d !== null &&
    typeof r.score === 'number' &&
    Array.isArray(r.missingKeywords) &&
    Array.isArray(r.suggestions)
  );
}

export function useAI() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const run = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T | null> => {
      setLoading(true);
      try {
        return await fn();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'AI request failed';
        toast(message, 'error');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const generateBullets = useCallback(
    (jobTitle: string, company: string, description?: string) =>
      run(async () => {
        const data = await postJSON<unknown>('/api/ai/bullets', { jobTitle, company, description });
        if (!isBulletsResponse(data)) throw new Error('Unexpected AI response shape');
        return data.bullets;
      }),
    [run]
  );

  const improveText = useCallback(
    (text: string, context: ImproveContext) =>
      run(async () => {
        const data = await postJSON<unknown>('/api/ai/improve', { text, context });
        if (!isImproveResponse(data)) throw new Error('Unexpected AI response shape');
        return data.improved;
      }),
    [run]
  );

  const analyzeATS = useCallback(
    (resumeJSON: ResumeData, jobDescription: string) =>
      run(async () => {
        const data = await postJSON<unknown>('/api/ai/ats', { resumeJSON, jobDescription });
        if (!isATSResult(data)) throw new Error('Unexpected AI response shape');
        return data;
      }),
    [run]
  );

  return { loading, generateBullets, improveText, analyzeATS };
}
