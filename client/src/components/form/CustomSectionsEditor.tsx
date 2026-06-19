import { LayoutList, Plus } from 'lucide-react';
import { Collapsible } from '../ui/Collapsible';
import { Button } from '../ui/Button';
import { InputField } from '../ui/Field';
import { EntryCard } from './EntryCard';
import { BulletListEditor } from './BulletListEditor';
import { useResumeStore } from '../../store/useResumeStore';

export function CustomSectionsEditor({
  dragHandleProps,
}: {
  dragHandleProps?: Record<string, unknown>;
}) {
  const customSections = useResumeStore((s) => s.data.customSections);
  const add = useResumeStore((s) => s.addCustomSection);
  const update = useResumeStore((s) => s.updateCustomSection);
  const remove = useResumeStore((s) => s.removeCustomSection);
  const addBullet = useResumeStore((s) => s.addCustomBullet);
  const updateBullet = useResumeStore((s) => s.updateCustomBullet);
  const removeBullet = useResumeStore((s) => s.removeCustomBullet);

  return (
    <Collapsible title="Custom Sections" icon={<LayoutList size={16} />} dragHandleProps={dragHandleProps}>
      <div className="space-y-3">
        {customSections.map((entry) => (
          <EntryCard key={entry.id} title={entry.heading || 'Custom'} onRemove={() => remove(entry.id)}>
            <InputField
              label="Section heading"
              value={entry.heading}
              onChange={(e) => update(entry.id, { heading: e.target.value })}
              placeholder="e.g. Volunteering, Awards, Publications"
            />
            <BulletListEditor
              bullets={entry.bullets}
              onAdd={() => addBullet(entry.id)}
              onChange={(i, v) => updateBullet(entry.id, i, v)}
              onRemove={(i) => removeBullet(entry.id, i)}
            />
          </EntryCard>
        ))}
        <Button variant="secondary" size="sm" onClick={add}>
          <Plus size={14} /> Add custom section
        </Button>
      </div>
    </Collapsible>
  );
}
