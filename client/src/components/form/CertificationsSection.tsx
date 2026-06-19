import { Award, Plus } from 'lucide-react';
import { Collapsible } from '../ui/Collapsible';
import { Button } from '../ui/Button';
import { InputField } from '../ui/Field';
import { EntryCard } from './EntryCard';
import { useResumeStore } from '../../store/useResumeStore';

export function CertificationsSection({
  dragHandleProps,
}: {
  dragHandleProps?: Record<string, unknown>;
}) {
  const certifications = useResumeStore((s) => s.data.certifications);
  const add = useResumeStore((s) => s.addCertification);
  const update = useResumeStore((s) => s.updateCertification);
  const remove = useResumeStore((s) => s.removeCertification);

  return (
    <Collapsible title="Certifications" icon={<Award size={16} />} dragHandleProps={dragHandleProps}>
      <div className="space-y-3">
        {certifications.map((entry) => (
          <EntryCard key={entry.id} title={entry.name || 'New certification'} onRemove={() => remove(entry.id)}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <InputField
                label="Name"
                value={entry.name}
                onChange={(e) => update(entry.id, { name: e.target.value })}
                placeholder="AWS Solutions Architect"
                className="sm:col-span-1"
              />
              <InputField
                label="Issuer"
                value={entry.issuer}
                onChange={(e) => update(entry.id, { issuer: e.target.value })}
                placeholder="Amazon Web Services"
              />
              <InputField
                label="Year"
                value={entry.year}
                onChange={(e) => update(entry.id, { year: e.target.value })}
                placeholder="2023"
              />
            </div>
          </EntryCard>
        ))}
        <Button variant="secondary" size="sm" onClick={add}>
          <Plus size={14} /> Add certification
        </Button>
      </div>
    </Collapsible>
  );
}
