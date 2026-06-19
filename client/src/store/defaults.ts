import type { ResumeData } from '../types/resume';
import { uid } from '../lib/id';

// A lightly pre-filled sample so the live preview is meaningful on first load.
export function createSampleResume(): ResumeData {
  return {
    personal: {
      fullName: 'Alex Morgan',
      email: 'alex.morgan@email.com',
      phone: '(555) 123-4567',
      linkedin: 'linkedin.com/in/alexmorgan',
      github: 'github.com/alexmorgan',
      location: 'San Francisco, CA',
    },
    summary:
      'Full-stack engineer with 5+ years building performant web applications. Passionate about clean architecture, developer experience, and shipping products that users love.',
    experience: [
      {
        id: uid(),
        jobTitle: 'Senior Software Engineer',
        company: 'Northwind Labs',
        location: 'San Francisco, CA',
        startMonth: 'Jan',
        startYear: '2022',
        endMonth: '',
        endYear: '',
        currentlyWorking: true,
        bullets: [
          'Led migration of monolith to microservices, cutting deploy time by 60%.',
          'Built a real-time analytics dashboard serving 40K+ daily active users.',
        ],
      },
    ],
    education: [
      {
        id: uid(),
        degree: 'B.S. Computer Science',
        institution: 'University of California, Berkeley',
        year: '2018',
        gpa: '3.8',
      },
    ],
    skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
    projects: [
      {
        id: uid(),
        name: 'OpenSchedule',
        techStack: 'React, Express, PostgreSQL',
        url: 'github.com/alexmorgan/openschedule',
        bullets: ['Open-source team scheduling tool with 1.2K GitHub stars.'],
      },
    ],
    certifications: [
      {
        id: uid(),
        name: 'AWS Solutions Architect – Associate',
        issuer: 'Amazon Web Services',
        year: '2023',
      },
    ],
    customSections: [],
  };
}

export function createEmptyResume(): ResumeData {
  return {
    personal: {
      fullName: '',
      email: '',
      phone: '',
      linkedin: '',
      github: '',
      location: '',
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    customSections: [],
  };
}

export function createWorkEntry() {
  return {
    id: uid(),
    jobTitle: '',
    company: '',
    location: '',
    startMonth: '',
    startYear: '',
    endMonth: '',
    endYear: '',
    currentlyWorking: false,
    bullets: [''],
  };
}

export function createEducationEntry() {
  return { id: uid(), degree: '', institution: '', year: '', gpa: '' };
}

export function createProjectEntry() {
  return { id: uid(), name: '', techStack: '', url: '', bullets: [''] };
}

export function createCertEntry() {
  return { id: uid(), name: '', issuer: '', year: '' };
}

export function createCustomSection() {
  return { id: uid(), heading: 'Custom Section', bullets: [''] };
}
