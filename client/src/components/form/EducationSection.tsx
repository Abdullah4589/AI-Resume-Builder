import { GraduationCap, Plus } from 'lucide-react';
import { Collapsible } from '../ui/Collapsible';
import { Button } from '../ui/Button';
import { InputField } from '../ui/Field';
import { EntryCard } from './EntryCard';
import { useResumeStore } from '../../store/useResumeStore';

export function EducationSection({
  dragHandleProps,
}: {
  dragHandleProps?: Record<string, unknown>;
}) {
  const education = useResumeStore((s) => s.data.education);
  const add = useResumeStore((s) => s.addEducation);
  const update = useResumeStore((s) => s.updateEducation);
  const remove = useResumeStore((s) => s.removeEducation);

  return (
    <Collapsible title="Education" icon={<GraduationCap size={16} />} dragHandleProps={dragHandleProps}>
      <div className="space-y-3">
        {education.map((entry) => (
          <EntryCard key={entry.id} title={entry.degree || 'New entry'} onRemove={() => remove(entry.id)}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <InputField
                label="Degree"
                value={entry.degree}
                onChange={(e) => update(entry.id, { degree: e.target.value })}
                placeholder="B.S. Computer Science"
              />
              <InputField
                label="Institution"
                value={entry.institution}
                onChange={(e) => update(entry.id, { institution: e.target.value })}
                placeholder="University name"
              />
              <InputField
                label="Year"
                value={entry.year}
                onChange={(e) => update(entry.id, { year: e.target.value })}
                placeholder="2020"
              />
              <InputField
                label="GPA (optional)"
                value={entry.gpa}
                onChange={(e) => update(entry.id, { gpa: e.target.value })}
                placeholder="3.8"
              />
            </div>
          </EntryCard>
        ))}
        <Button variant="secondary" size="sm" onClick={add}>
          <Plus size={14} /> Add education
        </Button>
      </div>
    </Collapsible>
  );
}
