import type { PersonalInfo } from '../../types/resume';
import { nonEmpty } from './formatters';

export function ResumeHeader({ personal }: { personal: PersonalInfo }) {
  const contacts = nonEmpty([
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedin,
    personal.github,
  ]);
  return (
    <header className="r-header">
      <h1 className="r-name">{personal.fullName || 'Your Name'}</h1>
      {contacts.length > 0 && (
        <div className="r-contact">
          {contacts.map((c, i) => (
            <span className="r-contact-item" key={i}>
              {c}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}
