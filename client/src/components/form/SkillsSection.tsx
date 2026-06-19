import { useState, type KeyboardEvent } from 'react';
import { Wrench } from 'lucide-react';
import { Collapsible } from '../ui/Collapsible';
import { Tag } from '../ui/Tag';
import { useResumeStore } from '../../store/useResumeStore';

export function SkillsSection({ dragHandleProps }: { dragHandleProps?: Record<string, unknown> }) {
  const skills = useResumeStore((s) => s.data.skills);
  const addSkill = useResumeStore((s) => s.addSkill);
  const removeSkill = useResumeStore((s) => s.removeSkill);
  const [value, setValue] = useState('');

  function commit() {
    if (value.trim()) {
      addSkill(value);
      setValue('');
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commit();
    } else if (e.key === 'Backspace' && !value && skills.length) {
      removeSkill(skills[skills.length - 1]);
    }
  }

  return (
    <Collapsible title="Skills" icon={<Wrench size={16} />} dragHandleProps={dragHandleProps}>
      <div className="space-y-3">
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill) => (
              <Tag key={skill} label={skill} onRemove={() => removeSkill(skill)} />
            ))}
          </div>
        )}
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={commit}
          placeholder="Type a skill and press Enter…"
          className="w-full rounded-md border border-border bg-[#10131c] px-3 py-2 text-sm text-gray-100 placeholder:text-muted/70 transition-colors focus:border-accent/60 focus:outline-none focus:ring-1 focus:ring-accent/40"
        />
      </div>
    </Collapsible>
  );
}
