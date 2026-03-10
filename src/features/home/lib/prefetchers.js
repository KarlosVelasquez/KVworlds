let hasPrefetchedProjects = false;

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
