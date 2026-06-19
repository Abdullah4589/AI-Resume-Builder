import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

const baseField =
  'w-full rounded-md border border-border bg-[#10131c] px-3 py-2 text-sm text-gray-100 placeholder:text-muted/70 transition-colors focus:border-accent/60 focus:outline-none focus:ring-1 focus:ring-accent/40';

export function Label({ children }: { children: ReactNode }) {
  return <span className="mb-1 block text-xs font-medium text-muted">{children}</span>;
}

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function InputField({ label, className, ...rest }: InputFieldProps) {
  return (
    <label className="block">
      {label && <Label>{label}</Label>}
      <input className={cn(baseField, className)} {...rest} />
    </label>
  );
}

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function TextareaField({ label, className, rows = 3, ...rest }: TextareaFieldProps) {
  return (
    <label className="block">
      {label && <Label>{label}</Label>}
      <textarea rows={rows} className={cn(baseField, 'resize-y', className)} {...rest} />
    </label>
  );
}
