import type { ResumeData, ATSResult } from '../types/resume';

// Deterministic mock responses used when no ANTHROPIC_API_KEY is configured,
// so the whole app is demo-able without a key.

const ACTION_VERBS = ['Led', 'Built', 'Designed', 'Optimized', 'Spearheaded', 'Drove'];

export function mockBullets(jobTitle: string, company: string, description?: string): string[] {
  const role = jobTitle || 'the role';
  const org = company ? ` at ${company}` : '';
  const detail = description ? ` (${description.trim()})` : '';
  return [
    `${ACTION_VERBS[0]} cross-functional initiatives as ${role}${org}, increasing team output by 30%.`,
    `${ACTION_VERBS[1]} and shipped key features${detail}, reducing turnaround time by 40%.`,
    `${ACTION_VERBS[2]} scalable processes that cut operational costs by an estimated 25%.`,
    `${ACTION_VERBS[3]} performance of core systems, improving reliability to 99.9% uptime.`,
    `${ACTION_VERBS[4]} adoption of best practices, mentoring 3+ teammates to senior level.`,
  ];
}

export function mockImprove(text: string): string {
  const trimmed = text.trim().replace(/\.$/, '');
  if (!trimmed) return text;
  return `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}, delivering measurable impact and clear results.`;
}

export function mockATS(resume: ResumeData, jobDescription: string): ATSResult {
  const resumeText = JSON.stringify(resume).toLowerCase();
  const jdWords = Array.from(
    new Set(
      jobDescription
        .toLowerCase()
        .match(/[a-z][a-z+#.]{2,}/g)
        ?.filter((w) => w.length > 3) ?? []
    )
  );
  const STOP = new Set([
    'with',
    'this',
    'that',
    'have',
    'will',
    'your',
    'from',
    'team',
    'work',
    'role',
    'years',
    'years',
    'experience',
    'ability',
  ]);
  const missing = jdWords
    .filter((w) => !STOP.has(w) && !resumeText.includes(w))
    .slice(0, 8);

  const present = jdWords.length - missing.length;
  const score = jdWords.length
    ? Math.min(95, Math.max(35, Math.round((present / jdWords.length) * 100)))
    : 60;

  return {
    score,
    missingKeywords: missing,
    suggestions: [
      'Mirror the exact phrasing of key requirements from the job description in your summary.',
      'Add a dedicated skills section featuring the missing keywords where they genuinely apply.',
      'Quantify achievements with concrete metrics that map to the role’s success criteria.',
    ],
  };
}
