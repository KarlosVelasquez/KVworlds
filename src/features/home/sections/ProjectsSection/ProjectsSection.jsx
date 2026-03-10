import { PROJECTS } from '@/features/projects/data';
import StickyProjectCards from '@/features/projects/components/StickyProjectCards';
import './ProjectsSection.css';

export default function ProjectsSection({ sectionRef }) {
  return (
    <section ref={sectionRef} className="home-projects-section">
      <div className="home-projects-inner">
        <h2 className="home-projects-title">Projects</h2>
        <p className="home-projects-subtitle">
          Explore live demos and GitHub repositories. Some projects are private or currently in progress.
        </p>

        <StickyProjectCards projects={PROJECTS} />
      </div>
    </section>
  );
}
