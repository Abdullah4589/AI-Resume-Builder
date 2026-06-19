import { useState } from 'react';
import { Sparkles, Plus, RefreshCw, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { SkeletonLine } from '../ui/Spinner';
import { TextareaField } from '../ui/Field';
import { useAI } from '../../hooks/useAI';

interface BulletGeneratorProps {
  jobTitle: string;
  company: string;
  /** Adds an accepted bullet to the parent entry. */
  onAccept: (bullet: string) => void;
}

export function BulletGenerator({ jobTitle, company, onAccept }: BulletGeneratorProps) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [bullets, setBullets] = useState<string[]>([]);
  const [accepted, setAccepted] = useState<Set<number>>(new Set());
  const { loading, generateBullets } = useAI();

  async function generate() {
    const result = await generateBullets(jobTitle, company, description || undefined);
    if (result) {
      setBullets(result);
      setAccepted(new Set());
    }
  }

  function accept(index: number) {
    onAccept(bullets[index]);
    setAccepted((prev) => new Set(prev).add(index));
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)} className="text-accent">
        <Sparkles size={14} /> Generate bullets
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title="AI Bullet Generator" widthClass="max-w-xl">
        <div className="space-y-4">
          <p className="text-xs text-muted">
            Generating for{' '}
            <span className="text-gray-200">{jobTitle || 'role'}</span>
            {company && (
              <>
                {' '}at <span className="text-gray-200">{company}</span>
              </>
            )}
            .
          </p>
          <TextareaField
            label="What did you do? (optional)"
            placeholder="e.g. Built the billing system, mentored 2 juniors…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />

          <Button variant="primary" size="sm" onClick={generate} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            {bullets.length ? 'Regenerate' : 'Generate'}
          </Button>

          {loading && (
            <div className="space-y-2.5">
              {[0, 1, 2, 3].map((i) => (
                <SkeletonLine key={i} className="h-4 w-full" />
              ))}
            </div>
          )}

          {!loading && bullets.length > 0 && (
            <ul className="space-y-2">
              {bullets.map((b, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 rounded-lg border border-border bg-[#10131c] p-2.5"
                >
                  <span className="flex-1 text-sm leading-relaxed text-gray-200">{b}</span>
                  {accepted.has(i) ? (
                    <span className="inline-flex items-center gap-1 px-1.5 text-xs text-emerald-400">
                      <Check size={14} /> Added
                    </span>
                  ) : (
                    <Button variant="secondary" size="sm" onClick={() => accept(i)}>
                      <Plus size={14} /> Add
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Modal>
    </>
  );
}
