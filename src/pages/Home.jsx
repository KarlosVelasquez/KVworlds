import { useState, useEffect, useRef } from 'react';
import Spline from '@splinetool/react-spline';
import './Home.css';

const SPLASH_DURATION = 5000;

export default function Home() {
  const [splineReady, setSplineReady] = useState(false);
  const [showMain, setShowMain] = useState(false);
  const [splashExit, setSplashExit] = useState(false);
  const splineBgRef = useRef(null);

  function handleSplineLoad() {
    setSplineReady(true);
  }

  useEffect(() => {
    if (!splineReady) return;
    const timer = setTimeout(() => {
      setSplashExit(true);
      setTimeout(() => setShowMain(true), 1000);
    }, SPLASH_DURATION);
    return () => clearTimeout(timer);
  }, [splineReady]);

  // Bloquear click/drag/zoom en el canvas de Spline, pero dejar mousemove libre
  useEffect(() => {
    if (!showMain) return;
    const container = splineBgRef.current;
    if (!container) return;

    let cleanups = [];

    // Esperar a que Spline renderice su canvas
    const waitForCanvas = setInterval(() => {
      const canvas = container.querySelector('canvas');
      if (!canvas) return;
      clearInterval(waitForCanvas);

      const block = (e) => {
        e.stopImmediatePropagation();
        e.preventDefault();
      };

      const events = ['pointerdown', 'mousedown', 'click', 'touchstart', 'wheel', 'contextmenu'];
      events.forEach((evt) => {
        canvas.addEventListener(evt, block, true);
      });

      cleanups = events.map((evt) => () => canvas.removeEventListener(evt, block, true));
    }, 200);

    return () => {
      clearInterval(waitForCanvas);
      cleanups.forEach((fn) => fn());
    };
  }, [showMain]);

  return (
    <div className="home-wrapper">
      {/* ===== SPLASH / INTRO 3D ===== */}
      {!showMain && (
        <div className={`splash-screen ${splashExit ? 'splash-exit' : ''}`}>
          <div className="splash-spline">
            <Spline
              scene="https://draft.spline.design/Gip0peV95M6enfdL/scene.splinecode"
              style={{ width: '100vw', height: '100vh' }}
              onLoad={handleSplineLoad}
            />
          </div>

          {!splineReady && (
            <div className="splash-loader">
              <div className="loader-ring" />
              <span className="loader-text">Cargando…</span>
            </div>
          )}
        </div>
      )}

      {/* ===== CONTENIDO PRINCIPAL ===== */}
      {showMain && (
        <main className="main-content">
          <div className="main-spline-bg" ref={splineBgRef}>
            <Spline
              scene="https://draft.spline.design/UeCJiOmi0HvX2hma/scene.splinecode"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </main>
      )}
    </div>
  );
}
