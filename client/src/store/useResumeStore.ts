import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  ResumeData,
  SectionId,
  PersonalInfo,
  WorkEntry,
  EducationEntry,
  ProjectEntry,
  CertEntry,
  CustomSection,
} from '../types/resume';
import { DEFAULT_SECTION_ORDER } from '../types/resume';
import {
  createSampleResume,
  createWorkEntry,
  createEducationEntry,
  createProjectEntry,
  createCertEntry,
  createCustomSection,
} from './defaults';

interface ResumeState {
  data: ResumeData;
  sectionOrder: SectionId[];

  // Personal + summary
  updatePersonal: (patch: Partial<PersonalInfo>) => void;
  setSummary: (value: string) => void;

  // Experience
  addExperience: () => void;
  updateExperience: (id: string, patch: Partial<WorkEntry>) => void;
  removeExperience: (id: string) => void;
  addExperienceBullet: (id: string) => void;
  appendExperienceBullet: (id: string, value: string) => void;
  updateExperienceBullet: (id: string, index: number, value: string) => void;
  removeExperienceBullet: (id: string, index: number) => void;

  // Education
  addEducation: () => void;
  updateEducation: (id: string, patch: Partial<EducationEntry>) => void;
  removeEducation: (id: string) => void;

  // Skills
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;

  // Projects
  addProject: () => void;
  updateProject: (id: string, patch: Partial<ProjectEntry>) => void;
  removeProject: (id: string) => void;
  addProjectBullet: (id: string) => void;
  appendProjectBullet: (id: string, value: string) => void;
  updateProjectBullet: (id: string, index: number, value: string) => void;
  removeProjectBullet: (id: string, index: number) => void;

  // Certifications
  addCertification: () => void;
  updateCertification: (id: string, patch: Partial<CertEntry>) => void;
  removeCertification: (id: string) => void;

  // Custom sections
  addCustomSection: () => void;
  updateCustomSection: (id: string, patch: Partial<CustomSection>) => void;
  removeCustomSection: (id: string) => void;
  addCustomBullet: (id: string) => void;
  updateCustomBullet: (id: string, index: number, value: string) => void;
  removeCustomBullet: (id: string, index: number) => void;

  // Section order
  setSectionOrder: (order: SectionId[]) => void;

  resetAll: () => void;
}

function patchBullets(bullets: string[], index: number, value: string): string[] {
  return bullets.map((b, i) => (i === index ? value : b));
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      data: createSampleResume(),
      sectionOrder: DEFAULT_SECTION_ORDER,

      updatePersonal: (patch) =>
        set((s) => ({ data: { ...s.data, personal: { ...s.data.personal, ...patch } } })),
      setSummary: (value) => set((s) => ({ data: { ...s.data, summary: value } })),

      addExperience: () =>
        set((s) => ({ data: { ...s.data, experience: [...s.data.experience, createWorkEntry()] } })),
      updateExperience: (id, patch) =>
        set((s) => ({
          data: {
            ...s.data,
            experience: s.data.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)),
          },
        })),
      removeExperience: (id) =>
        set((s) => ({
          data: { ...s.data, experience: s.data.experience.filter((e) => e.id !== id) },
        })),
      addExperienceBullet: (id) =>
        set((s) => ({
          data: {
            ...s.data,
            experience: s.data.experience.map((e) =>
              e.id === id ? { ...e, bullets: [...e.bullets, ''] } : e
            ),
          },
        })),
      appendExperienceBullet: (id, value) =>
        set((s) => ({
          data: {
            ...s.data,
            experience: s.data.experience.map((e) =>
              e.id === id ? { ...e, bullets: [...e.bullets, value] } : e
            ),
          },
        })),
      updateExperienceBullet: (id, index, value) =>
        set((s) => ({
          data: {
            ...s.data,
            experience: s.data.experience.map((e) =>
              e.id === id ? { ...e, bullets: patchBullets(e.bullets, index, value) } : e
            ),
          },
        })),
      removeExperienceBullet: (id, index) =>
        set((s) => ({
          data: {
            ...s.data,
            experience: s.data.experience.map((e) =>
              e.id === id ? { ...e, bullets: e.bullets.filter((_, i) => i !== index) } : e
            ),
          },
        })),

      addEducation: () =>
        set((s) => ({ data: { ...s.data, education: [...s.data.education, createEducationEntry()] } })),
      updateEducation: (id, patch) =>
        set((s) => ({
          data: {
            ...s.data,
            education: s.data.education.map((e) => (e.id === id ? { ...e, ...patch } : e)),
          },
        })),
      removeEducation: (id) =>
        set((s) => ({
          data: { ...s.data, education: s.data.education.filter((e) => e.id !== id) },
        })),

      addSkill: (skill) =>
        set((s) => {
          const trimmed = skill.trim();
          if (!trimmed || s.data.skills.includes(trimmed)) return s;
          return { data: { ...s.data, skills: [...s.data.skills, trimmed] } };
        }),
      removeSkill: (skill) =>
        set((s) => ({ data: { ...s.data, skills: s.data.skills.filter((k) => k !== skill) } })),

      addProject: () =>
        set((s) => ({ data: { ...s.data, projects: [...s.data.projects, createProjectEntry()] } })),
      updateProject: (id, patch) =>
        set((s) => ({
          data: {
            ...s.data,
            projects: s.data.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
          },
        })),
      removeProject: (id) =>
        set((s) => ({ data: { ...s.data, projects: s.data.projects.filter((p) => p.id !== id) } })),
      addProjectBullet: (id) =>
        set((s) => ({
          data: {
            ...s.data,
            projects: s.data.projects.map((p) =>
              p.id === id ? { ...p, bullets: [...p.bullets, ''] } : p
            ),
          },
        })),
      appendProjectBullet: (id, value) =>
        set((s) => ({
          data: {
            ...s.data,
            projects: s.data.projects.map((p) =>
              p.id === id ? { ...p, bullets: [...p.bullets, value] } : p
            ),
          },
        })),
      updateProjectBullet: (id, index, value) =>
        set((s) => ({
          data: {
            ...s.data,
            projects: s.data.projects.map((p) =>
              p.id === id ? { ...p, bullets: patchBullets(p.bullets, index, value) } : p
            ),
          },
        })),
      removeProjectBullet: (id, index) =>
        set((s) => ({
          data: {
            ...s.data,
            projects: s.data.projects.map((p) =>
              p.id === id ? { ...p, bullets: p.bullets.filter((_, i) => i !== index) } : p
            ),
          },
        })),

      addCertification: () =>
        set((s) => ({
          data: { ...s.data, certifications: [...s.data.certifications, createCertEntry()] },
        })),
      updateCertification: (id, patch) =>
        set((s) => ({
          data: {
            ...s.data,
            certifications: s.data.certifications.map((c) => (c.id === id ? { ...c, ...patch } : c)),
          },
        })),
      removeCertification: (id) =>
        set((s) => ({
          data: { ...s.data, certifications: s.data.certifications.filter((c) => c.id !== id) },
        })),

      addCustomSection: () =>
        set((s) => ({
          data: { ...s.data, customSections: [...s.data.customSections, createCustomSection()] },
        })),
      updateCustomSection: (id, patch) =>
        set((s) => ({
          data: {
            ...s.data,
            customSections: s.data.customSections.map((c) => (c.id === id ? { ...c, ...patch } : c)),
          },
        })),
      removeCustomSection: (id) =>
        set((s) => ({
          data: { ...s.data, customSections: s.data.customSections.filter((c) => c.id !== id) },
        })),
      addCustomBullet: (id) =>
        set((s) => ({
          data: {
            ...s.data,
            customSections: s.data.customSections.map((c) =>
              c.id === id ? { ...c, bullets: [...c.bullets, ''] } : c
            ),
          },
        })),
      updateCustomBullet: (id, index, value) =>
        set((s) => ({
          data: {
            ...s.data,
            customSections: s.data.customSections.map((c) =>
              c.id === id ? { ...c, bullets: patchBullets(c.bullets, index, value) } : c
            ),
          },
        })),
      removeCustomBullet: (id, index) =>
        set((s) => ({
          data: {
            ...s.data,
            customSections: s.data.customSections.map((c) =>
              c.id === id ? { ...c, bullets: c.bullets.filter((_, i) => i !== index) } : c
            ),
          },
        })),

      setSectionOrder: (order) => set({ sectionOrder: order }),

      resetAll: () => set({ data: createSampleResume(), sectionOrder: DEFAULT_SECTION_ORDER }),
    }),
    {
      name: 'resume-data',
      version: 1,
    }
  )
);
