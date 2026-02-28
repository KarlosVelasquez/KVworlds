
import GhostCursor from '@gaotisan/ghostcursor';
import Spline from '@splinetool/react-spline';
import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Menu, Instagram, Twitter, Github } from 'lucide-react';
import './Home.css';

// Utilidad para clamp
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

const SPLASH_DURATION = 5000;

export default function Home() {
  // --- Scrollbar personalizada ---
  const [scrollThumbTop, setScrollThumbTop] = useState(0);
  const [scrollThumbHeight, setScrollThumbHeight] = useState(24); // px
  const [scrollbarVisible, setScrollbarVisible] = useState(false);
  const hideTimeout = useRef();

  useEffect(() => {
    function updateScrollBar() {
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const scrollY = window.scrollY;
      // Altura del thumb proporcional
      const thumbHeight = clamp((winHeight / docHeight) * 96, 16, 96); // 96 = h-24 de la barra
      // Posición del thumb
      const maxScroll = docHeight - winHeight;
      const top = maxScroll > 0 ? ((scrollY / maxScroll) * (96 - thumbHeight)) : 0;
      setScrollThumbHeight(thumbHeight);
      setScrollThumbTop(top);
      setScrollbarVisible(true);
      clearTimeout(hideTimeout.current);
      hideTimeout.current = setTimeout(() => setScrollbarVisible(false), 1200);
    }
    updateScrollBar();
    window.addEventListener('scroll', updateScrollBar);
    window.addEventListener('resize', updateScrollBar);
    return () => {
      window.removeEventListener('scroll', updateScrollBar);
      window.removeEventListener('resize', updateScrollBar);
      clearTimeout(hideTimeout.current);
    };
  }, []);

  // --- Estados y refs principales ---
  const [splineReady, setSplineReady] = useState(false);
  const [showMain, setShowMain] = useState(false);
  const [splashExit, setSplashExit] = useState(false);
  const [musicOn, setMusicOn] = useState(true);
  const splineBgRef = useRef(null);

  // --- Splash Spline ---
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

  // --- GhostCursor ---
  useEffect(() => {
    const cursor = new GhostCursor({
      trailLength: 15,
      inertia: 0.5,
      grainIntensity: 0.05,
      bloomStrength: 0.5,
      bloomRadius: 1,
      brightness: 2,
      color: '#fff',
      edgeIntensity: 0,
    });
    cursor.show();
    return () => cursor.destroy();
  }, []);

  // --- Bloquear solo interacción de drag en canvas Spline, pero permitir scroll/wheel ---
  useEffect(() => {
    if (!showMain) return;
    const container = splineBgRef.current;
    if (!container) return;
    let cleanup = null;
    const waitForCanvas = setInterval(() => {
      const canvas = container.querySelector('canvas');
      if (!canvas) return;
      clearInterval(waitForCanvas);
      // Solo bloquea drag izquierdo, no wheel ni scroll
      let isDragging = false;
      const onMouseDown = (e) => {
        if (e.button === 0) {
          isDragging = true;
        }
      };
      const onMouseUp = () => {
        isDragging = false;
      };
      const onMouseMove = (e) => {
        if (isDragging && e.buttons === 1) {
          e.stopImmediatePropagation();
          e.preventDefault();
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
      if (cleanup) cleanup();
    };
  }, [showMain]);

  return (
    <div className="relative bg-black w-full">
      {/* Logo arriba izquierda */}
      <div className="absolute top-6 left-8 z-20 text-white font-bold text-3xl font-handwriting select-none tracking-widest">
        DEKO WORLDS
      </div>

      {/* Botones arriba derecha */}
      <div className="absolute top-6 right-8 z-20 flex items-center gap-4">
        <button
          className="bg-neutral-900/80 rounded-full p-2 shadow hover:bg-neutral-800 transition"
          aria-label="Toggle music"
          onClick={() => setMusicOn((v) => !v)}
        >
          {musicOn ? <Volume2 className="w-6 h-6 text-white" /> : <VolumeX className="w-6 h-6 text-white" />}
        </button>
        <button
          className="bg-neutral-900/80 rounded-full px-4 py-2 shadow hover:bg-neutral-800 transition text-white font-semibold text-lg"
          aria-label="Menu"
        >
          <Menu className="inline w-6 h-6 mr-1 align-middle" /> MENU
        </button>
      </div>

      {/* Splash/Intro 3D */}
      {!showMain && (
        <div className={`splash-screen ${splashExit ? 'splash-exit' : ''} flex items-center justify-center min-h-screen`}>
          <div className="splash-spline">
            <Spline
              scene="https://draft.spline.design/Gip0peV95M6enfdL/scene.splinecode"
              style={{ width: '100vw', height: '100vh' }}
              onLoad={handleSplineLoad}
            />
          </div>
          {/* Botón en la presentación, mismo estilo pero sin redes sociales */}
          <div
            className="absolute bottom-4 right-4 z-50 flex items-center gap-1 text-sm"
            style={{ pointerEvents: 'auto' }}
          >
            <button className="bg-[#161616] text-white w-56 h-12 px-4 py-2 rounded-full shadow-lg flex items-center justify-center">
              {/* Aquí puedes poner texto o dejarlo vacío */}
            </button>
          </div>
          {!splineReady && (
            <div className="splash-loader">
              <div className="loader-ring" />
              <span className="loader-text">Cargando…</span>
            </div>
          )}
        </div>
      )}

      {/* Contenido principal centrado */}
      {showMain && (
        <>
          <div className="flex flex-col items-center justify-center w-full h-auto min-w-full p-0 m-0">
            <div className="relative w-full min-h-screen bg-neutral-600/80 rounded-none shadow-2xl border-2 border-neutral-700 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 z-10 pointer-events-none border-2 border-neutral-800" />
              <div className="w-full h-full overflow-hidden" ref={splineBgRef}>
                <Spline
                  scene="https://draft.spline.design/UeCJiOmi0HvX2hma/scene.splinecode"
                  style={{ width: '100vw', height: '100vh' }}
                />
                  {/* Botón solo sobre el canvas 3D */}
              <div
                className="absolute bottom-4 right-4 z-50 flex items-center gap-1 text-sm"
                style={{ pointerEvents: 'auto' }}
              >
                <button className="bg-slate-950 text-white w-56 h-12 px-4 py-2 rounded-full shadow-lg flex items-center justify-center">
                  {/* Redes sociales dentro del botón */}
                  <div className="flex gap-3">
                    <a href="#" target="_blank" rel="noopener noreferrer" className="bg-neutral-900/80 rounded-full p-2 shadow hover:bg-[#B19EEF] transition">
                      <Instagram className="w-5 h-5 text-white" />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="bg-neutral-900/80 rounded-full p-2 shadow hover:bg-[#B19EEF] transition">
                      <Twitter className="w-5 h-5 text-white" />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="bg-neutral-900/80 rounded-full p-2 shadow hover:bg-[#B19EEF] transition">
                      <Github className="w-5 h-5 text-white" />
                    </a>
                  </div>
                </button>
              </div>
              </div>
            </div>
          </div>
          {/* Segunda sección para hacer scroll */}
          <section className="w-full flex flex-col items-center justify-center bg-neutral-950 text-white text-4xl font-bold border-t-4 border-[#B19EEF] py-32">
            <div className="py-32">a ver si efecto del mouse funciona </div>
          </section>
          {/* Sección inferior con espacio para imagen */}
          <section className="w-full flex flex-col items-center justify-center bg-black border-t-4 border-[#B19EEF] py-32">
            <div className="w-full max-w-4xl flex flex-col items-center justify-center py-20">
              <div className="w-full flex flex-col md:flex-row items-center justify-center gap-12">
                {/* Espacio reservado para imagen */}
                <div className="w-64 h-80 bg-neutral-800 rounded-3xl flex items-center justify-center border-2 border-neutral-700">
                  <span className="text-neutral-500 text-lg">Imagen aquí</span>
                </div>
                {/* Espacio para contenido adicional */}
                <div className="flex-1 min-h-[200px] bg-neutral-200/80 rounded-3xl flex items-center justify-center p-8">
                  <span className="text-black text-2xl font-semibold">descripción</span>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Scrollbar personalizada funcional y animada */}
      <div
        className="fixed right-2 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center select-none"
        style={{ pointerEvents: 'none', opacity: scrollbarVisible ? 1 : 0, transition: 'opacity 0.4s cubic-bezier(.4,0,.2,1)' }}
      >
        <div className="h-24 w-1.5 bg-neutral-900 rounded-full border border-neutral-700 flex flex-col justify-between py-1 relative">
          <div
            className="w-1 bg-[#B19EEF] rounded-full mx-auto shadow absolute left-1/2 -translate-x-1/2"
            style={{
              height: `${scrollThumbHeight}px`,
              top: `${scrollThumbTop}px`,
              transition: 'top 0.1s cubic-bezier(.4,0,.2,1), height 0.2s cubic-bezier(.4,0,.2,1)',
            }}
          />
        </div>
      </div>
    </div>
  );

}