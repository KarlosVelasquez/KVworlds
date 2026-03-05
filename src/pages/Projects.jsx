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
              <a href={project.demo} target="_blank" rel="noopener noreferrer">
                Demo
              </a>
              <a href={project.repo} target="_blank" rel="noopener noreferrer">
                Codigo
              </a>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
