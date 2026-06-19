import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from './ui/Button';
import { Spinner } from './ui/Spinner';
import { useToast } from './ui/Toast';
import { useResumeStore } from '../store/useResumeStore';
import { RESUME_PAGE_ID } from './preview/ResumeDocument';
import { RESUME_CSS } from './preview/resumeStyles';

function fileNameFrom(fullName: string): string {
  const slug = fullName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${slug || 'resume'}-resume.pdf`;
}

export function DownloadPdfButton() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const fullName = useResumeStore((s) => s.data.personal.fullName);

  async function download() {
    const node = document.getElementById(RESUME_PAGE_ID);
    if (!node) {
      toast('Preview not ready yet', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: node.outerHTML, css: RESUME_CSS }),
      });
      if (!res.ok) throw new Error('PDF generation failed');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileNameFrom(fullName);
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast('PDF generated', 'success');
    } catch {
      toast('Could not generate PDF', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="primary" size="md" onClick={download} disabled={loading}>
      {loading ? <Spinner /> : <Download size={16} />}
      Download PDF
    </Button>
  );
}
