import { useEffect, useRef, useState } from 'react';
import { clamp } from '@/shared/lib/clamp';

export function useHomeScrollbar() {
  const [scrollThumbTop, setScrollThumbTop] = useState(0);
  const [scrollThumbHeight, setScrollThumbHeight] = useState(24);
  const [scrollbarVisible, setScrollbarVisible] = useState(false);
  const hideTimeoutRef = useRef(null);

  useEffect(() => {
    const updateScrollBar = () => {
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const scrollY = window.scrollY;
      const thumbHeight = clamp((winHeight / docHeight) * 96, 16, 96);
      const maxScroll = docHeight - winHeight;
      const top = maxScroll > 0 ? (scrollY / maxScroll) * (96 - thumbHeight) : 0;

      setScrollThumbHeight(thumbHeight);
      setScrollThumbTop(top);
      setScrollbarVisible(true);

      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = setTimeout(() => setScrollbarVisible(false), 1200);
    };

    updateScrollBar();
    window.addEventListener('scroll', updateScrollBar);
    window.addEventListener('resize', updateScrollBar);

    return () => {
      window.removeEventListener('scroll', updateScrollBar);
      window.removeEventListener('resize', updateScrollBar);
      clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  return {
    scrollThumbTop,
    scrollThumbHeight,
    scrollbarVisible,
  };
}
