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

test.describe('Core resume creation flow', () => {
  test.beforeEach(async ({ page }) => {
    await gotoEmptyResume(page);
  });

  test('TC-01: create a resume and see it in the live preview', async ({ page }) => {
    await fillPersonalInfo(page, {
      fullName: 'Jordan Reyes',
      email: 'jordan.reyes@example.com',
      phone: '(555) 987-6543',
      location: 'Austin, TX',
    });

    await addExperience(page, {
      jobTitle: 'Platform Engineer',
      company: 'Cobalt Systems',
      bullet: 'Automated release pipeline, cutting deploy time from 40 to 6 minutes.',
    });

    const doc = preview(page);
    await expect(doc).toContainText('Jordan Reyes');
    await expect(doc).toContainText('jordan.reyes@example.com');
    await expect(doc).toContainText('Austin, TX');
    await expect(doc).toContainText('Platform Engineer');
    await expect(doc).toContainText('Cobalt Systems');
    await expect(doc).toContainText('cutting deploy time from 40 to 6 minutes');
  });

  test('TC-03: multiple experience, education and skill entries all render', async ({ page }) => {
    await addExperience(page, {
      jobTitle: 'Backend Engineer',
      company: 'Helix Data',
      bullet: 'Designed an event pipeline handling 12M messages per day.',
    });
    await addExperience(page, {
      jobTitle: 'Junior Developer',
      company: 'Tinderbox Studio',
      bullet: 'Built internal admin tooling used by 30 staff.',
    });

    await addEducation(page, {
      degree: 'M.S. Computer Science',
      institution: 'Georgia Tech',
      year: '2021',
    });
    await addEducation(page, {
      degree: 'B.S. Mathematics',
      institution: 'Rice University',
      year: '2019',
    });

    await addSkills(page, ['Go', 'Kafka', 'Terraform']);

    await expect(entries(page, 'experience')).toHaveCount(2);
    await expect(entries(page, 'education')).toHaveCount(2);

    const doc = preview(page);
    for (const text of [
      'Backend Engineer',
      'Helix Data',
      'Junior Developer',
      'Tinderbox Studio',
      'M.S. Computer Science',
      'Georgia Tech',
      'B.S. Mathematics',
      'Rice University',
      'Go',
      'Kafka',
      'Terraform',
    ]) {
      await expect(doc).toContainText(text);
    }
  });

  test('TC-04: deleting an experience, education and skill removes it everywhere', async ({
    page,
  }) => {
    await addExperience(page, {
      jobTitle: 'Keep This Role',
      company: 'Retained Corp',
      bullet: 'Kept the lights on.',
    });
    await addExperience(page, {
      jobTitle: 'Delete This Role',
      company: 'Discarded Inc',
      bullet: 'Should disappear.',
    });
    await addEducation(page, { degree: 'Delete This Degree', institution: 'Gone University' });
    await addSkills(page, ['Rust', 'Elixir']);

    const doc = preview(page);
    await expect(doc).toContainText('Delete This Role');

    // Remove the second experience entry.
    await entries(page, 'experience').nth(1).getByLabel('Remove entry').click();
    await expect(entries(page, 'experience')).toHaveCount(1);
    await expect(doc).not.toContainText('Delete This Role');
    await expect(doc).not.toContainText('Discarded Inc');
    await expect(doc).toContainText('Keep This Role');

    // Remove the education entry.
    await entries(page, 'education').first().getByLabel('Remove entry').click();
    await expect(entries(page, 'education')).toHaveCount(0);
    await expect(doc).not.toContainText('Gone University');

    // Remove a skill tag.
    await section(page, 'skills').getByLabel('Remove Elixir').click();
    await expect(section(page, 'skills').getByText('Elixir')).toHaveCount(0);
    await expect(doc).not.toContainText('Elixir');
    await expect(doc).toContainText('Rust');
  });

  test('TC-05: sections can be reordered by drag-and-drop and the preview follows', async ({
    page,
  }) => {
    await addExperience(page, {
      jobTitle: 'Data Engineer',
      company: 'Northern Labs',
      bullet: 'Built the warehouse.',
    });
    await addEducation(page, { degree: 'B.A. Physics', institution: 'Reed College' });

    const headingOrder = async () => {
      const text = (await preview(page).innerText()).toUpperCase();
      return {
        experience: text.indexOf('EXPERIENCE'),
        education: text.indexOf('EDUCATION'),
      };
    };

    const before = await headingOrder();
    expect(before.experience).toBeGreaterThan(-1);
    expect(before.education).toBeGreaterThan(-1);
    expect(before.experience).toBeLessThan(before.education);

    // Drag the Education section handle above the Work Experience section.
    const eduHandle = section(page, 'education').getByLabel('Drag to reorder');
    const expSection = section(page, 'experience');

    const from = await eduHandle.boundingBox();
    const to = await expSection.boundingBox();
    if (!from || !to) throw new Error('Could not resolve drag bounding boxes');

    await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
    await page.mouse.down();
    // dnd-kit's PointerSensor needs >6px of movement before it activates.
    await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2 - 20, { steps: 5 });
    await page.mouse.move(to.x + to.width / 2, to.y + 10, { steps: 15 });
    await page.mouse.up();

    await expect(async () => {
      const after = await headingOrder();
      expect(after.education).toBeLessThan(after.experience);
    }).toPass({ timeout: 5000 });
  });

  /**
   * TC-02 — NOT APPLICABLE to the current codebase.
   * There is no validation layer, no save/submit step and no error messaging:
   * PersonalInfoSection renders plain InputFields wired straight into the zustand
   * store, and the resume is always "saved" (localStorage) as you type. Nothing
   * can show a required-field error, so this test would have to be forced to pass.
   */
  test.skip('TC-02: required fields show validation errors when empty', () => {
    // Intentionally unimplemented — see comment above.
  });
});
