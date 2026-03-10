import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export function useLanyardDropAnimation(lanyardDropRef, delayMs = 550) {
  const [showLanyardDrop, setShowLanyardDrop] = useState(false);
  const delayTimeoutRef = useRef(null);
  const instantMode = delayMs <= 0;

  const triggerDrop = () => {
    clearTimeout(delayTimeoutRef.current);

    if (instantMode) {  
      setShowLanyardDrop(true);
      return;
    }

    delayTimeoutRef.current = setTimeout(() => {
      setShowLanyardDrop(true);
      delayTimeoutRef.current = null;
    }, delayMs);
  };

  const resetDrop = () => {
    clearTimeout(delayTimeoutRef.current);
    delayTimeoutRef.current = null;
    setShowLanyardDrop(false);
  };

  useEffect(() => {
    return () => {
      clearTimeout(delayTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const element = lanyardDropRef.current;
    if (!element) {
      return undefined;
    }

    gsap.killTweensOf(element);

    if (!showLanyardDrop) {
      gsap.set(element, { y: -280, autoAlpha: 0 });
      return undefined;
    }

    if (instantMode) {
      gsap.set(element, { y: 0, autoAlpha: 1 });
      return undefined;
    }

    const timeline = gsap.timeline();
    timeline
      .to(element, { y: 28, autoAlpha: 1, duration: 0.72, ease: 'power2.in' })
      .to(element, { y: 0, duration: 0.52, ease: 'power2.out' })
      .to(element, { y: 8, duration: 0.18, ease: 'power1.inOut' })
      .to(element, { y: 0, duration: 0.2, ease: 'power1.out' });

    return () => {
      timeline.kill();
    };
  }, [showLanyardDrop, lanyardDropRef, instantMode]);

  return {
    showLanyardDrop,
    triggerDrop,
    resetDrop,
  };
}
