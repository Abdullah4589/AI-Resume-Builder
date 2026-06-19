import { Check, X } from 'lucide-react';
import { Button } from './Button';
import { Spinner } from './Spinner';

interface DiffViewProps {
  original: string;
  improved: string | null;
  loading: boolean;
  onAccept: () => void;
  onReject: () => void;
}

export function DiffView({ original, improved, loading, onAccept, onReject }: DiffViewProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-[#10131c] p-3">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
            Original
          </div>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-400">
            {original || <span className="italic text-muted">empty</span>}
          </p>
        </div>
        <div className="rounded-lg border border-accent/40 bg-accent-soft p-3">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-accent">
            Improved
          </div>
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted">
              <Spinner className="text-accent" /> Improving…
            </div>
          ) : (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-100">{improved}</p>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onReject} disabled={loading}>
          <X size={14} /> Reject
        </Button>
        <Button variant="primary" size="sm" onClick={onAccept} disabled={loading || !improved}>
          <Check size={14} /> Accept
        </Button>
      </div>
    </div>
  );
}
