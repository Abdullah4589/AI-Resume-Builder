import { FileText } from 'lucide-react';
import { Collapsible } from '../ui/Collapsible';
import { TextareaField } from '../ui/Field';
import { Improver } from '../ai/Improver';
import { useResumeStore } from '../../store/useResumeStore';

export function SummarySection({ dragHandleProps }: { dragHandleProps?: Record<string, unknown> }) {
  const summary = useResumeStore((s) => s.data.summary);
  const setSummary = useResumeStore((s) => s.setSummary);

  return (
    <Collapsible
      title="Summary"
      icon={<FileText size={16} />}
      dragHandleProps={dragHandleProps}
      headerRight={<Improver text={summary} context="summary" onAccept={setSummary} />}
    >
      <TextareaField
        label="Professional summary / objective"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        rows={4}
        placeholder="A concise, impactful summary of your experience and goals…"
      />
    </Collapsible>
  );
}
