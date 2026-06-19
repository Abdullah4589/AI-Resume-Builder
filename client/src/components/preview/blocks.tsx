import type { ReactNode } from 'react';
import type { ResumeData, SectionId } from '../../types/resume';
import { dateRange, nonEmpty } from './formatters';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="r-section">
      <h2 className="r-section-title">{title}</h2>
      {children}
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  const filtered = nonEmpty(items);
  if (!filtered.length) return null;
  return (
    <ul className="r-bullets">
      {filtered.map((b, i) => (
        <li key={i}>{b}</li>
      ))}
    </ul>
  );
}

export function SummaryBlock({ data }: { data: ResumeData }) {
  if (!data.summary.trim()) return null;
  return (
    <Section title="Summary">
      <p className="r-summary">{data.summary}</p>
    </Section>
  );
}

export function ExperienceBlock({ data }: { data: ResumeData }) {
  if (!data.experience.length) return null;
  return (
    <Section title="Experience">
      {data.experience.map((e) => (
        <div className="r-entry" key={e.id}>
          <div className="r-entry-head">
            <div>
              <span className="r-entry-title">{e.jobTitle || 'Role'}</span>
              {e.company && <span className="r-entry-org"> · {e.company}</span>}
            </div>
            <span className="r-entry-meta">{dateRange(e)}</span>
          </div>
          {e.location && <div className="r-entry-sub">{e.location}</div>}
          <Bullets items={e.bullets} />
        </div>
      ))}
    </Section>
  );
}

export function EducationBlock({ data }: { data: ResumeData }) {
  if (!data.education.length) return null;
  return (
    <Section title="Education">
      {data.education.map((e) => (
        <div className="r-entry" key={e.id}>
          <div className="r-entry-head">
            <div>
              <span className="r-entry-title">{e.degree || 'Degree'}</span>
              {e.institution && <span className="r-entry-org"> · {e.institution}</span>}
            </div>
            <span className="r-entry-meta">{e.year}</span>
          </div>
          {e.gpa && <div className="r-entry-sub">GPA: {e.gpa}</div>}
        </div>
      ))}
    </Section>
  );
}

export function SkillsBlock({ data }: { data: ResumeData }) {
  if (!data.skills.length) return null;
  return (
    <Section title="Skills">
      <div className="r-skills">
        {data.skills.map((s) => (
          <span className="r-skill" key={s}>
            {s}
          </span>
        ))}
      </div>
    </Section>
  );
}

export function ProjectsBlock({ data }: { data: ResumeData }) {
  if (!data.projects.length) return null;
  return (
    <Section title="Projects">
      {data.projects.map((p) => (
        <div className="r-entry" key={p.id}>
          <div className="r-entry-head">
            <div>
              <span className="r-entry-title">{p.name || 'Project'}</span>
              {p.techStack && <span className="r-entry-org"> · {p.techStack}</span>}
            </div>
            {p.url && <span className="r-entry-meta">{p.url}</span>}
          </div>
          <Bullets items={p.bullets} />
        </div>
      ))}
    </Section>
  );
}

export function CertificationsBlock({ data }: { data: ResumeData }) {
  if (!data.certifications.length) return null;
  return (
    <Section title="Certifications">
      {data.certifications.map((c) => (
        <div className="r-entry r-entry-compact" key={c.id}>
          <div className="r-entry-head">
            <div>
              <span className="r-entry-title">{c.name || 'Certification'}</span>
              {c.issuer && <span className="r-entry-org"> · {c.issuer}</span>}
            </div>
            <span className="r-entry-meta">{c.year}</span>
          </div>
        </div>
      ))}
    </Section>
  );
}

export function CustomBlock({ data }: { data: ResumeData }) {
  const sections = data.customSections.filter((c) => c.heading.trim() || nonEmpty(c.bullets).length);
  if (!sections.length) return null;
  return (
    <>
      {sections.map((c) => (
        <Section title={c.heading || 'Section'} key={c.id}>
          <Bullets items={c.bullets} />
        </Section>
      ))}
    </>
  );
}

const BLOCKS: Record<SectionId, (props: { data: ResumeData }) => ReactNode> = {
  summary: SummaryBlock,
  experience: ExperienceBlock,
  education: EducationBlock,
  skills: SkillsBlock,
  projects: ProjectsBlock,
  certifications: CertificationsBlock,
  custom: CustomBlock,
};

export function renderSection(id: SectionId, data: ResumeData): ReactNode {
  const Block = BLOCKS[id];
  return <Block data={data} key={id} />;
}
