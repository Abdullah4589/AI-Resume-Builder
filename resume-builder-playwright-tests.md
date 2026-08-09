# Playwright Test Cases — AI Resume Builder

Give this file to Claude Code with a prompt like:
> "Implement these as Playwright tests in `/tests`. Use the actual selectors/routes from the codebase — inspect the components first before writing locators. Use `data-testid` attributes where selectors are ambiguous, adding them to the source if needed."

---

## 1. Core resume creation flow
- **TC-01**: User can create a new resume — fill in name, contact info, and at least one work experience entry, and see it reflected in the live preview.
- **TC-02**: Required fields (e.g. name, email) show validation errors if left empty when the user tries to proceed/save.
- **TC-03**: User can add multiple work experience entries, multiple education entries, and multiple skills, and all appear correctly in the preview.
- **TC-04**: User can delete a work experience/education/skill entry and it's removed from both the form and the preview.
- **TC-05**: User can reorder entries (if drag-and-drop or up/down controls exist) and the preview updates to match.

## 2. AI bullet point generation
- **TC-06**: User enters a job title/description and clicks "Generate bullet points" (or equivalent) — a loading state appears, then bullet suggestions are returned and displayed.
- **TC-07**: Generated bullet points can be inserted into the relevant work experience section.
- **TC-08**: User can edit an AI-generated bullet point after inserting it, and the edit persists.
- **TC-09**: If the AI generation request fails (mock a network/API error), the UI shows a clear error state instead of hanging or crashing.
- **TC-10**: Generating bullets with an empty/invalid job description shows an appropriate validation message rather than calling the API.

## 3. ATS scoring
- **TC-11**: ATS score is calculated and displayed after the resume has enough content to be scored.
- **TC-12**: ATS score updates when resume content changes (e.g. adding a skill or keyword raises the score, or at least triggers a recalculation).
- **TC-13**: If there's a "target job description" input for ATS matching, pasting a JD and comparing produces a visible match/gap result (e.g. missing keywords list).
- **TC-14**: ATS score section handles an empty resume gracefully (e.g. shows 0 or a "add more content" prompt, not a crash).

## 4. Persistence (localStorage)
- **TC-15**: After filling out resume data and reloading the page, all entered data is still present (loaded from localStorage).
- **TC-16**: Clearing/resetting the resume (if that feature exists) actually clears localStorage and the UI reflects an empty state.
- **TC-17**: Data persists correctly across multiple sequential edits — no stale or duplicated entries after several add/edit/delete cycles followed by a reload.

## 5. Export / output
- **TC-18**: User can export/download the resume (PDF or whatever format is supported) and the download is triggered successfully.
- **TC-19**: Exported resume content matches what's shown in the live preview (spot-check key fields: name, at least one bullet point).

## 6. Navigation & general UX
- **TC-20**: Full happy-path journey: create resume → add experience → generate AI bullets → check ATS score → export. Runs start to finish without errors.
- **TC-21**: Page is usable at a mobile viewport width (if the app claims responsive support) — key actions (add entry, generate bullets) are still reachable.

---

## Notes for Claude Code
- Use `page.getByRole` / `getByLabel` selectors where possible over CSS selectors, for resilience.
- Mock the AI generation API call in TC-09 and TC-10 rather than hitting a real endpoint (use `page.route()` to intercept).
- Group these into logical spec files, e.g. `resume-creation.spec.ts`, `ai-generation.spec.ts`, `ats-scoring.spec.ts`, `persistence.spec.ts`, `export.spec.ts`.
- Flag any test case above that doesn't map to an actual feature in the current codebase instead of forcing a test to pass.
