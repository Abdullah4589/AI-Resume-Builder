import { test, expect } from '@playwright/test';
import { gotoEmptyResume, toast, fillPersonalInfo, addExperience } from './helpers';

/**
 * These tests exercise the real Express + Puppeteer PDF route (/api/pdf) via the
 * Vite dev proxy, so they need the server running — playwright.config.ts starts
 * both with `npm run dev`. Puppeteer's cold start is slow, hence the raised timeout.
 */
test.describe('Export / output', () => {
  test.slow();

  test.beforeEach(async ({ page }) => {
    await gotoEmptyResume(page);
    await fillPersonalInfo(page, {
      fullName: 'Dana Whitfield',
      email: 'dana.whitfield@example.com',
      location: 'Chicago, IL',
    });
    await addExperience(page, {
      jobTitle: 'Staff Engineer',
      company: 'Meridian Robotics',
      bullet: 'Led the perception team that shipped autonomous docking.',
    });
  });

  test('TC-18: downloading the resume triggers a PDF download', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download', { timeout: 60_000 });
    await page.getByRole('button', { name: 'Download PDF' }).click();

    const download = await downloadPromise;

    // Filename is slugified from the full name (see DownloadPdfButton.fileNameFrom).
    expect(download.suggestedFilename()).toBe('dana-whitfield-resume.pdf');

    // The file is a real, non-empty PDF.
    const path = await download.path();
    expect(path).toBeTruthy();

    const fs = await import('node:fs/promises');
    const buffer = await fs.readFile(path!);
    expect(buffer.byteLength).toBeGreaterThan(1000);
    expect(buffer.subarray(0, 5).toString('utf8')).toBe('%PDF-');

    await expect(toast(page)).toContainText('PDF generated');
  });

  test('TC-19: the exported document carries the same content as the live preview', async ({
    page,
  }) => {
    // Capture what the client actually sends to the PDF service.
    const requestPromise = page.waitForRequest(
      (req) => req.url().includes('/api/pdf') && req.method() === 'POST'
    );

    const downloadPromise = page.waitForEvent('download', { timeout: 60_000 });
    await page.getByRole('button', { name: 'Download PDF' }).click();

    const request = await requestPromise;
    const payload = request.postDataJSON() as { html: string; css: string };

    // Spot-check the key fields against what the preview shows.
    const previewText = await page.locator('#resume-page').innerText();
    expect(previewText).toContain('Dana Whitfield');
    expect(previewText).toContain('Led the perception team that shipped autonomous docking.');

    expect(payload.html).toContain('Dana Whitfield');
    expect(payload.html).toContain('dana.whitfield@example.com');
    expect(payload.html).toContain('Staff Engineer');
    expect(payload.html).toContain('Meridian Robotics');
    expect(payload.html).toContain('Led the perception team that shipped autonomous docking.');
    expect(payload.css).toBeTruthy();

    // And the export itself still succeeds.
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('dana-whitfield-resume.pdf');
  });
});
