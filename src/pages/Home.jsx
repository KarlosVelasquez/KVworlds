import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import GhostCursor from '@/components/GhostCursor';
import { FLOATING_TECH } from '@/features/home/constants';
import {
  useFloatingTechPhysics,
  useHomeScrollbar,
  useHomeScrollTriggerPlaceholder,
  useLanyardDropAnimation,
  useSplineDragLock,
} from '@/features/home/hooks';
import {
  prefetchHomeHeavyChunks,
  prefetchHomeSections,
  prefetchProjectsRoute,
  scheduleIdlePrefetch,
} from '@/features/home/lib';
import { CustomScrollbar, TopBar } from '@/features/home/sections';
import './Home.css';

const SplashIntro = lazy(() => import('@/features/home/sections/SplashIntro/SplashIntro'));
const HeroSection = lazy(() => import('@/features/home/sections/HeroSection/HeroSection'));
const AboutSection = lazy(() => import('@/features/home/sections/AboutSection/AboutSection'));
const ProjectsSection = lazy(() => import('@/features/home/sections/ProjectsSection/ProjectsSection'));
const ContactSection = lazy(() => import('@/features/home/sections/ContactSection/ContactSection'));

const SPLASH_DURATION_MS = 2100;
const SPLASH_FALLBACK_MS = 4800;
const ASTEROID_SCALE = 0.6;
const LANYARD_DROP_DELAY_MS = 0;

export default function Home() {
  const firstName = 'KARLOS';
  const lastName = 'CAJIBIOY VELASQUEZ';

  const [showSplash, setShowSplash] = useState(true);
  const [splashExit, setSplashExit] = useState(false);
  const [splineReady, setSplineReady] = useState(false);
  const [musicOn, setMusicOn] = useState(true);
  const [projectsInView, setProjectsInView] = useState(false);
  const showMain = true;


  const splineBgRef = useRef(null);
  const heroSectionRef = useRef(null);
  const aboutSectionRef = useRef(null);
  const projectsSectionRef = useRef(null);
  const contactSectionRef = useRef(null);
  const moonRefs = useRef([]);
  const profileMassRef = useRef(null);
  const lanyardDropRef = useRef(null);
  const splashDismissedRef = useRef(false);

  const { scrollThumbTop, scrollThumbHeight, scrollbarVisible } = useHomeScrollbar();

  const { showLanyardDrop, triggerDrop } = useLanyardDropAnimation(lanyardDropRef, LANYARD_DROP_DELAY_MS);

  const dismissSplash = () => {
    if (splashDismissedRef.current) {
      return;
    }

    splashDismissedRef.current = true;
    setSplashExit(true);
    window.setTimeout(() => {
      setShowSplash(false);
    }, 900);
  };

  useSplineDragLock(showMain, splineBgRef);
  useFloatingTechPhysics(showMain, aboutSectionRef, moonRefs, profileMassRef);
  useHomeScrollTriggerPlaceholder({
    heroRef: heroSectionRef,
    aboutRef: aboutSectionRef,
    projectsRef: projectsSectionRef,
  });

  useEffect(() => {
    const cleanupIdle = scheduleIdlePrefetch(() => {
      prefetchHomeSections();
      prefetchProjectsRoute();
    }, 900);

    return cleanupIdle;
  }, []);

  useEffect(() => {
    if (!showSplash || !splineReady) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      dismissSplash();
    }, SPLASH_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [showSplash, splineReady]);

  useEffect(() => {
    if (!showSplash) {
      return undefined;
    }

    const fallbackTimer = window.setTimeout(() => {
      dismissSplash();
    }, SPLASH_FALLBACK_MS);

    return () => window.clearTimeout(fallbackTimer);
  }, [showSplash]);

  useEffect(() => {
    const aboutEl = aboutSectionRef.current;
    const projectsEl = projectsSectionRef.current;
    const contactEl = contactSectionRef.current;

    if (!aboutEl && !projectsEl && !contactEl) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          if (entry.target === aboutEl) {
            prefetchHomeHeavyChunks();
          }

          if (entry.target === projectsEl) {
            prefetchProjectsRoute();
          }

          if (entry.target === contactEl) {
            prefetchProjectsRoute();
          }
        });
      },
      { root: null, rootMargin: '420px 0px', threshold: 0.01 },
    );

    if (aboutEl) {
      observer.observe(aboutEl);
    }

    if (projectsEl) {
      observer.observe(projectsEl);
    }

    if (contactEl) {
      observer.observe(contactEl);
    }

    return () => observer.disconnect();
  }, [showMain]);

  useEffect(() => {
    const section = projectsSectionRef.current;
    if (!section || !showMain) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setProjectsInView(entry?.isIntersecting ?? false);
      },
      { root: null, threshold: 0.3 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [showMain]);

  useEffect(() => {
    if (!showMain || typeof window === 'undefined') {
      return undefined;
    }

    const windows = Array.from(document.querySelectorAll('.home-window'));
    if (windows.length === 0) {
      return undefined;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      windows.forEach((windowEl) => windowEl.classList.add('is-visible'));
      return undefined;
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' },
    );

    windows.forEach((windowEl) => revealObserver.observe(windowEl));
    return () => revealObserver.disconnect();
  }, [showMain]);

  return (
    <div className="home-shell">
      {(!showMain || !projectsInView) && (
        <GhostCursor
          className="fixed inset-0 pointer-events-none z-[8]"
          trailLength={6}
          inertia={0.65}
          grainIntensity={0.02}
          bloomStrength={0.02}
          bloomRadius={0.4}
          brightness={0.85}
          color="#9CA3AF"
          edgeIntensity={0}
        />
      )}

      <TopBar
        musicOn={musicOn}
        onToggleMusic={() => setMusicOn((value) => !value)}
        onMenuClick={() => {
          projectsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
      />

      {showMain && (
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
          <div className="home-windows-stack">
            <section
              ref={heroSectionRef}
              className="home-window home-window--hero"
              style={{ '--reveal-delay': '0ms' }}
            >
              <HeroSection splineBgRef={splineBgRef} />
            </section>

            <div className="home-window home-window--about" style={{ '--reveal-delay': '110ms' }}>
              <AboutSection
                aboutSectionRef={aboutSectionRef}
                moonRefs={moonRefs}
                floatingTech={FLOATING_TECH}
                asteroidScale={ASTEROID_SCALE}
                lanyardDropRef={lanyardDropRef}
                showLanyardDrop={showLanyardDrop}
                onAboutAnimationComplete={triggerDrop}
                profileMassRef={profileMassRef}
                firstName={firstName}
                lastName={lastName}
              />
            </div>

            <div className="home-window home-window--projects" style={{ '--reveal-delay': '220ms' }}>
              <ProjectsSection sectionRef={projectsSectionRef} />
            </div>

            <div className="home-window home-window--contact" style={{ '--reveal-delay': '290ms' }}>
              <ContactSection sectionRef={contactSectionRef} />
            </div>
          </div>
        </Suspense>
      )}

      {showSplash && (
        <Suspense fallback={<div className="splash-screen" />}>
          <SplashIntro
            splashExit={splashExit}
            splineReady={splineReady}
            onSplineLoad={() => setSplineReady(true)}
          />
        </Suspense>
      )}

      <CustomScrollbar
        scrollbarVisible={scrollbarVisible}
        scrollThumbHeight={scrollThumbHeight}
        scrollThumbTop={scrollThumbTop}
      />
    </div>
  );
}
