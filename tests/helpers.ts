import type { Page, Locator } from '@playwright/test';

/**
 * The app seeds a sample resume (Alex Morgan) on first load. Tests seed
 * localStorage with an empty resume first so assertions start from a known,
 * empty state. Keys/shape mirror the zustand `persist` middleware config in
 * client/src/store/useResumeStore.ts.
 */
const EMPTY_RESUME = {
  personal: { fullName: '', email: '', phone: '', linkedin: '', github: '', location: '' },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  customSections: [],
};

const DEFAULT_SECTION_ORDER = [
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
  'custom',
];

/**
 * Seeds an empty resume into localStorage before any app code runs.
 *
 * addInitScript re-runs on every navigation (including page.reload()), so the
 * seed is guarded by a sentinel — otherwise reloading would wipe whatever the
 * test just typed and the persistence tests would be meaningless.
 */
export async function gotoEmptyResume(page: Page) {
  await page.addInitScript(
    ([data, order]) => {
      if (window.localStorage.getItem('__e2e_seeded')) return;
      window.localStorage.setItem(
        'resume-data',
        JSON.stringify({ state: { data, sectionOrder: order }, version: 1 })
      );
      window.localStorage.setItem('__e2e_seeded', '1');
    },
    [EMPTY_RESUME, DEFAULT_SECTION_ORDER] as const
  );
  await page.goto('/');
  await page.getByRole('heading', { name: 'AI Resume Builder' }).waitFor();
}

/** Loads the app with its default sample resume (no seeding). */
export async function gotoSampleResume(page: Page) {
  await page.goto('/');
  await page.getByRole('heading', { name: 'AI Resume Builder' }).waitFor();
}

// ---- Locator helpers ----

export const section = (page: Page, name: string): Locator =>
  page.getByTestId(`section-${name}`);

/** The rendered resume document in the live preview pane. */
export const preview = (page: Page): Locator => page.locator('#resume-page');

/** Entry cards (work/education/etc.) within a given section. */
export const entries = (page: Page, sectionName: string): Locator =>
  section(page, sectionName).getByTestId('entry-card');

export const toast = (page: Page): Locator => page.getByTestId('toast');

// ---- Action helpers ----

export async function fillPersonalInfo(
  page: Page,
  info: { fullName?: string; email?: string; phone?: string; location?: string }
) {
  const panel = section(page, 'personal');
  if (info.fullName !== undefined) await panel.getByLabel('Full name').fill(info.fullName);
  if (info.email !== undefined) await panel.getByLabel('Email').fill(info.email);
  if (info.phone !== undefined) await panel.getByLabel('Phone').fill(info.phone);
  if (info.location !== undefined) await panel.getByLabel('Location').fill(info.location);
}

/** Adds a work experience entry and fills it in. Returns the entry card locator. */
export async function addExperience(
  page: Page,
  opts: { jobTitle: string; company: string; bullet?: string }
): Promise<Locator> {
  const panel = section(page, 'experience');
  const before = await panel.getByTestId('entry-card').count();
  await panel.getByRole('button', { name: 'Add experience' }).click();

  const card = panel.getByTestId('entry-card').nth(before);
  await card.getByLabel('Job title').fill(opts.jobTitle);
  await card.getByLabel('Company').fill(opts.company);
  if (opts.bullet !== undefined) {
    // A new entry starts with one empty bullet textarea.
    await card.getByPlaceholder('Describe an accomplishment…').first().fill(opts.bullet);
  }
  return card;
}

export async function addEducation(
  page: Page,
  opts: { degree: string; institution: string; year?: string }
): Promise<Locator> {
  const panel = section(page, 'education');
  const before = await panel.getByTestId('entry-card').count();
  await panel.getByRole('button', { name: 'Add education' }).click();

  const card = panel.getByTestId('entry-card').nth(before);
  await card.getByLabel('Degree').fill(opts.degree);
  await card.getByLabel('Institution').fill(opts.institution);
  if (opts.year) await card.getByLabel('Year').fill(opts.year);
  return card;
}

export async function addSkills(page: Page, skills: string[]) {
  const input = section(page, 'skills').getByPlaceholder('Type a skill and press Enter…');
  for (const skill of skills) {
    await input.fill(skill);
    await input.press('Enter');
  }
}

// ---- API mocking ----

export const MOCK_BULLETS = [
  'Shipped a billing platform that processed $4M in annual recurring revenue.',
  'Reduced p95 API latency by 42% through query optimization and caching.',
  'Mentored 3 junior engineers, two of whom were promoted within a year.',
];

/** Intercepts POST /api/ai/bullets with a canned success response. */
export async function mockBulletsApi(page: Page, opts: { delayMs?: number } = {}) {
  await page.route('**/api/ai/bullets', async (route) => {
    if (opts.delayMs) await new Promise((r) => setTimeout(r, opts.delayMs));
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ bullets: MOCK_BULLETS }),
    });
  });
}

/** Intercepts POST /api/ai/bullets with a server error. */
export async function failBulletsApi(page: Page) {
  await page.route('**/api/ai/bullets', (route) =>
    route.fulfill({
      status: 502,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Failed to generate bullets' }),
    })
  );
}

export const MOCK_ATS = {
  score: 72,
  missingKeywords: ['Kubernetes', 'GraphQL', 'Terraform'],
  suggestions: [
    'Add measurable outcomes to your two most recent bullet points.',
    'Mention Kubernetes explicitly in your skills section.',
    'Align your job titles with the wording used in the job description.',
  ],
};

export async function mockAtsApi(page: Page) {
  await page.route('**/api/ai/ats', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_ATS),
    })
  );
}
