import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import type { SectionId } from '../../types/resume';
import { useResumeStore } from '../../store/useResumeStore';
import { SortableSection } from './SortableSection';
import { PersonalInfoSection } from './PersonalInfoSection';
import { SummarySection } from './SummarySection';
import { ExperienceSection } from './ExperienceSection';
import { EducationSection } from './EducationSection';
import { SkillsSection } from './SkillsSection';
import { ProjectsSection } from './ProjectsSection';
import { CertificationsSection } from './CertificationsSection';
import { CustomSectionsEditor } from './CustomSectionsEditor';

const SECTION_COMPONENTS: Record<
  SectionId,
  (props: { dragHandleProps?: Record<string, unknown> }) => JSX.Element
> = {
  summary: SummarySection,
  experience: ExperienceSection,
  education: EducationSection,
  skills: SkillsSection,
  projects: ProjectsSection,
  certifications: CertificationsSection,
  custom: CustomSectionsEditor,
};

export function FormPanel() {
  const sectionOrder = useResumeStore((s) => s.sectionOrder);
  const setSectionOrder = useResumeStore((s) => s.setSectionOrder);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = sectionOrder.indexOf(active.id as SectionId);
    const to = sectionOrder.indexOf(over.id as SectionId);
    if (from === -1 || to === -1) return;
    setSectionOrder(arrayMove(sectionOrder, from, to));
  }

  return (
    <div className="space-y-3">
      <PersonalInfoSection />
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {sectionOrder.map((id) => {
              const SectionComponent = SECTION_COMPONENTS[id];
              return (
                <SortableSection key={id} id={id}>
                  {(dragHandleProps) => <SectionComponent dragHandleProps={dragHandleProps} />}
                </SortableSection>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
