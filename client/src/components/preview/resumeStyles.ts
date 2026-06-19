// Plain CSS for the resume document. Used BOTH in the live preview (injected via a
// <style> tag) and sent to the server for Puppeteer, guaranteeing PDF parity.
// All styles are scoped under .r-doc and driven by CSS vars (--r-accent, --r-font,
// --r-base, --r-pad) set on the page root.

export const RESUME_CSS = `
.r-doc {
  font-family: var(--r-font, 'Inter', sans-serif);
  font-size: var(--r-base, 14.5px);
  line-height: 1.42;
  color: #1f2328;
  background: #ffffff;
  box-sizing: border-box;
  width: 100%;
  min-height: 100%;
  padding: var(--r-pad, 48px 52px);
}
.r-doc * { box-sizing: border-box; }

/* ---- Shared header ---- */
.r-header { margin-bottom: 0.6em; }
.r-name { font-size: 2.05em; font-weight: 700; margin: 0; letter-spacing: -0.01em; }
.r-contact { display: flex; flex-wrap: wrap; gap: 0 0.85em; margin-top: 0.5em; font-size: 0.82em; color: #4b5563; }
.r-contact-item { position: relative; }
.r-contact-item + .r-contact-item::before { content: '·'; margin-right: 0.85em; color: #9ca3af; }

/* ---- Shared body + sections ---- */
.r-section { margin-top: 1.25em; }
.r-section:first-child { margin-top: 0.4em; }
.r-section-title { font-size: 0.92em; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 0.5em; }
.r-entry { margin-bottom: 0.85em; }
.r-entry:last-child { margin-bottom: 0; }
.r-entry-compact { margin-bottom: 0.45em; }
.r-entry-head { display: flex; justify-content: space-between; align-items: baseline; gap: 1em; }
.r-entry-title { font-weight: 600; }
.r-entry-org { color: #4b5563; font-weight: 500; }
.r-entry-meta { font-size: 0.8em; color: #6b7280; white-space: nowrap; }
.r-entry-sub { font-size: 0.82em; color: #6b7280; font-style: italic; margin-top: 0.1em; }
.r-summary { margin: 0; }
.r-bullets { margin: 0.35em 0 0; padding-left: 1.15em; }
.r-bullets li { margin-bottom: 0.22em; }
.r-skills { display: flex; flex-wrap: wrap; gap: 0.4em; }
.r-skill { font-size: 0.85em; }

/* ============ CLASSIC ============ */
.t-classic .r-name, .t-classic .r-section-title { font-family: Georgia, 'Times New Roman', serif; }
.t-classic .r-header { text-align: center; padding-bottom: 0.4em; }
.t-classic .r-contact { justify-content: center; }
.t-classic .r-section-title {
  border-bottom: 1.5px solid #1f2328;
  padding-bottom: 0.18em;
  letter-spacing: 0.08em;
}
.t-classic .r-skills { display: block; }
.t-classic .r-skill::after { content: ','; }
.t-classic .r-skill:last-child::after { content: ''; }
.t-classic .r-skill { margin-right: 0.15em; }

/* ============ MINIMAL ============ */
.t-minimal { color: #2b2b2b; }
.t-minimal .r-name { font-weight: 500; letter-spacing: 0.02em; }
.t-minimal .r-section { margin-top: 1.7em; }
.t-minimal .r-section-title {
  font-weight: 600;
  font-size: 0.78em;
  letter-spacing: 0.16em;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.45em;
  margin-bottom: 0.7em;
}
.t-minimal .r-entry-title { font-weight: 600; }
.t-minimal .r-skill { background: #f3f4f6; padding: 0.15em 0.6em; border-radius: 3px; }

/* ============ MODERN ============ */
.t-modern { padding: 0; }
.t-modern .r-accent-strip { height: 10px; background: var(--r-accent, #6c63ff); }
.t-modern .r-cols { display: flex; align-items: stretch; min-height: 100%; }
.t-modern .r-sidebar {
  width: 33%;
  background: color-mix(in srgb, var(--r-accent, #6c63ff) 9%, #ffffff);
  padding: var(--r-pad, 48px 52px);
}
.t-modern .r-main { width: 67%; padding: var(--r-pad, 48px 52px); }
.t-modern .r-name { font-size: 1.7em; color: var(--r-accent, #6c63ff); line-height: 1.15; }
.t-modern .r-contact-block { margin-top: 0.9em; font-size: 0.82em; color: #374151; }
.t-modern .r-contact-line { margin-bottom: 0.3em; word-break: break-word; }
.t-modern .r-sidebar .r-section-title,
.t-modern .r-main .r-section-title { color: var(--r-accent, #6c63ff); letter-spacing: 0.08em; }
.t-modern .r-sidebar .r-section { margin-top: 1.4em; }
.t-modern .r-skills { display: block; }
.t-modern .r-skill {
  display: inline-block;
  background: var(--r-accent, #6c63ff);
  color: #fff;
  padding: 0.12em 0.55em;
  border-radius: 3px;
  margin: 0 0.3em 0.35em 0;
  font-size: 0.78em;
}
.t-modern .r-main .r-section:first-child { margin-top: 0; }
.t-modern .r-entry-org { color: #6b7280; }
`;
