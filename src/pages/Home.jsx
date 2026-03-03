
import Spline from '@splinetool/react-spline';
import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Menu, Instagram, Twitter, Github } from 'lucide-react';
import GhostCursor from '@/components/GhostCursor';
import profileImage from '@/assets/prueba2-removebg-preview.png';
import { gsap } from 'gsap';
import './Home.css';

// Utilidad para clamp
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

const SPLASH_DURATION = 5000;

export default function Home() {
  const floatingTech = [
    { label: 'HTML5', size: 82, variant: 'meteor-a', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
    { label: 'CSS3', size: 82, variant: 'meteor-b', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
    { label: 'JavaScript', size: 88, variant: 'meteor-c', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
    { label: 'TypeScript', size: 88, variant: 'meteor-a', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
    { label: 'React', size: 92, variant: 'meteor-b', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { label: 'Tailwind', size: 88, variant: 'meteor-c', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
    { label: 'Bootstrap', size: 84, variant: 'meteor-a', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg' },
    { label: 'Node.js', size: 88, variant: 'meteor-b', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
    { label: 'Express', size: 86, variant: 'meteor-c', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
    { label: 'C#', size: 84, variant: 'meteor-a', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg' },
    { label: 'MongoDB', size: 88, variant: 'meteor-b', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
    { label: 'Firebase', size: 86, variant: 'meteor-c', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' },
    { label: 'PostgreSQL', size: 90, variant: 'meteor-a', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
    { label: 'MySQL', size: 90, variant: 'meteor-b', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
    { label: 'Postman', size: 84, variant: 'meteor-c', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg' },
    { label: 'Figma', size: 84, variant: 'meteor-a', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
    { label: 'Git', size: 84, variant: 'meteor-b', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
    { label: 'GitHub', size: 88, variant: 'meteor-c', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
    { label: 'Vercel', size: 82, variant: 'meteor-a', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg' },
    { label: 'Prisma', size: 86, variant: 'meteor-b', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg' },
    { label: 'Docker', size: 90, variant: 'meteor-c', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
    { label: 'VS Code', size: 84, variant: 'meteor-a', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
  ];

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
  const aboutSectionRef = useRef(null);
  const moonRefs = useRef([]);
  const profileMassRef = useRef(null);
  const pointerRef = useRef({ x: -1000, y: -1000, active: false });

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

  useEffect(() => {
    if (!showMain) return;

    const section = aboutSectionRef.current;
    const moons = moonRefs.current.filter(Boolean);
    if (!section || moons.length === 0) return;

    const getBounds = () => ({
      width: section.clientWidth,
      height: section.clientHeight,
    });

    const states = moons.map((moon) => {
      const size = moon.offsetWidth || 100;
      const { width, height } = getBounds();
      const x = Math.random() * Math.max(1, width - size);
      const y = Math.random() * Math.max(1, height - size);
      const vx = (Math.random() * 0.65 + 0.45) * (Math.random() > 0.5 ? 1 : -1);
      const vy = (Math.random() * 0.65 + 0.45) * (Math.random() > 0.5 ? 1 : -1);

      gsap.set(moon, { x, y });
      return { moon, size, x, y, vx, vy };
    });

    const handlePointerMove = (event) => {
      const rect = section.getBoundingClientRect();
      pointerRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        active: true,
      };
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
      pointerRef.current.x = -1000;
      pointerRef.current.y = -1000;
    };

    section.addEventListener('pointermove', handlePointerMove);
    section.addEventListener('pointerleave', handlePointerLeave);

    const tick = () => {
      const { width, height } = getBounds();
      const pointer = pointerRef.current;
      const sectionRect = section.getBoundingClientRect();
      const profileRect = profileMassRef.current?.getBoundingClientRect();
      const spacing = 4;

      const profileObstacle = profileRect ? {
        cx: profileRect.left - sectionRect.left + profileRect.width / 2,
        cy: profileRect.top - sectionRect.top + profileRect.height / 2,
        rx: profileRect.width * 0.34,
        ry: profileRect.height * 0.5,
      } : null;

      const resolveProfileCollision = (state) => {
        if (!profileObstacle) return;

        const centerX = state.x + state.size / 2;
        const centerY = state.y + state.size / 2;

        let dx = centerX - profileObstacle.cx;
        let dy = centerY - profileObstacle.cy;

        if (Math.abs(dx) < 0.0001 && Math.abs(dy) < 0.0001) {
          dy = -0.001;
        }

        const radiusX = profileObstacle.rx + state.size * 0.5 + 2;
        const radiusY = profileObstacle.ry + state.size * 0.5 + 2;

        const scaledDistance = Math.sqrt(
          (dx * dx) / (radiusX * radiusX) +
          (dy * dy) / (radiusY * radiusY)
        );

        if (scaledDistance >= 1) return;

        const safeScale = 1.002 / Math.max(scaledDistance, 0.0001);
        const targetX = profileObstacle.cx + dx * safeScale;
        const targetY = profileObstacle.cy + dy * safeScale;
        const shiftX = targetX - centerX;
        const shiftY = targetY - centerY;

        state.x += shiftX;
        state.y += shiftY;

        const gradX = (targetX - profileObstacle.cx) / (radiusX * radiusX);
        const gradY = (targetY - profileObstacle.cy) / (radiusY * radiusY);
        const gradLen = Math.hypot(gradX, gradY) || 1;
        const nx = gradX / gradLen;
        const ny = gradY / gradLen;

        const inwardVelocity = state.vx * nx + state.vy * ny;
        if (inwardVelocity < 0) {
          state.vx -= inwardVelocity * nx * 1.15;
          state.vy -= inwardVelocity * ny * 1.15;
        }

        state.vx += nx * 0.03;
        state.vy += ny * 0.03;
      };

      states.forEach((state) => {
        const randomForce = 0.05;
        state.vx += (Math.random() - 0.5) * randomForce;
        state.vy += (Math.random() - 0.5) * randomForce;

        if (pointer.active) {
          const centerX = state.x + state.size / 2;
          const centerY = state.y + state.size / 2;
          const dx = centerX - pointer.x;
          const dy = centerY - pointer.y;
          const distance = Math.hypot(dx, dy);
          const influenceRadius = state.size * 1.2;

          if (distance > 0.0001 && distance < influenceRadius) {
            const push = (1 - distance / influenceRadius) * 0.42;
            state.vx += (dx / distance) * push;
            state.vy += (dy / distance) * push;
          }
        }

        state.vx *= 0.995;
        state.vy *= 0.995;

        const speed = Math.hypot(state.vx, state.vy);
        if (speed < 0.42) {
          const angle = Math.random() * Math.PI * 2;
          const boost = 0.12;
          state.vx += Math.cos(angle) * boost;
          state.vy += Math.sin(angle) * boost;
        }

        state.vx = clamp(state.vx, -2.6, 2.6);
        state.vy = clamp(state.vy, -2.6, 2.6);

        state.x += state.vx;
        state.y += state.vy;

        if (state.x <= 0 || state.x >= width - state.size) {
          state.vx *= -1;
          state.x = Math.max(0, Math.min(state.x, width - state.size));
        }

        if (state.y <= 0 || state.y >= height - state.size) {
          state.vy *= -1;
          state.y = Math.max(0, Math.min(state.y, height - state.size));
        }
      });

      for (let i = 0; i < states.length; i += 1) {
        for (let j = i + 1; j < states.length; j += 1) {
          const a = states[i];
          const b = states[j];

          const aCenterX = a.x + a.size / 2;
          const aCenterY = a.y + a.size / 2;
          const bCenterX = b.x + b.size / 2;
          const bCenterY = b.y + b.size / 2;

          let dx = bCenterX - aCenterX;
          let dy = bCenterY - aCenterY;
          let distance = Math.hypot(dx, dy);
          const minDistance = (a.size + b.size) / 2 + spacing;

          if (distance < 0.0001) {
            dx = (Math.random() - 0.5) * 0.1;
            dy = (Math.random() - 0.5) * 0.1;
            distance = Math.hypot(dx, dy);
          }

          if (distance < minDistance) {
            const nx = dx / distance;
            const ny = dy / distance;
            const overlap = minDistance - distance;

            a.x -= nx * overlap * 0.5;
            a.y -= ny * overlap * 0.5;
            b.x += nx * overlap * 0.5;
            b.y += ny * overlap * 0.5;

            const relVelX = b.vx - a.vx;
            const relVelY = b.vy - a.vy;
            const velAlongNormal = relVelX * nx + relVelY * ny;

            if (velAlongNormal < 0) {
              const restitution = 0.76;
              const impulse = (-(1 + restitution) * velAlongNormal) / 2;
              const impulseX = impulse * nx;
              const impulseY = impulse * ny;

              a.vx -= impulseX;
              a.vy -= impulseY;
              b.vx += impulseX;
              b.vy += impulseY;
            }

            a.vx = clamp(a.vx, -2.6, 2.6);
            a.vy = clamp(a.vy, -2.6, 2.6);
            b.vx = clamp(b.vx, -2.6, 2.6);
            b.vy = clamp(b.vy, -2.6, 2.6);
          }
        }
      }

      states.forEach((state) => {
        resolveProfileCollision(state);
        state.x = clamp(state.x, 0, Math.max(0, width - state.size));
        state.y = clamp(state.y, 0, Math.max(0, height - state.size));
        resolveProfileCollision(state);
        state.x = clamp(state.x, 0, Math.max(0, width - state.size));
        state.y = clamp(state.y, 0, Math.max(0, height - state.size));

        gsap.set(state.moon, { x: state.x, y: state.y });
      });
    };

    const onResize = () => {
      const { width, height } = getBounds();
      states.forEach((state) => {
        state.x = Math.max(0, Math.min(state.x, width - state.size));
        state.y = Math.max(0, Math.min(state.y, height - state.size));
        gsap.set(state.moon, { x: state.x, y: state.y });
      });
    };

    gsap.ticker.add(tick);
    window.addEventListener('resize', onResize);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('resize', onResize);
      section.removeEventListener('pointermove', handlePointerMove);
      section.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [showMain]);

  return (
    <div className="relative bg-black w-full">
      <GhostCursor
        className="fixed inset-0 pointer-events-none z-[2147483647]"
        trailLength={10}
        inertia={0.65}
        grainIntensity={0.02}
        bloomStrength={0.05}
        bloomRadius={0.7}
        brightness={1.2}
        color="#B19EEF"
        edgeIntensity={0}
      />

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
          <section ref={aboutSectionRef} className="relative w-full h-screen bg-neutral-950 border-t-4 border-[#B19EEF] overflow-hidden px-6 py-8 flex items-center">
            <div className="absolute inset-0 pointer-events-none">
              {floatingTech.map((tech, index) => (
                <div
                  key={tech.label}
                  ref={(element) => {
                    moonRefs.current[index] = element;
                  }}
                  className={`skill-moon ${tech.variant}`}
                  style={{
                    width: `${tech.size}px`,
                    height: `${tech.size}px`,
                  }}
                >
                  <div className="skill-moon-core">
                    <span className="skill-fallback" aria-hidden="true">{tech.label.slice(0, 2).toUpperCase()}</span>
                    <img
                      src={tech.icon}
                      alt={tech.label}
                      className="skill-icon"
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="relative z-10 w-full max-w-6xl mx-auto text-white flex flex-col items-center justify-center h-full">
              

            </div>
               <div className="absolute inset-0 z-[15] flex items-end justify-center pointer-events-none pb-0">
                <img
                  ref={profileMassRef}
                  src={profileImage}
                  alt="Foto de perfil"
                  className="w-[42vw] max-w-[560px] min-w-[260px] h-auto object-contain opacity-95"
                />
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