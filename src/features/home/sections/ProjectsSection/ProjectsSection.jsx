import { PROJECTS } from '@/features/projects/data';
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

        <div className="home-projects-grid" aria-label="Lista de proyectos">
          {PROJECTS.map((project) => (
            <article className="home-project-card" key={project.title}>
              <div className="home-project-top">
                <span className="home-project-status">{project.status}</span>
                <h3>{project.title}</h3>
              </div>

              <p>{project.description}</p>

              <ul className="home-project-stack" aria-label={`Tecnologias de ${project.title}`}>
                {project.stack.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>

              <div className="home-project-actions">
                <a href={project.demo} target="_blank" rel="noopener noreferrer">
                  Demo
                </a>
                <a href={project.repo} target="_blank" rel="noopener noreferrer">
                  Codigo
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
