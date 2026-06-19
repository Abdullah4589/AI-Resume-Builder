// Core resume domain types. Shared shape is mirrored in server/src/types/resume.ts.

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  location: string;
}

export interface WorkEntry {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  currentlyWorking: boolean;
  bullets: string[];
}

export interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  year: string;
  gpa: string;
}

export interface ProjectEntry {
  id: string;
  name: string;
  techStack: string;
  url: string;
  bullets: string[];
}

export interface CertEntry {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface CustomSection {
  id: string;
  heading: string;
  bullets: string[];
}

export type SectionId =
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'custom';

export interface ResumeData {
  personal: PersonalInfo;
  summary: string;
  experience: WorkEntry[];
  education: EducationEntry[];
  skills: string[];
  projects: ProjectEntry[];
  certifications: CertEntry[];
  customSections: CustomSection[];
}

export const SECTION_LABELS: Record<SectionId, string> = {
  summary: 'Summary',
  experience: 'Work Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
  custom: 'Custom Sections',
};

export const DEFAULT_SECTION_ORDER: SectionId[] = [
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
  'custom',
];

// ---- Customization ----

export type TemplateId = 'classic' | 'modern' | 'minimal';
export type FontId = 'Inter' | 'Georgia' | 'Merriweather' | 'Roboto Mono';
export type FontSize = 'small' | 'medium' | 'large';
export type Margin = 'compact' | 'normal' | 'spacious';

export interface Customization {
  template: TemplateId;
  font: FontId;
  accentColor: string;
  fontSize: FontSize;
  margin: Margin;
}

// ---- AI contracts ----

export interface BulletsResponse {
  bullets: string[];
}

export interface ImproveResponse {
  improved: string;
}

export type ImproveContext = 'summary' | 'bullet';

export interface ATSResult {
  score: number;
  missingKeywords: string[];
  suggestions: string[];
}
