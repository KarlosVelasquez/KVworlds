import { CrowdCanvas } from '@/components/ui/skiper-ui/skiper39';
import './ContactSection.css';

export default function ContactSection({ sectionRef }) {
  return (
    <section ref={sectionRef} className="contact-crowd-section" aria-label="Peeps canvas">
      <div className="contact-crowd-canvas-host" aria-hidden="true">
        <CrowdCanvas src="/images/peeps/all-peeps.png" rows={15} cols={7} />
      </div>
    </section>
  );
}
