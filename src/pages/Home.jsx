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

const SPLASH_DURATION = 3000;
const ASTEROID_SCALE = 0.6;
const LANYARD_DROP_DELAY_MS = 550;

export default function Home() {
  const firstName = 'KARLOS';
  const lastName = 'CAJIBIOY VELASQUEZ';

  const [splineReady, setSplineReady] = useState(false);
  const [showMain, setShowMain] = useState(false);
  const [splashExit, setSplashExit] = useState(false);
  const [musicOn, setMusicOn] = useState(true);

  const splineBgRef = useRef(null);
  const heroSectionRef = useRef(null);
  const aboutSectionRef = useRef(null);
  const projectsSectionRef = useRef(null);
  const moonRefs = useRef([]);
  const profileMassRef = useRef(null);
  const lanyardDropRef = useRef(null);

  const { scrollThumbTop, scrollThumbHeight, scrollbarVisible } = useHomeScrollbar();

  const { showLanyardDrop, triggerDrop } = useLanyardDropAnimation(lanyardDropRef, LANYARD_DROP_DELAY_MS);

  useSplineDragLock(showMain, splineBgRef);
  useFloatingTechPhysics(showMain, aboutSectionRef, moonRefs, profileMassRef);
  useHomeScrollTriggerPlaceholder({
    heroRef: heroSectionRef,
    aboutRef: aboutSectionRef,
    projectsRef: projectsSectionRef,
  });

  useEffect(() => {
    if (!splineReady) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setSplashExit(true);
      setTimeout(() => setShowMain(true), 1000);
    }, SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, [splineReady]);

  useEffect(() => {
    const cleanupIdle = scheduleIdlePrefetch(() => {
      prefetchHomeSections();
      prefetchProjectsRoute();
    }, 900);

    return cleanupIdle;
  }, []);

  useEffect(() => {
    const aboutEl = aboutSectionRef.current;
    const projectsEl = projectsSectionRef.current;

    if (!aboutEl && !projectsEl) {
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

    return () => observer.disconnect();
  }, [showMain]);

  return (
    <div className="relative bg-black w-full">
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

      <TopBar
        musicOn={musicOn}
        onToggleMusic={() => setMusicOn((value) => !value)}
        onMenuClick={() => {
          projectsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
      />

      {!showMain && (
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
          <SplashIntro
            splashExit={splashExit}
            splineReady={splineReady}
            onSplineLoad={() => setSplineReady(true)}
          />
        </Suspense>
      )}

      {showMain && (
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
          <section ref={heroSectionRef}>
            <HeroSection splineBgRef={splineBgRef} />
          </section>

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

          <ProjectsSection sectionRef={projectsSectionRef} />
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
