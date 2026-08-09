import { useState } from 'react';
import { Target, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { TextareaField } from '../ui/Field';
import { CircularProgress } from '../ui/CircularProgress';
import { SkeletonLine } from '../ui/Spinner';
import { Tag } from '../ui/Tag';
import { useAI } from '../../hooks/useAI';
import { useResumeStore } from '../../store/useResumeStore';
import type { ATSResult } from '../../types/resume';

export function ATSOptimizer() {
  const [open, setOpen] = useState(false);
  const [jd, setJd] = useState('');
  const [result, setResult] = useState<ATSResult | null>(null);
  const { loading, analyzeATS } = useAI();
  const data = useResumeStore((s) => s.data);

  async function analyze() {
    setResult(null);
    const res = await analyzeATS(data, jd);
    if (res) setResult(res);
  }

  return (
    <>
      <Button variant="secondary" size="md" onClick={() => setOpen(true)}>
        <Target size={16} /> ATS Optimizer
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title="ATS Optimizer" widthClass="max-w-2xl">
        <div className="space-y-4">
          <TextareaField
            label="Paste the job description"
            placeholder="Paste the full job description here…"
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            rows={6}
          />
          <Button variant="primary" size="sm" onClick={analyze} disabled={loading || !jd.trim()}>
            <Sparkles size={14} className={loading ? 'animate-spin' : ''} />
            Analyze match
          </Button>

          {loading && (
            <div className="space-y-3 rounded-lg border border-border bg-[#10131c] p-4">
              <SkeletonLine className="h-24 w-24 rounded-full" />
              <SkeletonLine className="h-3 w-3/4" />
              <SkeletonLine className="h-3 w-2/3" />
            </div>
          )}

          {!loading && result && (
            <div data-testid="ats-result" className="space-y-4 rounded-lg border border-border bg-[#10131c] p-4">
              <div className="flex items-center gap-5">
                <CircularProgress value={result.score} />
                <div>
                  <div className="text-sm font-semibold text-gray-100">ATS Match Score</div>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    Based on keyword overlap and alignment with the job description.
                  </p>
                </div>
              </div>

              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                  Missing keywords
                </div>
                {result.missingKeywords.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {result.missingKeywords.map((k) => (
                      <Tag key={k} label={k} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-emerald-400">No critical keywords missing 🎉</p>
                )}
              </div>

              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                  Suggestions
                </div>
                <ul className="space-y-1.5">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="flex gap-2 text-sm leading-relaxed text-gray-200">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
