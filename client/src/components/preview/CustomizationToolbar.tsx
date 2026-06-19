import type { FontId, FontSize, Margin, TemplateId } from '../../types/resume';
import { useCustomizationStore, ACCENT_PRESETS } from '../../store/useCustomizationStore';
import { cn } from '../../lib/cn';

const TEMPLATES: { id: TemplateId; label: string }[] = [
  { id: 'classic', label: 'Classic' },
  { id: 'modern', label: 'Modern' },
  { id: 'minimal', label: 'Minimal' },
];

const FONTS: FontId[] = ['Inter', 'Georgia', 'Merriweather', 'Roboto Mono'];
const SIZES: { id: FontSize; label: string }[] = [
  { id: 'small', label: 'S' },
  { id: 'medium', label: 'M' },
  { id: 'large', label: 'L' },
];
const MARGINS: { id: Margin; label: string }[] = [
  { id: 'compact', label: 'Compact' },
  { id: 'normal', label: 'Normal' },
  { id: 'spacious', label: 'Spacious' },
];

function ControlGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] font-medium uppercase tracking-wide text-muted">{label}</span>
      {children}
    </div>
  );
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex overflow-hidden rounded-md border border-border">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={cn(
            'px-2.5 py-1 text-xs font-medium transition-colors',
            value === o.id ? 'bg-accent text-white' : 'bg-[#10131c] text-gray-300 hover:bg-[#1c2030]'
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function CustomizationToolbar() {
  const {
    template,
    font,
    accentColor,
    fontSize,
    margin,
    setTemplate,
    setFont,
    setAccentColor,
    setFontSize,
    setMargin,
  } = useCustomizationStore();

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-border bg-sidebar px-4 py-2.5">
      <Segmented options={TEMPLATES} value={template} onChange={setTemplate} />

      <ControlGroup label="Font">
        <select
          value={font}
          onChange={(e) => setFont(e.target.value as FontId)}
          className="rounded-md border border-border bg-[#10131c] px-2 py-1 text-xs text-gray-200 focus:border-accent/60 focus:outline-none"
        >
          {FONTS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </ControlGroup>

      <ControlGroup label="Accent">
        <div className="flex items-center gap-1">
          {ACCENT_PRESETS.map((c) => (
            <button
              key={c}
              onClick={() => setAccentColor(c)}
              title={c}
              aria-label={`Accent ${c}`}
              className={cn(
                'h-5 w-5 rounded-full border transition-transform hover:scale-110',
                accentColor.toLowerCase() === c.toLowerCase()
                  ? 'border-white ring-2 ring-accent/50'
                  : 'border-black/20'
              )}
              style={{ background: c }}
            />
          ))}
          <input
            type="color"
            value={accentColor}
            onChange={(e) => setAccentColor(e.target.value)}
            title="Custom color"
            aria-label="Custom accent color"
            className="h-5 w-6 cursor-pointer rounded border border-border bg-transparent p-0"
          />
        </div>
      </ControlGroup>

      <ControlGroup label="Size">
        <Segmented options={SIZES} value={fontSize} onChange={setFontSize} />
      </ControlGroup>

      <ControlGroup label="Margin">
        <Segmented options={MARGINS} value={margin} onChange={setMargin} />
      </ControlGroup>
    </div>
  );
}
