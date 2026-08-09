import { User } from 'lucide-react';
import { Collapsible } from '../ui/Collapsible';
import { InputField } from '../ui/Field';
import { useResumeStore } from '../../store/useResumeStore';

export function PersonalInfoSection() {
  const personal = useResumeStore((s) => s.data.personal);
  const updatePersonal = useResumeStore((s) => s.updatePersonal);

  return (
    <Collapsible title="Personal Info" icon={<User size={16} />} testId="section-personal">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <InputField
          label="Full name"
          value={personal.fullName}
          onChange={(e) => updatePersonal({ fullName: e.target.value })}
          placeholder="Jane Doe"
        />
        <InputField
          label="Location"
          value={personal.location}
          onChange={(e) => updatePersonal({ location: e.target.value })}
          placeholder="City, Country"
        />
        <InputField
          label="Email"
          type="email"
          value={personal.email}
          onChange={(e) => updatePersonal({ email: e.target.value })}
          placeholder="jane@email.com"
        />
        <InputField
          label="Phone"
          value={personal.phone}
          onChange={(e) => updatePersonal({ phone: e.target.value })}
          placeholder="(555) 000-0000"
        />
        <InputField
          label="LinkedIn"
          value={personal.linkedin}
          onChange={(e) => updatePersonal({ linkedin: e.target.value })}
          placeholder="linkedin.com/in/…"
        />
        <InputField
          label="GitHub"
          value={personal.github}
          onChange={(e) => updatePersonal({ github: e.target.value })}
          placeholder="github.com/…"
        />
      </div>
    </Collapsible>
  );
}
