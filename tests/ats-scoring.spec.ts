import { test, expect } from '@playwright/test';
import { gotoSampleResume, gotoEmptyResume, mockAtsApi, MOCK_ATS } from './helpers';

const JOB_DESCRIPTION = `Senior Platform Engineer
We are looking for an engineer with deep Kubernetes and Terraform experience
to own our GraphQL gateway and CI/CD tooling.`;

test.describe('ATS scoring', () => {
  test('TC-13: pasting a job description produces a score, missing keywords and suggestions', async ({
    page,
  }) => {
    await gotoSampleResume(page);
    await mockAtsApi(page);

    await page.getByRole('button', { name: 'ATS Optimizer' }).click();
    await expect(page.getByRole('heading', { name: 'ATS Optimizer' })).toBeVisible();

    await page.getByLabel('Paste the job description').fill(JOB_DESCRIPTION);
    await page.getByRole('button', { name: 'Analyze match' }).click();

    const result = page.getByTestId('ats-result');
    await expect(result).toBeVisible();

    // Score.
    await expect(result).toContainText('ATS Match Score');
    await expect(result).toContainText(String(MOCK_ATS.score));

    // Missing keywords (the gap list).
    await expect(result).toContainText('Missing keywords');
    for (const keyword of MOCK_ATS.missingKeywords) {
      await expect(result).toContainText(keyword);
    }

    // Suggestions.
    await expect(result).toContainText('Suggestions');
    for (const suggestion of MOCK_ATS.suggestions) {
      await expect(result).toContainText(suggestion);
    }
  });

  test('TC-14 (adapted): the analyze action is gated until a job description is provided', async ({
    page,
  }) => {
    await gotoEmptyResume(page);

    await page.getByRole('button', { name: 'ATS Optimizer' }).click();
    const analyze = page.getByRole('button', { name: 'Analyze match' });

    // Empty resume + empty JD: disabled rather than crashing or scoring nothing.
    await expect(analyze).toBeDisabled();

    // Whitespace only is still treated as empty.
    await page.getByLabel('Paste the job description').fill('   ');
    await expect(analyze).toBeDisabled();

    await page.getByLabel('Paste the job description').fill(JOB_DESCRIPTION);
    await expect(analyze).toBeEnabled();
  });

  /**
   * TC-11 / TC-12 — NOT APPLICABLE to the current codebase.
   * There is no ambient ATS score. ATSOptimizer is a modal that requires a pasted
   * job description and an explicit "Analyze match" click; the result lives in
   * component state and is discarded when the modal closes. Nothing recalculates
   * when resume content changes, so there is no score to observe updating.
   * Implementing these would require a live-scoring feature that does not exist.
   */
  test.skip('TC-11: ATS score is displayed once the resume has enough content', () => {
    // Intentionally unimplemented — see comment above.
  });

  test.skip('TC-12: ATS score recalculates when resume content changes', () => {
    // Intentionally unimplemented — see comment above.
  });
});
