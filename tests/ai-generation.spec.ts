import { test, expect } from '@playwright/test';
import {
  gotoEmptyResume,
  preview,
  toast,
  addExperience,
  mockBulletsApi,
  failBulletsApi,
  MOCK_BULLETS,
} from './helpers';

test.describe('AI bullet point generation', () => {
  test.beforeEach(async ({ page }) => {
    await gotoEmptyResume(page);
  });

  test('TC-06: generating bullets shows a loading state then suggestions', async ({ page }) => {
    await mockBulletsApi(page, { delayMs: 700 });

    const card = await addExperience(page, {
      jobTitle: 'Site Reliability Engineer',
      company: 'Vantage Cloud',
    });
    await card.getByRole('button', { name: 'Generate bullets' }).click();

    const modal = page.getByRole('heading', { name: 'AI Bullet Generator' }).locator('..').locator('..');
    await expect(modal).toBeVisible();

    await page
      .getByLabel('What did you do? (optional)')
      .fill('Ran the on-call rotation and cut alert noise.');
    await page.getByRole('button', { name: 'Generate', exact: true }).click();

    // Loading state.
    await expect(page.getByTestId('bullets-loading')).toBeVisible();

    // Then the suggestions.
    await expect(page.getByTestId('bullet-suggestion')).toHaveCount(MOCK_BULLETS.length);
    await expect(page.getByTestId('bullets-loading')).toHaveCount(0);
    await expect(page.getByTestId('bullet-suggestions')).toContainText(MOCK_BULLETS[0]);
  });

  test('TC-07: a generated bullet can be inserted into the work experience entry', async ({
    page,
  }) => {
    await mockBulletsApi(page);

    const card = await addExperience(page, {
      jobTitle: 'Product Engineer',
      company: 'Lumen Works',
    });
    await card.getByRole('button', { name: 'Generate bullets' }).click();
    await page.getByRole('button', { name: 'Generate', exact: true }).click();

    const firstSuggestion = page.getByTestId('bullet-suggestion').first();
    await expect(firstSuggestion).toContainText(MOCK_BULLETS[0]);
    await firstSuggestion.getByRole('button', { name: 'Add' }).click();

    // The suggestion is marked as added.
    await expect(firstSuggestion).toContainText('Added');

    // Close the modal and confirm it landed in the entry + preview.
    await page.getByLabel('Close').click();
    await expect(card.getByPlaceholder('Describe an accomplishment…').last()).toHaveValue(
      MOCK_BULLETS[0]
    );
    await expect(preview(page)).toContainText(MOCK_BULLETS[0]);
  });

  test('TC-08: an inserted AI bullet can be edited and the edit persists', async ({ page }) => {
    await mockBulletsApi(page);

    const card = await addExperience(page, {
      jobTitle: 'Growth Engineer',
      company: 'Fernway',
    });
    await card.getByRole('button', { name: 'Generate bullets' }).click();
    await page.getByRole('button', { name: 'Generate', exact: true }).click();
    await page.getByTestId('bullet-suggestion').first().getByRole('button', { name: 'Add' }).click();
    await page.getByLabel('Close').click();

    const edited = 'Edited: grew activation rate by 18% through onboarding experiments.';
    const bulletBox = card.getByPlaceholder('Describe an accomplishment…').last();
    await bulletBox.fill(edited);

    await expect(preview(page)).toContainText(edited);
    await expect(preview(page)).not.toContainText(MOCK_BULLETS[0]);

    // Persists across a reload (localStorage).
    await page.reload();
    await expect(preview(page)).toContainText(edited);
  });

  test('TC-09: a failed AI request surfaces an error instead of hanging', async ({ page }) => {
    await failBulletsApi(page);

    const card = await addExperience(page, {
      jobTitle: 'Security Engineer',
      company: 'Ironclad',
    });
    await card.getByRole('button', { name: 'Generate bullets' }).click();
    await page.getByRole('button', { name: 'Generate', exact: true }).click();

    // Error toast, and the UI recovers (button re-enabled, no stuck skeleton).
    await expect(toast(page)).toBeVisible();
    await expect(toast(page)).toHaveAttribute('data-toast-kind', 'error');
    await expect(toast(page)).toContainText('Failed to generate bullets');
    await expect(page.getByTestId('bullets-loading')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Generate', exact: true })).toBeEnabled();
  });

  test('TC-10: invalid input shows validation and never calls the API', async ({ page }) => {
    let apiCalls = 0;
    await page.route('**/api/ai/bullets', async (route) => {
      apiCalls += 1;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ bullets: MOCK_BULLETS }),
      });
    });

    // An entry with no job title — there is nothing to generate bullets from.
    const card = await addExperience(page, { jobTitle: '', company: '' });
    await card.getByRole('button', { name: 'Generate bullets' }).click();

    const generate = page.getByRole('button', { name: 'Generate', exact: true });
    const validation = page.getByTestId('bullets-validation');

    // Validation message is shown and the action is blocked.
    await expect(validation).toBeVisible();
    await expect(validation).toContainText('Add a job title');
    await expect(generate).toBeDisabled();

    // Whitespace-only is still treated as empty.
    await page.getByLabel('Close').click();
    await card.getByLabel('Job title').fill('   ');
    await card.getByRole('button', { name: 'Generate bullets' }).click();
    await expect(validation).toBeVisible();
    await expect(generate).toBeDisabled();

    // Force the click through anyway — the guard in generate() must still hold.
    await generate.dispatchEvent('click');
    await expect(page.getByTestId('bullets-loading')).toHaveCount(0);

    // Once a real title is entered, validation clears and the API is reachable.
    await page.getByLabel('Close').click();
    await card.getByLabel('Job title').fill('Data Engineer');
    await card.getByRole('button', { name: 'Generate bullets' }).click();
    await expect(validation).toHaveCount(0);
    await expect(generate).toBeEnabled();

    // No request was made while the input was invalid.
    expect(apiCalls).toBe(0);

    await generate.click();
    await expect(page.getByTestId('bullet-suggestion').first()).toBeVisible();
    expect(apiCalls).toBe(1);
  });

  test('TC-09b: a network-level failure is reported, not swallowed', async ({ page }) => {
    await page.route('**/api/ai/bullets', (route) => route.abort('failed'));

    const card = await addExperience(page, { jobTitle: 'Network Tester', company: 'Offline Co' });
    await card.getByRole('button', { name: 'Generate bullets' }).click();
    await page.getByRole('button', { name: 'Generate', exact: true }).click();

    await expect(toast(page)).toBeVisible();
    await expect(toast(page)).toHaveAttribute('data-toast-kind', 'error');
    await expect(page.getByTestId('bullets-loading')).toHaveCount(0);
    await expect(page.getByTestId('bullet-suggestion')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Generate', exact: true })).toBeEnabled();
  });

  test('TC-09c: a malformed AI response is rejected rather than rendered', async ({ page }) => {
    // 200 OK, but the payload does not match the BulletsResponse contract.
    await page.route('**/api/ai/bullets', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ bullets: [{ text: 'not a string' }, 42] }),
      })
    );

    const card = await addExperience(page, { jobTitle: 'Shape Tester', company: 'Malformed Inc' });
    await card.getByRole('button', { name: 'Generate bullets' }).click();
    await page.getByRole('button', { name: 'Generate', exact: true }).click();

    await expect(toast(page)).toContainText('Unexpected AI response shape');
    await expect(page.getByTestId('bullet-suggestion')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Generate', exact: true })).toBeEnabled();
  });
});
