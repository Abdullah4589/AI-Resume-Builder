import { forwardRef } from 'react';
import type { Customization, ResumeData, SectionId } from '../../types/resume';
import { resumeCSSVars, PAGE_WIDTH, PAGE_MIN_HEIGHT } from './previewVars';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { ModernTemplate } from './templates/ModernTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';

interface ResumeDocumentProps {
  data: ResumeData;
  sectionOrder: SectionId[];
  customization: Customization;
}

/** Stable id so the document can be located for PDF serialization. */
export const RESUME_PAGE_ID = 'resume-page';

export const ResumeDocument = forwardRef<HTMLDivElement, ResumeDocumentProps>(
  function ResumeDocument({ data, sectionOrder, customization }, ref) {
    const Template =
      customization.template === 'modern'
        ? ModernTemplate
        : customization.template === 'minimal'
          ? MinimalTemplate
          : ClassicTemplate;

    return (
      <div
        ref={ref}
        id={RESUME_PAGE_ID}
        className="resume-page"
        style={{
          ...resumeCSSVars(customization),
          width: PAGE_WIDTH,
          minHeight: PAGE_MIN_HEIGHT,
          background: '#ffffff',
        }}
      >
        <Template data={data} sectionOrder={sectionOrder} />
      </div>
    );
  }
);
