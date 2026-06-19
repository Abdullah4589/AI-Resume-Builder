import { useLayoutEffect, useRef, useState } from 'react';
import { PAGE_WIDTH } from '../components/preview/previewVars';

/**
 * Scales a fixed-width (A4) page to fit the available container width, so the live
 * preview keeps the exact proportions of the rendered PDF.
 */
export function useFitScale() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState(0);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const page = pageRef.current;
    if (!container || !page) return;

    const update = () => {
      const available = container.clientWidth;
      const next = Math.min(1, available / PAGE_WIDTH);
      setScale(next);
      setScaledHeight(page.offsetHeight * next);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(container);
    ro.observe(page);
    return () => ro.disconnect();
  }, []);

  return { containerRef, pageRef, scale, scaledHeight };
}
