import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function StickyProjectCards({ projects = [] }) {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const cardRefs = useRef([]);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const cards = cardRefs.current.filter(Boolean);
      const totalCards = cards.length;

      if (!stageRef.current || totalCards === 0) {
        return undefined;
      }

      cards.forEach((card, index) => {
        // Later cards must sit on top so previous cards hide behind them.
        card.style.zIndex = String(index + 1);
      });

      gsap.set(cards[0], { yPercent: 0, scale: 1, rotation: 0 });
      for (let i = 1; i < totalCards; i += 1) {
        gsap.set(cards[i], { yPercent: 100, scale: 1, rotation: 0 });
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: stageRef.current,
          start: 'top top',
          end: `+=${window.innerHeight * Math.max(1, totalCards - 1)}`,
          pin: true,
          scrub: 0.5,
          pinSpacing: true,
          invalidateOnRefresh: true,
        },
      });

      for (let i = 0; i < totalCards - 1; i += 1) {
        const currentCard = cards[i];
        const nextCard = cards[i + 1];

        timeline.to(
          currentCard,
          {
            scale: 0.72,
            rotation: 5,
            duration: 1,
            ease: 'none',
          },
          i,
        );

        timeline.to(
          nextCard,
          {
            yPercent: 0,
            duration: 1,
            ease: 'none',
          },
          i,
        );
      }

      const resizeObserver = new ResizeObserver(() => {
        ScrollTrigger.refresh();
      });

      if (rootRef.current) {
        resizeObserver.observe(rootRef.current);
      }

      return () => {
        resizeObserver.disconnect();
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    },
    { scope: rootRef, dependencies: [projects.length] },
  );

  return (
    <div className="sticky-projects-wrap" ref={rootRef}>
      <div className="sticky-projects-stage" ref={stageRef} aria-label="Lista de proyectos con transicion sticky">
        {projects.map((project, index) => (
          <article
            className="sticky-project-card"
            key={project.title}
            ref={(element) => {
              cardRefs.current[index] = element;
            }}
          >
            <img
              className="sticky-project-image"
              src={project.image || '/lanyard/lanyard.png'}
              alt={`Vista previa de ${project.title}`}
              loading="lazy"
            />

            <span className="sticky-project-status">{project.status}</span>
            <h3 className="sticky-project-title">{project.title}</h3>

            <div className="sticky-project-overlay">
              <p className="sticky-project-description">{project.description}</p>

              <div className="sticky-project-actions">
                {project.website || project.demo ? (
                  <a href={project.website || project.demo} target="_blank" rel="noopener noreferrer">
                    Visitar pagina web
                  </a>
                ) : (
                  <span className="is-disabled" aria-disabled="true">Visitar pagina web</span>
                )}

                {project.github || project.repo ? (
                  <a href={project.github || project.repo} target="_blank" rel="noopener noreferrer">
                    Ver repositorio GitHub
                  </a>
                ) : (
                  <span className="is-disabled" aria-disabled="true">Ver repositorio GitHub</span>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
