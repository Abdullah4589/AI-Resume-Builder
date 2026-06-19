import type { ResumeData, SectionId } from '../../../types/resume';
import { ResumeHeader } from '../ResumeHeader';
import { renderSection } from '../blocks';

interface TemplateProps {
  data: ResumeData;
  sectionOrder: SectionId[];
}

export function ClassicTemplate({ data, sectionOrder }: TemplateProps) {
  return (
    <div className="r-doc t-classic">
      <ResumeHeader personal={data.personal} />
      <div className="r-body">{sectionOrder.map((id) => renderSection(id, data))}</div>
    </div>
  );
}
