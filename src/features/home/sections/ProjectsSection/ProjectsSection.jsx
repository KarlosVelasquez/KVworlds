import { PROJECTS } from '@/features/projects/data';
import StickyProjectCards from '@/features/projects/components/StickyProjectCards';
import './ProjectsSection.css';

export default function ProjectsSection({ sectionRef }) {
  return (
    <section ref={sectionRef} className="home-projects-section">
      <div className="home-projects-inner">
        <p className="home-projects-kicker">Selected work</p>
        <h2 className="home-projects-title">Projects</h2>
        <p className="home-projects-subtitle">
          Esta seccion queda justo debajo de About me para que luego le conectes una navegacion premium con GSAP.
        </p>

        <StickyProjectCards projects={PROJECTS} />
      </div>
    </section>
  );
}
