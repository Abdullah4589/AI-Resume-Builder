import { useResumeStore } from '../../store/useResumeStore';
import { useCustomizationStore } from '../../store/useCustomizationStore';
import { useFitScale } from '../../hooks/useFitScale';
import { ResumeDocument } from './ResumeDocument';
import { RESUME_CSS } from './resumeStyles';
import { PAGE_WIDTH } from './previewVars';

export function LivePreview() {
  const data = useResumeStore((s) => s.data);
  const sectionOrder = useResumeStore((s) => s.sectionOrder);
  const customization = useCustomizationStore((s) => s);
  const { containerRef, pageRef, scale, scaledHeight } = useFitScale();

  return (
    <>
      <style>{RESUME_CSS}</style>
      <div ref={containerRef} className="resume-surface flex h-full justify-center overflow-y-auto px-6 py-6">
        <div style={{ height: scaledHeight || undefined, width: PAGE_WIDTH * scale }}>
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              transition: 'transform 180ms ease',
            }}
          >
            <div className="shadow-2xl" style={{ borderRadius: 2, overflow: 'hidden' }}>
              <ResumeDocument
                ref={pageRef}
                data={data}
                sectionOrder={sectionOrder}
                customization={{
                  template: customization.template,
                  font: customization.font,
                  accentColor: customization.accentColor,
                  fontSize: customization.fontSize,
                  margin: customization.margin,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
