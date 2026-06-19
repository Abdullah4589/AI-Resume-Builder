import type { ResumeData, SectionId } from '../../../types/resume';
import { renderSection, SkillsBlock, CertificationsBlock } from '../blocks';
import { nonEmpty } from '../formatters';

interface TemplateProps {
  data: ResumeData;
  sectionOrder: SectionId[];
}

// In Modern, skills + certifications live in the sidebar; everything else flows
// through the main column in the user's chosen order.
const SIDEBAR_SECTIONS: SectionId[] = ['skills', 'certifications'];

export function ModernTemplate({ data, sectionOrder }: TemplateProps) {
  const { personal } = data;
  const contacts = nonEmpty([
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedin,
    personal.github,
  ]);
  const mainSections = sectionOrder.filter((id) => !SIDEBAR_SECTIONS.includes(id));

  return (
    <div className="r-doc t-modern">
      <div className="r-accent-strip" />
      <div className="r-cols">
        <aside className="r-sidebar">
          <h1 className="r-name">{personal.fullName || 'Your Name'}</h1>
          {contacts.length > 0 && (
            <div className="r-contact-block">
              {contacts.map((c, i) => (
                <div className="r-contact-line" key={i}>
                  {c}
                </div>
              ))}
            </div>
          )}
          <SkillsBlock data={data} />
          <CertificationsBlock data={data} />
        </aside>
        <main className="r-main">{mainSections.map((id) => renderSection(id, data))}</main>
      </div>
    </div>
  );
}
