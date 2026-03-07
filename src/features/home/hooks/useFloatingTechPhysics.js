import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { clamp } from '@/shared/lib/clamp';

export function useFloatingTechPhysics(showMain, aboutSectionRef, moonRefs, profileMassRef) {
  const pointerRef = useRef({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    if (!showMain) {
      return undefined;
    }

    let disposed = false;
    let initFrameId = null;
    let cleanupPhysics = () => {};

    const initializePhysics = () => {
      if (disposed) {
        return;
      }

      const section = aboutSectionRef.current;
      const moons = moonRefs.current.filter(Boolean);
      if (!section || moons.length === 0) {
        // About section is lazy-loaded; retry until refs are mounted.
        initFrameId = window.requestAnimationFrame(initializePhysics);
        return;
      }

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

      const profileObstacle = profileRect
        ? {
            cx: profileRect.left - sectionRect.left + profileRect.width / 2,
            cy: profileRect.top - sectionRect.top + profileRect.height / 2,
            rx: profileRect.width * 0.34,
            ry: profileRect.height * 0.5,
          }
        : null;

      const resolveProfileCollision = (state) => {
        if (!profileObstacle) {
          return;
        }

        const centerX = state.x + state.size / 2;
        const centerY = state.y + state.size / 2;

        let dx = centerX - profileObstacle.cx;
        let dy = centerY - profileObstacle.cy;

        if (Math.abs(dx) < 0.0001 && Math.abs(dy) < 0.0001) {
          dy = -0.001;
        }

        const radiusX = profileObstacle.rx + state.size * 0.5 + 2;
        const radiusY = profileObstacle.ry + state.size * 0.5 + 2;

        const scaledDistance = Math.sqrt((dx * dx) / (radiusX * radiusX) + (dy * dy) / (radiusY * radiusY));

        if (scaledDistance >= 1) {
          return;
        }

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

      cleanupPhysics = () => {
        gsap.ticker.remove(tick);
        window.removeEventListener('resize', onResize);
        section.removeEventListener('pointermove', handlePointerMove);
        section.removeEventListener('pointerleave', handlePointerLeave);
      };
    };

    initializePhysics();

    return () => {
      disposed = true;
      if (initFrameId !== null) {
        window.cancelAnimationFrame(initFrameId);
      }
      cleanupPhysics();
    };
  }, [showMain, aboutSectionRef, moonRefs, profileMassRef]);
}
