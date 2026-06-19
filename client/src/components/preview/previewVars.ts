import type { CSSProperties } from 'react';
import type { Customization, FontId, FontSize, Margin } from '../../types/resume';

// Page geometry: A4 at 96dpi.
export const PAGE_WIDTH = 794;
export const PAGE_MIN_HEIGHT = 1123;

const FONT_STACKS: Record<FontId, string> = {
  Inter: "'Inter', system-ui, sans-serif",
  Georgia: "Georgia, 'Times New Roman', serif",
  Merriweather: "'Merriweather', Georgia, serif",
  'Roboto Mono': "'Roboto Mono', ui-monospace, monospace",
};

const BASE_SIZE: Record<FontSize, string> = {
  small: '13px',
  medium: '14.5px',
  large: '16px',
};

const PAGE_PADDING: Record<Margin, string> = {
  compact: '32px 36px',
  normal: '48px 52px',
  spacious: '64px 70px',
};

/** CSS custom properties applied to the resume root, driving all template styles. */
export function resumeCSSVars(c: Customization): CSSProperties {
  const vars: Record<string, string> = {
    '--r-accent': c.accentColor,
    '--r-font': FONT_STACKS[c.font],
    '--r-base': BASE_SIZE[c.fontSize],
    '--r-pad': PAGE_PADDING[c.margin],
  };
  return vars as CSSProperties;
}
