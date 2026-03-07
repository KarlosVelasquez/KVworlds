import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Instagram, Twitter, Github } from 'lucide-react';

const Spline = lazy(() => import('@splinetool/react-spline'));

export default function HeroSection({ splineBgRef }) {
  const localHeroRef = useRef(null);
  const [shouldLoadSpline, setShouldLoadSpline] = useState(false);

  useEffect(() => {
    const section = localHeroRef.current;
    if (!section) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadSpline(true);
          observer.disconnect();
        }
      },
      { root: null, rootMargin: '120px 0px', threshold: 0.1 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={localHeroRef} className="relative w-full h-screen overflow-hidden p-0 m-0">
      <div className="w-full h-full overflow-hidden" ref={splineBgRef}>
          {shouldLoadSpline ? (
            <Suspense fallback={<div className="w-full h-full bg-black/35" />}>
              <Spline
                scene="https://draft.spline.design/UeCJiOmi0HvX2hma/scene.splinecode"
                style={{ width: '100%', height: '100%' }}
              />
            </Suspense>
          ) : (
            <div className="w-full h-full bg-black/35" />
          )}

          <div className="absolute bottom-4 right-4 z-50 flex items-center gap-1 text-sm" style={{ pointerEvents: 'auto' }}>
            <button className="bg-slate-950 text-white w-56 h-12 px-4 py-2 rounded-full shadow-lg flex items-center justify-center">
              <div className="flex gap-3">
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="bg-neutral-900/80 rounded-full p-2 shadow hover:bg-[#B19EEF] transition">
                  <Instagram className="w-5 h-5 text-white" />
                </a>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="bg-neutral-900/80 rounded-full p-2 shadow hover:bg-[#B19EEF] transition">
                  <Twitter className="w-5 h-5 text-white" />
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="bg-neutral-900/80 rounded-full p-2 shadow hover:bg-[#B19EEF] transition">
                  <Github className="w-5 h-5 text-white" />
                </a>
              </div>
            </button>
          </div>
      </div>
    </div>
  );
}
