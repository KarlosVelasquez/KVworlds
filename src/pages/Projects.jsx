import { Link } from 'react-router-dom';
import './Projects.css';
import { PROJECTS } from '@/features/projects/data';

export default function Projects() {
  return (
    <main className="projects-page">
      <div className="projects-noise" aria-hidden="true" />

      <header className="projects-header">
        <Link className="projects-back" to="/">
          Volver al inicio
        </Link>
        <p className="projects-kicker">Selected work</p>
        <h1>Mis Proyectos</h1>
        <p className="projects-subtitle">
          Una seleccion de productos y experiencias que he construido de extremo a extremo.
        </p>
      </header>

      <section className="projects-grid" aria-label="Lista de proyectos">
        {PROJECTS.map((project) => (
          <article className="project-card" key={project.title}>
            <div className="project-top">
              <span className="project-status">{project.status}</span>
              <h2>{project.title}</h2>
            </div>

            <p>{project.description}</p>

            <ul className="project-stack" aria-label={`Tecnologias de ${project.title}`}>
              {project.stack.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>

            <div className="project-actions">
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
          </article>
        ))}
      </section>
    </main>
  );
}
