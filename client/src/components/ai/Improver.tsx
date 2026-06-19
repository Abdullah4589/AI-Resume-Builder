import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { DiffView } from '../ui/DiffView';
import { useAI } from '../../hooks/useAI';
import type { ImproveContext } from '../../types/resume';

interface ImproverProps {
  text: string;
  context: ImproveContext;
  onAccept: (improved: string) => void;
  /** Render as a compact icon-only button (for bullet rows). */
  compact?: boolean;
  disabled?: boolean;
}

export function Improver({ text, context, onAccept, compact, disabled }: ImproverProps) {
  const [open, setOpen] = useState(false);
  const [improved, setImproved] = useState<string | null>(null);
  const { loading, improveText } = useAI();

  async function start() {
    setImproved(null);
    setOpen(true);
    const result = await improveText(text, context);
    setImproved(result);
  }

  function accept() {
    if (improved) onAccept(improved);
    setOpen(false);
  }

  return (
    <>
      {compact ? (
        <button
          type="button"
          onClick={start}
          disabled={disabled || !text.trim()}
          title="Improve with AI"
          aria-label="Improve with AI"
          className="rounded p-1 text-accent transition-colors hover:bg-accent-soft disabled:opacity-40"
        >
          <Sparkles size={14} />
        </button>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={start}
          disabled={disabled || !text.trim()}
          className="text-accent"
        >
          <Sparkles size={14} /> Improve
        </Button>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Improve with AI" widthClass="max-w-2xl">
        <DiffView
          original={text}
          improved={improved}
          loading={loading}
          onAccept={accept}
          onReject={() => setOpen(false)}
        />
      </Modal>
    </>
  );
}
