import { ArrowUpRight } from "lucide-react";
import { PROFILE } from "@/constants/profile";

export function Contact() {
  return (
    <section id="contact" className="contact-section">
      <p className="eyebrow">LET’S MAKE SOMETHING MEANINGFUL</p>
      <div className="contact-heading">
        <h2>
          Good things start
          <br />
          with <em>a conversation.</em>
        </h2>
        <a
          className="contact-arrow"
          href={`mailto:${PROFILE.email}`}
          aria-label="Start a conversation via email"
        >
          <ArrowUpRight />
        </a>
      </div>
      <div className="contact-bottom">
        <div>
          <p>
            Have an idea, a project, or just want to say hello?
            <br />
            I’d love to hear from you.
          </p>
          <div className="contact-socials">
            <a href={PROFILE.github} target="_blank" rel="noreferrer">
              GitHub <ArrowUpRight size={13} />
            </a>
            <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">
              LinkedIn <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
        <a href={`mailto:${PROFILE.email}`}>
          {PROFILE.email} <ArrowUpRight size={18} />
        </a>
      </div>
    </section>
  );
}
