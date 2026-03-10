import { lazy, Suspense, useEffect, useState } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

export default function SplashIntro({ splashExit, splineReady, onSplineLoad }) {
  const [shouldLoadSpline, setShouldLoadSpline] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timeoutId = null;

    const bootSpline = () => {
      if (!cancelled) {
        setShouldLoadSpline(true);
      }
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(() => {
        bootSpline();
      }, { timeout: 500 });

      return () => {
        cancelled = true;
        window.cancelIdleCallback(idleId);
      };
    }

    timeoutId = window.setTimeout(bootSpline, 220);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className={`splash-screen ${splashExit ? 'splash-exit' : ''} flex items-center justify-center min-h-screen`}>
      <div className="splash-spline">
        {shouldLoadSpline ? (
          <Suspense fallback={<div className="splash-spline-placeholder" />}>
            <Spline
              scene="https://draft.spline.design/Gip0peV95M6enfdL/scene.splinecode"
              style={{ width: '100vw', height: '100vh' }}
              onLoad={onSplineLoad}
            />
          </Suspense>
        ) : (
          <div className="splash-spline-placeholder" />
        )}
      </div>

      <div className="absolute bottom-4 right-4 z-50 flex items-center gap-1 text-sm" style={{ pointerEvents: 'auto' }}>
        <button className="bg-[#161616] text-white w-56 h-12 px-4 py-2 rounded-full shadow-lg flex items-center justify-center" />
      </div>

      {!splineReady && (
        <div className="splash-loader">
          <div className="loader-ring" />
          <span className="loader-text">Cargando...</span>
        </div>
      )}
    </div>
  );
}
