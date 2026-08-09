import { useState, type ReactNode } from 'react';
import { ChevronDown, GripVertical } from 'lucide-react';
import { cn } from '../../lib/cn';

interface CollapsibleProps {
  title: string;
  icon?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
  /** Props spread onto the drag handle (from dnd-kit). */
  dragHandleProps?: Record<string, unknown>;
  headerRight?: ReactNode;
  /** Stable hook for tests. */
  testId?: string;
}

export function Collapsible({
  title,
  icon,
  defaultOpen = true,
  children,
  dragHandleProps,
  headerRight,
  testId,
}: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section data-testid={testId} className="overflow-hidden rounded-lg border border-border bg-panel">
      <div className="flex items-center gap-1 px-2 py-2.5">
        {dragHandleProps && (
          <button
            type="button"
            className="cursor-grab rounded p-1 text-muted transition-colors hover:text-gray-300 active:cursor-grabbing"
            aria-label="Drag to reorder"
            {...dragHandleProps}
          >
            <GripVertical size={16} />
          </button>
        )}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex flex-1 items-center gap-2 rounded px-1 py-1 text-left transition-colors hover:bg-[#1c2030]"
        >
          {icon && <span className="text-accent">{icon}</span>}
          <span className="text-sm font-semibold text-gray-100">{title}</span>
          <ChevronDown
            size={16}
            className={cn(
              'ml-auto text-muted transition-transform duration-150',
              open && 'rotate-180'
            )}
          />
        </button>
        {headerRight}
      </div>
      {open && <div className="border-t border-border px-4 py-4">{children}</div>}
    </section>
  );
}
