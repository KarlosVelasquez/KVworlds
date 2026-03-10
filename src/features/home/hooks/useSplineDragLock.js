import { useEffect } from 'react';

export function useSplineDragLock(showMain, splineBgRef) {
  useEffect(() => {
    if (!showMain) {
      return undefined;
    }

    const container = splineBgRef.current;
    if (!container) {
      return undefined;
    }

    let cleanup = null;

    const waitForCanvas = setInterval(() => {
      const canvas = container.querySelector('canvas');
      if (!canvas) {
        return;
      }

      clearInterval(waitForCanvas);
      let isDragging = false;

      const onMouseDown = (event) => {
        if (event.button === 0) {
          isDragging = true;
        }
      };

      const onMouseUp = () => {
        isDragging = false;
      };

      const onMouseMove = (event) => {
        if (isDragging && event.buttons === 1) {
          event.stopImmediatePropagation();
          event.preventDefault();
        }
      };

      canvas.addEventListener('mousedown', onMouseDown, true);
      window.addEventListener('mouseup', onMouseUp, true);
      canvas.addEventListener('mousemove', onMouseMove, true);

      cleanup = () => {
        canvas.removeEventListener('mousedown', onMouseDown, true);
        window.removeEventListener('mouseup', onMouseUp, true);
        canvas.removeEventListener('mousemove', onMouseMove, true);
      };
    }, 200);

    return () => {
      clearInterval(waitForCanvas);
      cleanup?.();
    };
  }, [showMain, splineBgRef]);
}
