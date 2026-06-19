import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Improver } from '../ai/Improver';

interface BulletListEditorProps {
  bullets: string[];
  onAdd: () => void;
  onChange: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}

export function BulletListEditor({ bullets, onAdd, onChange, onRemove }: BulletListEditorProps) {
  return (
    <div className="space-y-2">
      <span className="block text-xs font-medium text-muted">Bullet points</span>
      {bullets.map((bullet, i) => (
        <div key={i} className="flex items-start gap-1.5">
          <textarea
            value={bullet}
            onChange={(e) => onChange(i, e.target.value)}
            rows={2}
            placeholder="Describe an accomplishment…"
            className="min-h-[38px] w-full resize-y rounded-md border border-border bg-[#10131c] px-3 py-2 text-sm text-gray-100 placeholder:text-muted/70 transition-colors focus:border-accent/60 focus:outline-none focus:ring-1 focus:ring-accent/40"
          />
          <div className="flex flex-col items-center pt-1">
            <Improver text={bullet} context="bullet" compact onAccept={(v) => onChange(i, v)} />
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="rounded p-1 text-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
              aria-label="Remove bullet"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
      <Button variant="ghost" size="sm" onClick={onAdd}>
        <Plus size={14} /> Add bullet
      </Button>
    </div>
  );
}
