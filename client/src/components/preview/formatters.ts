import type { WorkEntry } from '../../types/resume';

export function dateRange(entry: WorkEntry): string {
  const start = [entry.startMonth, entry.startYear].filter(Boolean).join(' ');
  const end = entry.currentlyWorking
    ? 'Present'
    : [entry.endMonth, entry.endYear].filter(Boolean).join(' ');
  if (!start && !end) return '';
  return [start, end].filter(Boolean).join(' – ');
}

export function nonEmpty(values: Array<string | undefined>): string[] {
  return values.filter((v): v is string => Boolean(v && v.trim()));
}
