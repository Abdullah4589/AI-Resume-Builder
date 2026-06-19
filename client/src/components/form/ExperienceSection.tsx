import { Briefcase, Plus } from 'lucide-react';
import { Collapsible } from '../ui/Collapsible';
import { Button } from '../ui/Button';
import { InputField } from '../ui/Field';
import { EntryCard } from './EntryCard';
import { BulletListEditor } from './BulletListEditor';
import { MonthYearPicker } from './MonthYearPicker';
import { BulletGenerator } from '../ai/BulletGenerator';
import { useResumeStore } from '../../store/useResumeStore';

export function ExperienceSection({
  dragHandleProps,
}: {
  dragHandleProps?: Record<string, unknown>;
}) {
  const experience = useResumeStore((s) => s.data.experience);
  const add = useResumeStore((s) => s.addExperience);
  const update = useResumeStore((s) => s.updateExperience);
  const remove = useResumeStore((s) => s.removeExperience);
  const addBullet = useResumeStore((s) => s.addExperienceBullet);
  const appendBullet = useResumeStore((s) => s.appendExperienceBullet);
  const updateBullet = useResumeStore((s) => s.updateExperienceBullet);
  const removeBullet = useResumeStore((s) => s.removeExperienceBullet);

  return (
    <Collapsible title="Work Experience" icon={<Briefcase size={16} />} dragHandleProps={dragHandleProps}>
      <div className="space-y-3">
        {experience.map((entry) => (
          <EntryCard key={entry.id} title={entry.jobTitle || 'New role'} onRemove={() => remove(entry.id)}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <InputField
                label="Job title"
                value={entry.jobTitle}
                onChange={(e) => update(entry.id, { jobTitle: e.target.value })}
                placeholder="Software Engineer"
              />
              <InputField
                label="Company"
                value={entry.company}
                onChange={(e) => update(entry.id, { company: e.target.value })}
                placeholder="Acme Inc."
              />
              <InputField
                label="Location"
                value={entry.location}
                onChange={(e) => update(entry.id, { location: e.target.value })}
                placeholder="Remote / City"
              />
              <div />
              <MonthYearPicker
                label="Start"
                month={entry.startMonth}
                year={entry.startYear}
                onMonth={(v) => update(entry.id, { startMonth: v })}
                onYear={(v) => update(entry.id, { startYear: v })}
              />
              <MonthYearPicker
                label="End"
                month={entry.endMonth}
                year={entry.endYear}
                onMonth={(v) => update(entry.id, { endMonth: v })}
                onYear={(v) => update(entry.id, { endYear: v })}
                disabled={entry.currentlyWorking}
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={entry.currentlyWorking}
                onChange={(e) => update(entry.id, { currentlyWorking: e.target.checked })}
                className="h-4 w-4 accent-accent"
              />
              I currently work here
            </label>

            <BulletListEditor
              bullets={entry.bullets}
              onAdd={() => addBullet(entry.id)}
              onChange={(i, v) => updateBullet(entry.id, i, v)}
              onRemove={(i) => removeBullet(entry.id, i)}
            />

            <BulletGenerator
              jobTitle={entry.jobTitle}
              company={entry.company}
              onAccept={(bullet) => appendBullet(entry.id, bullet)}
            />
          </EntryCard>
        ))}
        <Button variant="secondary" size="sm" onClick={add}>
          <Plus size={14} /> Add experience
        </Button>
      </div>
    </Collapsible>
  );
}
