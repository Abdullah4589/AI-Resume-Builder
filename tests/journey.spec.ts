import { test, expect } from '@playwright/test';
import {
  gotoEmptyResume,
  section,
  preview,
  entries,
  fillPersonalInfo,
  addExperience,
  addEducation,
  addSkills,
  mockBulletsApi,
  mockAtsApi,
  MOCK_BULLETS,
  MOCK_ATS,
} from './helpers';

test.describe('Navigation & general UX', () => {
  test('TC-20: full happy path — create, add experience, AI bullets, ATS, export', async ({
    page,
  }) => {
    test.slow();

    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => consoleErrors.push(err.message));

    await gotoEmptyResume(page);
    await mockBulletsApi(page);
    await mockAtsApi(page);

    // 1. Create the resume.
    await fillPersonalInfo(page, {
      fullName: 'Sam Okafor',
      email: 'sam.okafor@example.com',
      phone: '(555) 314-1592',
      location: 'Boston, MA',
    });

    // 2. Add experience + education + skills.
    const card = await addExperience(page, {
      jobTitle: 'Senior Backend Engineer',
      company: 'Kestrel Systems',
      bullet: 'Rebuilt the payments ledger with zero downtime.',
    });
    await addEducation(page, {
      degree: 'B.S. Computer Engineering',
      institution: 'Northeastern University',
      year: '2017',
    });
    await addSkills(page, ['TypeScript', 'PostgreSQL', 'Kubernetes']);

    await expect(preview(page)).toContainText('Sam Okafor');
    await expect(preview(page)).toContainText('Kestrel Systems');

    // 3. Generate AI bullets and accept one.
    await card.getByRole('button', { name: 'Generate bullets' }).click();
    await page.getByRole('button', { name: 'Generate', exact: true }).click();
    await page.getByTestId('bullet-suggestion').first().getByRole('button', { name: 'Add' }).click();
    await page.getByLabel('Close').click();
    await expect(preview(page)).toContainText(MOCK_BULLETS[0]);

    // 4. Check the ATS score.
    await page.getByRole('button', { name: 'ATS Optimizer' }).click();
    await page
      .getByLabel('Paste the job description')
      .fill('Senior Backend Engineer with Kubernetes, GraphQL and Terraform experience.');
    await page.getByRole('button', { name: 'Analyze match' }).click();
    await expect(page.getByTestId('ats-result')).toContainText(String(MOCK_ATS.score));
    await page.getByLabel('Close').click();

    // 5. Export.
    const downloadPromise = page.waitForEvent('download', { timeout: 60_000 });
    await page.getByRole('button', { name: 'Download PDF' }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('sam-okafor-resume.pdf');

    // The journey produced no uncaught page errors.
    expect(consoleErrors).toEqual([]);
  });

  test('TC-21: key actions remain reachable at a mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone 14-ish
    await gotoEmptyResume(page);
    await mockBulletsApi(page);

    // Header actions are reachable.
    await expect(page.getByRole('button', { name: 'ATS Optimizer' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Download PDF' })).toBeVisible();

    // Filling personal info works.
    await fillPersonalInfo(page, { fullName: 'Mobile Tester' });
    await expect(section(page, 'personal').getByLabel('Full name')).toHaveValue('Mobile Tester');

    // Adding an entry works.
    const card = await addExperience(page, {
      jobTitle: 'Field Engineer',
      company: 'Compass Utilities',
    });
    await expect(entries(page, 'experience')).toHaveCount(1);

    // Generating bullets works.
    await card.getByRole('button', { name: 'Generate bullets' }).click();
    await expect(page.getByRole('heading', { name: 'AI Bullet Generator' })).toBeVisible();
    await page.getByRole('button', { name: 'Generate', exact: true }).click();
    await expect(page.getByTestId('bullet-suggestion').first()).toBeVisible();

    // Nothing overflows the viewport horizontally.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
