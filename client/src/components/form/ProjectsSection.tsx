import { FolderGit2, Plus } from 'lucide-react';
import { Collapsible } from '../ui/Collapsible';
import { Button } from '../ui/Button';
import { InputField } from '../ui/Field';
import { EntryCard } from './EntryCard';
import { BulletListEditor } from './BulletListEditor';
import { BulletGenerator } from '../ai/BulletGenerator';
import { useResumeStore } from '../../store/useResumeStore';

export function ProjectsSection({ dragHandleProps }: { dragHandleProps?: Record<string, unknown> }) {
  const projects = useResumeStore((s) => s.data.projects);
  const add = useResumeStore((s) => s.addProject);
  const update = useResumeStore((s) => s.updateProject);
  const remove = useResumeStore((s) => s.removeProject);
  const addBullet = useResumeStore((s) => s.addProjectBullet);
  const appendBullet = useResumeStore((s) => s.appendProjectBullet);
  const updateBullet = useResumeStore((s) => s.updateProjectBullet);
  const removeBullet = useResumeStore((s) => s.removeProjectBullet);

  return (
    <Collapsible title="Projects" icon={<FolderGit2 size={16} />} dragHandleProps={dragHandleProps}>
      <div className="space-y-3">
        {projects.map((entry) => (
          <EntryCard key={entry.id} title={entry.name || 'New project'} onRemove={() => remove(entry.id)}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <InputField
                label="Project name"
                value={entry.name}
                onChange={(e) => update(entry.id, { name: e.target.value })}
                placeholder="OpenSchedule"
              />
              <InputField
                label="Tech stack"
                value={entry.techStack}
                onChange={(e) => update(entry.id, { techStack: e.target.value })}
                placeholder="React, Node, Postgres"
              />
              <InputField
                label="URL (optional)"
                value={entry.url}
                onChange={(e) => update(entry.id, { url: e.target.value })}
                placeholder="github.com/…"
                className="sm:col-span-2"
              />
            </div>

            <BulletListEditor
              bullets={entry.bullets}
              onAdd={() => addBullet(entry.id)}
              onChange={(i, v) => updateBullet(entry.id, i, v)}
              onRemove={(i) => removeBullet(entry.id, i)}
            />

            <BulletGenerator
              jobTitle={entry.name}
              company={entry.techStack}
              onAccept={(bullet) => appendBullet(entry.id, bullet)}
            />
          </EntryCard>
        ))}
        <Button variant="secondary" size="sm" onClick={add}>
          <Plus size={14} /> Add project
        </Button>
      </div>
    </Collapsible>
  );
}
