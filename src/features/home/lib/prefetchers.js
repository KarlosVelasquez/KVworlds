let hasPrefetchedHomeHeavy = false;
let hasPrefetchedHomeSections = false;
let hasPrefetchedProjects = false;

export function prefetchHomeHeavyChunks() {
  if (hasPrefetchedHomeHeavy) {
    return;
  }

  hasPrefetchedHomeHeavy = true;

  Promise.allSettled([
    import('@/components/Lanyard'),
    import('@/components/LightRays'),
    import('@splinetool/react-spline'),
  ]);
}

export function prefetchHomeSections() {
  if (hasPrefetchedHomeSections) {
    return;
  }

  hasPrefetchedHomeSections = true;

  Promise.allSettled([
    import('@/features/home/sections/AboutSection/AboutSection'),
    import('@/features/home/sections/ProjectsSection/ProjectsSection'),
    import('@/features/home/sections/HeroSection/HeroSection'),
    import('@/features/home/sections/ContactSection/ContactSection'),
  ]);
}

export function prefetchProjectsRoute() {
  if (hasPrefetchedProjects) {
    return;
  }

  hasPrefetchedProjects = true;

  Promise.allSettled([
    import('@/pages/Projects'),
    import('@/features/projects/data/projects'),
  ]);
}

export function scheduleIdlePrefetch(task, timeout = 1200) {
  if (typeof window === 'undefined') {
    task();
    return () => {};
  }

  if ('requestIdleCallback' in window) {
    const idleId = window.requestIdleCallback(() => task(), { timeout });
    return () => window.cancelIdleCallback(idleId);
  }

  const timerId = window.setTimeout(() => task(), 350);
  return () => window.clearTimeout(timerId);
}
