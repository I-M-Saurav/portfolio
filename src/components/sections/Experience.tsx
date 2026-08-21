import { motion } from 'framer-motion'
import { Briefcase, MapPin, Calendar } from 'lucide-react'
import { experience } from '../../data/portfolio'
import './Experience.css'

export default function Experience() {
  return (
    <section className="section experience" id="experience">
      <div className="container">
        <p className="section-label">Work History</p>
        <h2 className="section-title">Experience</h2>
        <p className="section-subtitle">
          Where I've applied my skills and made an impact.
        </p>

        <div className="exp__timeline">
          {experience.map((exp, i) => (
            <motion.div
              key={exp.id}
              className="exp__item"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {/* Timeline marker */}
              <div className="exp__marker">
                <div className="exp__dot" />
                {i < experience.length - 1 && <div className="exp__line" />}
              </div>

              {/* Card */}
              <div className="exp__card card">
                <div className="exp__card-top">
                  <div>
                    <h3 className="exp__role">{exp.role}</h3>
                    <div className="exp__company">
                      <Briefcase size={14} />
                      <span>{exp.company}</span>
                      <span className={`exp__type-badge exp__type-badge--${exp.type}`}>
                        {exp.type}
                      </span>
                    </div>
                  </div>
                  <div className="exp__meta">
                    <div className="exp__meta-item">
                      <Calendar size={13} />
                      <span>{exp.duration}</span>
                    </div>
                    <div className="exp__meta-item">
                      <MapPin size={13} />
                      <span>{exp.location}</span>
                    </div>
                  </div>
                </div>

                <ul className="exp__bullets">
                  {exp.description.map((bullet, j) => (
                    <li key={j} className="exp__bullet">{bullet}</li>
                  ))}
                </ul>

                <div className="exp__tech">
                  {exp.tech.map(t => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
