import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Customization, TemplateId, FontId, FontSize, Margin } from '../types/resume';

interface CustomizationState extends Customization {
  setTemplate: (template: TemplateId) => void;
  setFont: (font: FontId) => void;
  setAccentColor: (color: string) => void;
  setFontSize: (size: FontSize) => void;
  setMargin: (margin: Margin) => void;
}

export const ACCENT_PRESETS: string[] = [
  '#6c63ff',
  '#2563eb',
  '#0ea5e9',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#ec4899',
  '#475569',
];

export const useCustomizationStore = create<CustomizationState>()(
  persist(
    (set) => ({
      template: 'classic',
      font: 'Inter',
      accentColor: '#6c63ff',
      fontSize: 'medium',
      margin: 'normal',
      setTemplate: (template) => set({ template }),
      setFont: (font) => set({ font }),
      setAccentColor: (accentColor) => set({ accentColor }),
      setFontSize: (fontSize) => set({ fontSize }),
      setMargin: (margin) => set({ margin }),
    }),
    {
      name: 'resume-customization',
      version: 1,
    }
  )
);
