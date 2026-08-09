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
} from './helpers';

test.describe('Persistence (localStorage)', () => {
  test.beforeEach(async ({ page }) => {
    await gotoEmptyResume(page);
  });

  test('TC-15: entered data survives a page reload', async ({ page }) => {
    await fillPersonalInfo(page, {
      fullName: 'Priya Raman',
      email: 'priya@example.com',
      phone: '(555) 222-1111',
      location: 'Seattle, WA',
    });
    await addExperience(page, {
      jobTitle: 'Machine Learning Engineer',
      company: 'Solstice AI',
      bullet: 'Cut model training cost by 35% with spot-instance scheduling.',
    });
    await addEducation(page, {
      degree: 'B.S. Statistics',
      institution: 'University of Washington',
      year: '2020',
    });
    await addSkills(page, ['Python', 'PyTorch']);

    // Confirm it was written to localStorage before reloading.
    await expect(async () => {
      const stored = await page.evaluate(() => window.localStorage.getItem('resume-data'));
      expect(stored).toContain('Priya Raman');
    }).toPass();

    await page.reload();

    const personal = section(page, 'personal');
    await expect(personal.getByLabel('Full name')).toHaveValue('Priya Raman');
    await expect(personal.getByLabel('Email')).toHaveValue('priya@example.com');
    await expect(personal.getByLabel('Phone')).toHaveValue('(555) 222-1111');
    await expect(personal.getByLabel('Location')).toHaveValue('Seattle, WA');

    const expCard = entries(page, 'experience').first();
    await expect(expCard.getByLabel('Job title')).toHaveValue('Machine Learning Engineer');
    await expect(expCard.getByLabel('Company')).toHaveValue('Solstice AI');

    const doc = preview(page);
    await expect(doc).toContainText('Priya Raman');
    await expect(doc).toContainText('Solstice AI');
    await expect(doc).toContainText('spot-instance scheduling');
    await expect(doc).toContainText('University of Washington');
    await expect(doc).toContainText('PyTorch');
  });

  test('TC-17: repeated add/edit/delete cycles persist without stale or duplicate entries', async ({
    page,
  }) => {
    await fillPersonalInfo(page, { fullName: 'Marco Silva' });

    // Cycle 1: add three roles.
    await addExperience(page, { jobTitle: 'Role A', company: 'Company A', bullet: 'Bullet A' });
    await addExperience(page, { jobTitle: 'Role B', company: 'Company B', bullet: 'Bullet B' });
    await addExperience(page, { jobTitle: 'Role C', company: 'Company C', bullet: 'Bullet C' });
    await expect(entries(page, 'experience')).toHaveCount(3);

    // Cycle 2: delete the middle one.
    await entries(page, 'experience').nth(1).getByLabel('Remove entry').click();
    await expect(entries(page, 'experience')).toHaveCount(2);

    // Cycle 3: edit the survivors.
    await entries(page, 'experience').nth(0).getByLabel('Job title').fill('Role A (edited)');
    await entries(page, 'experience').nth(1).getByLabel('Company').fill('Company C (edited)');

    // Cycle 4: add another, then delete it again.
    await addExperience(page, { jobTitle: 'Role D', company: 'Company D' });
    await expect(entries(page, 'experience')).toHaveCount(3);
    await entries(page, 'experience').nth(2).getByLabel('Remove entry').click();
    await expect(entries(page, 'experience')).toHaveCount(2);

    // Skills: add, remove, re-add.
    await addSkills(page, ['Java', 'Scala', 'Kotlin']);
    await section(page, 'skills').getByLabel('Remove Scala').click();
    await addSkills(page, ['Scala']);

    await page.reload();

    // Exactly two experience entries, correctly edited, deleted ones gone.
    await expect(entries(page, 'experience')).toHaveCount(2);
    await expect(entries(page, 'experience').nth(0).getByLabel('Job title')).toHaveValue(
      'Role A (edited)'
    );
    await expect(entries(page, 'experience').nth(1).getByLabel('Company')).toHaveValue(
      'Company C (edited)'
    );

    const doc = preview(page);
    await expect(doc).not.toContainText('Role B');
    await expect(doc).not.toContainText('Company B');
    await expect(doc).not.toContainText('Role D');
    await expect(doc).toContainText('Role A (edited)');
    await expect(doc).toContainText('Company C (edited)');

    // No duplicated skills; Scala present exactly once.
    const skillTags = section(page, 'skills').locator('span', { hasText: /^Scala$/ });
    await expect(skillTags).toHaveCount(1);
    await expect(doc).toContainText('Kotlin');
  });

  /**
   * TC-16 — NOT APPLICABLE to the current codebase.
   * useResumeStore exposes a `resetAll` action, but nothing in the UI calls it
   * (verified: no component imports or binds it). There is no clear/reset control
   * to click, so there is no user-facing behaviour to test. Note also that
   * `resetAll` restores the *sample* resume, not an empty one — so even if it were
   * wired up, "clears to an empty state" would not describe it.
   */
  test.skip('TC-16: resetting the resume clears localStorage and the UI', () => {
    // Intentionally unimplemented — see comment above.
  });
});
