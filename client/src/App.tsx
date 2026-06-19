import { FileText } from 'lucide-react';
import { ToastProvider } from './components/ui/Toast';
import { FormPanel } from './components/form/FormPanel';
import { LivePreview } from './components/preview/LivePreview';
import { CustomizationToolbar } from './components/preview/CustomizationToolbar';
import { ATSOptimizer } from './components/ai/ATSOptimizer';
import { DownloadPdfButton } from './components/DownloadPdfButton';

export default function App() {
  return (
    <ToastProvider>
      <div className="flex h-screen flex-col bg-shell text-gray-100">
        {/* Top bar */}
        <header className="flex shrink-0 items-center justify-between border-b border-border bg-sidebar px-5 py-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white">
              <FileText size={18} />
            </span>
            <div>
              <h1 className="text-sm font-semibold leading-tight">AI Resume Builder</h1>
              <p className="text-[11px] text-muted">Craft, polish & export — powered by Claude</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <ATSOptimizer />
            <DownloadPdfButton />
          </div>
        </header>

        {/* Workspace: form left, preview right */}
        <main className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(420px,1fr)_minmax(520px,1.1fr)]">
          <section className="min-h-0 overflow-y-auto border-r border-border px-5 py-5">
            <FormPanel />
          </section>

          <section className="flex min-h-0 flex-col bg-[#0c0e15]">
            <CustomizationToolbar />
            <div className="min-h-0 flex-1 overflow-hidden">
              <LivePreview />
            </div>
          </section>
        </main>
      </div>
    </ToastProvider>
  );
}
