import { CrowdCanvas } from '@/components/ui/skiper-ui/skiper39';
import { Github, Linkedin, Mail } from 'lucide-react';
import './ContactSection.css';

export default function ContactSection({ sectionRef }) {
  const githubUrl = 'https://github.com/tu-usuario';
  const linkedinUrl = 'https://www.linkedin.com/in/tu-usuario';
  const emailAddress = 'tu-correo@ejemplo.com';

  return (
    <section ref={sectionRef} className="contact-crowd-section" aria-label="Peeps canvas">
      <div className="contact-crowd-canvas-host" aria-hidden="true">
        <CrowdCanvas src="/images/peeps/all-peeps.png" rows={15} cols={7} />
      </div>

      <h2 className="contact-work-title">Open to Work</h2>

      <div className="contact-links" aria-label="Enlaces de contacto">
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-link"
          aria-label="Abrir perfil de GitHub"
          title="GitHub"
        >
          <Github size={34} />
          <span>GitHub</span>
        </a>

        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-link"
          aria-label="Abrir perfil de LinkedIn"
          title="LinkedIn"
        >
          <Linkedin size={34} />
          <span>LinkedIn</span>
        </a>

        <a
          href={`mailto:${emailAddress}`}
          className="contact-link"
          aria-label="Enviar correo"
          title="Correo"
        >
          <Mail size={34} />
          <span>Correo</span>
        </a>
      </div>
    </section>
  );
}
