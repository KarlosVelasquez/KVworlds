import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import profileImage from '@/assets/prueba2-removebg-preview.png';
import { ABOUT_LINES } from '@/features/home/constants';
import './AboutSection.css';

const Lanyard = lazy(() => import('@/components/Lanyard'));

const clamp01 = (value) => Math.min(1, Math.max(0, value));

export default function AboutSection({
  aboutSectionRef,
  lanyardDropRef,
  showLanyardDrop,
  onAboutAnimationComplete,
  onAboutAnimationReset,
  profileMassRef,
  firstName,
  lastName,
}) {
  const aboutTrackRef = useRef(null);
  const contentLayerRef = useRef(null);
  const [isAboutInView, setIsAboutInView] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [dropTriggered, setDropTriggered] = useState(false);

  useEffect(() => {
    const section = aboutSectionRef.current;
    if (!section) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting && entry.intersectionRatio >= 0.2;
        setIsAboutInView(inView);

        if (inView && !dropTriggered) {
          setDropTriggered(true);
          onAboutAnimationComplete?.();
        }

        if (!inView && dropTriggered) {
          setDropTriggered(false);
          onAboutAnimationReset?.();
        }
      },
      { root: null, rootMargin: '0px', threshold: [0, 0.2, 0.4] },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [aboutSectionRef, dropTriggered, onAboutAnimationComplete, onAboutAnimationReset]);

  useEffect(() => {
    const section = aboutTrackRef.current;
    if (!section) {
      return undefined;
    }

    let ticking = false;

    const updateByScroll = () => {
      ticking = false;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const travel = Math.max(1, section.offsetHeight - viewportHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));

      setScrollProgress(progress);

      if (contentLayerRef.current) {
        // Keep motion subtle and clamp the final stage to avoid abrupt drift near section end.
        const stabilizedProgress = Math.min(progress, 0.82);
        const centeredShift = Math.round((stabilizedProgress - 0.45) * 70);
        contentLayerRef.current.style.setProperty('--about-shift', `${centeredShift}px`);
      }

    };

    const onScroll = () => {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(updateByScroll);
    };

    updateByScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [aboutSectionRef]);

  const profileReveal = clamp01((scrollProgress - 0.08) / 0.22);
  const nameReveal = clamp01((scrollProgress - 0.28) / 0.2);
  const shouldShowLanyard = isAboutInView;

  const getLineReveal = (index) => {
    const start = 0.38 + index * 0.055;
    return clamp01((scrollProgress - start) / 0.11);
  };

  return (
    <section ref={aboutTrackRef} className="relative w-full h-[500vh]">
      <div ref={aboutSectionRef} className="sticky top-0 w-full h-screen overflow-visible px-6 py-8 flex items-center">
        <div
          ref={contentLayerRef}
          className="about-scroll-content-layer absolute inset-0"
          style={{ opacity: 1 }}
        >
          <div
            className="absolute left-0 top-0 bottom-0 z-[120] w-[250px] md:w-[430px] pointer-events-none overflow-visible"
          >
            <div className="h-full -translate-y-4 md:-translate-y-8 pl-3 md:pl-6 pr-6 md:pr-10 uppercase font-handwriting italic font-black text-[26px] md:text-[56px] leading-[1.02] flex flex-col justify-center gap-3 md:gap-5">
              {ABOUT_LINES.map((line, index) => {
                const lineReveal = getLineReveal(index);
                return (
                  <span
                    key={line}
                    className="bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-500 bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
                    style={{
                      opacity: lineReveal,
                      transform: `translateY(${Math.round((1 - lineReveal) * 24)}px)`,
                    }}
                  >
                    {line}
                  </span>
                );
              })}
            </div>
          </div>

          <div
            className="absolute -top-8 right-0 z-40 w-[390px] md:w-[520px] pointer-events-none flex justify-end"
          >
            <div
              ref={lanyardDropRef}
              className="w-[320px] h-[380px] md:w-[420px] md:h-[520px]"
              style={{
                opacity: shouldShowLanyard && showLanyardDrop ? 1 : 0,
                transform: shouldShowLanyard && showLanyardDrop ? 'translateY(0px)' : 'translateY(-280px)',
                pointerEvents: shouldShowLanyard && showLanyardDrop ? 'auto' : 'none',
              }}
            >
              {isAboutInView && shouldShowLanyard && showLanyardDrop ? (
                <Suspense fallback={null}>
                  <Lanyard position={[0, 0, 28]} gravity={[0, -38, 0]} fov={18} transparent cardScale={3.9} />
                </Suspense>
              ) : null}
            </div>
          </div>

          <div
            className="absolute bottom-14 md:bottom-20 left-1/2 -translate-x-1/2 ml-[250px] z-30 pointer-events-none"
          >
            <div
              className="about-name-group leading-none text-left"
              style={{
                opacity: nameReveal,
                transform: `translateY(${Math.round((1 - nameReveal) * 26)}px)`,
              }}
            >
              <p className="text-zinc-200/90 font-black italic uppercase tracking-wide text-3xl md:text-4xl">{firstName}</p>
              <p className="text-zinc-300/85 font-black italic uppercase tracking-wide text-2xl md:text-3xl">{lastName}</p>
            </div>
          </div>

          <div
            className="absolute inset-0 z-[15] flex items-end justify-center pointer-events-none pb-0"
          >
            <img
              ref={profileMassRef}
              src={profileImage}
              alt="Foto de perfil"
              className="about-profile-image w-[34vw] max-w-[460px] min-w-[220px] h-auto object-contain"
              style={{
                opacity: 0.15 + profileReveal * 0.73,
                transform: `translateY(${Math.round((1 - profileReveal) * 36)}px) scale(${(0.94 + profileReveal * 0.06).toFixed(3)})`,
              }}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
