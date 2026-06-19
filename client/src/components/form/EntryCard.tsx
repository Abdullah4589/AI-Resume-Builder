import type { ReactNode } from 'react';
import { Trash2 } from 'lucide-react';

interface EntryCardProps {
  title: string;
  onRemove: () => void;
  children: ReactNode;
}

export function EntryCard({ title, onRemove, children }: EntryCardProps) {
  return (
    <div className="rounded-lg border border-border bg-[#13161f] p-3.5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">{title}</span>
        <button
          type="button"
          onClick={onRemove}
          className="rounded p-1 text-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
          aria-label="Remove entry"
        >
          <Trash2 size={15} />
        </button>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
