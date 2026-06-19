import puppeteer, { type Browser } from 'puppeteer';

let browserPromise: Promise<Browser> | null = null;

function getBrowser(): Promise<Browser> {
  if (!browserPromise) {
    browserPromise = puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }
  return browserPromise;
}

const GOOGLE_FONTS_LINK =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:wght@400;700&family=Roboto+Mono:wght@400;500&display=swap';

/**
 * Renders the resume HTML (already styled to match the live preview) to an A4 PDF.
 * The `html` is the serialized .resume-page element; `css` is the shared resume CSS.
 */
export async function renderPDF(html: string, css: string): Promise<Uint8Array> {
  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    const doc = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="${GOOGLE_FONTS_LINK}" rel="stylesheet" />
    <style>
      html, body { margin: 0; padding: 0; background: #ffffff; }
      /* The .resume-page carries a fixed px width for preview scaling; let it
         fill the A4 page in print so content uses the full width. */
      .resume-page { width: 100% !important; min-height: auto !important; box-shadow: none !important; }
      ${css}
    </style>
  </head>
  <body>${html}</body>
</html>`;

    await page.setContent(doc, { waitUntil: 'load' });
    // Ensure web fonts are fully loaded so the PDF matches the on-screen preview.
    // The callback runs in the browser; reference document via globalThis so it
    // type-checks against the server's (non-DOM) lib.
    await page.evaluate(async () => {
      const win = globalThis as unknown as { document: { fonts: { ready: Promise<unknown> } } };
      await win.document.fonts.ready;
    });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });
    return pdf;
  } finally {
    await page.close();
  }
}
