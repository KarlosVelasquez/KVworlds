import { lazy, Suspense, useEffect, useState } from 'react';
import DecryptedText from '@/components/DecryptedText';
import profileImage from '@/assets/prueba2-removebg-preview.png';
import { ABOUT_LINES } from '@/features/home/constants';
import './AboutSection.css';

const Lanyard = lazy(() => import('@/components/Lanyard'));
const LightRays = lazy(() => import('@/components/LightRays'));

export default function AboutSection({
  aboutSectionRef,
  moonRefs,
  floatingTech,
  asteroidScale,
  lanyardDropRef,
  showLanyardDrop,
  onAboutAnimationComplete,
  profileMassRef,
  firstName,
  lastName,
}) {
  const [isAboutInView, setIsAboutInView] = useState(false);

  useEffect(() => {
    const section = aboutSectionRef.current;
    if (!section) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsAboutInView(true);
          observer.disconnect();
        }
      },
      { root: null, rootMargin: '180px 0px', threshold: 0.05 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [aboutSectionRef]);

  return (
    <section ref={aboutSectionRef} className="relative w-full h-screen bg-neutral-950 overflow-hidden px-6 py-8 flex items-center">
      <div className="absolute inset-0 z-[1] pointer-events-none">
        {isAboutInView ? (
          <Suspense fallback={null}>
            <LightRays
              raysOrigin="top-center"
              raysColor="#b6b6b6"
              raysSpeed={1}
              lightSpread={1}
              rayLength={5}
              pulsating={false}
              fadeDistance={3}
              saturation={0.75}
              followMouse
              mouseInfluence={0.04}
              noiseAmount={0}
              distortion={0}
            />
          </Suspense>
        ) : null}
      </div>

      <div className="absolute left-0 top-0 bottom-0 z-[120] w-[250px] md:w-[430px] pointer-events-none overflow-visible">
        <div className="h-full pt-4 md:pt-6 pb-4 md:pb-6 pl-3 md:pl-6 pr-6 md:pr-10 uppercase font-handwriting italic font-black text-[26px] md:text-[56px] leading-[1.02] flex flex-col justify-between">
          {ABOUT_LINES.map((line, index) => (
            <DecryptedText
              key={line}
              text={line}
              speed={72}
              startDelay={index * 850}
              maxIterations={24 + index * 4}
              sequential
              revealDirection="start"
              animateOn="view"
              onComplete={index === ABOUT_LINES.length - 1 ? onAboutAnimationComplete : undefined}
              parentClassName="block"
              className="bg-gradient-to-r from-white via-zinc-300 to-zinc-600 bg-clip-text text-transparent drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]"
              encryptedClassName="text-zinc-600/60"
            />
          ))}
        </div>
      </div>

      <div className="absolute -top-8 right-0 z-40 w-[390px] md:w-[520px] pointer-events-none flex justify-end">
        <div
          ref={lanyardDropRef}
          className="w-[320px] h-[380px] md:w-[420px] md:h-[520px]"
          style={{
            opacity: showLanyardDrop ? 1 : 0,
            transform: showLanyardDrop ? 'translateY(0px)' : 'translateY(-280px)',
            pointerEvents: showLanyardDrop ? 'auto' : 'none',
          }}
        >
          {isAboutInView && showLanyardDrop ? (
            <Suspense fallback={null}>
              <Lanyard position={[0, 0, 28]} gravity={[0, -38, 0]} fov={18} transparent cardScale={3.9} />
            </Suspense>
          ) : null}
        </div>
      </div>

      <div className="absolute inset-0 z-[15] pointer-events-none">
        {floatingTech.map((tech, index) => (
          <div
            key={tech.label}
            ref={(element) => {
              moonRefs.current[index] = element;
            }}
            className={`skill-moon ${tech.variant}`}
            style={{
              width: `${tech.size * asteroidScale}px`,
              height: `${tech.size * asteroidScale}px`,
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

      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 ml-[250px] z-30 pointer-events-none">
        <div className="leading-none text-left">
          <p className="text-white font-black italic uppercase tracking-wide text-3xl md:text-4xl">{firstName}</p>
          <p className="text-white font-black italic uppercase tracking-wide text-2xl md:text-3xl">{lastName}</p>
        </div>
      </div>

      <div className="absolute inset-0 z-[15] flex items-end justify-center pointer-events-none pb-0">
        <img
          ref={profileMassRef}
          src={profileImage}
          alt="Foto de perfil"
          className="w-[34vw] max-w-[460px] min-w-[220px] h-auto object-contain opacity-95"
        />
      </div>
    </section>
  );
}
