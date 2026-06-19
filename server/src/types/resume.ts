// Mirror of client/src/types/resume.ts — keep in sync. Server only needs the
// ResumeData shape (for the ATS route) plus the AI response contracts.

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

export interface ATSResult {
  score: number;
  missingKeywords: string[];
  suggestions: string[];
}
