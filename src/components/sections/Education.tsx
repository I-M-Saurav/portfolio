import { motion } from 'framer-motion'
import { GraduationCap, MapPin, Calendar, Award } from 'lucide-react'
import { education } from '../../data/portfolio'
import './Education.css'

export default function Education() {
  return (
    <section className="section education" id="education">
      <div className="container">
        <p className="section-label">Academic Background</p>
        <h2 className="section-title">Education</h2>
        <p className="section-subtitle">
          The foundation that shaped my technical thinking.
        </p>

        <div className="education__grid">
          {education.map((edu, i) => (
            <motion.div
              key={edu.id}
              className="edu-card card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="edu-card__header">
                <div className="edu-card__icon">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <h3 className="edu-card__institution">{edu.institution}</h3>
                  <p className="edu-card__degree">{edu.degree} in {edu.field}</p>
                </div>
              </div>

              <div className="edu-card__meta">
                <div className="edu-card__meta-item">
                  <Calendar size={14} />
                  <span>{edu.duration}</span>
                </div>
                <div className="edu-card__meta-item">
                  <MapPin size={14} />
                  <span>{edu.location}</span>
                </div>
                {edu.gpa && (
                  <div className="edu-card__meta-item">
                    <Award size={14} />
                    <span>GPA: <strong>{edu.gpa}</strong></span>
                  </div>
                )}
              </div>

              {edu.activities && (
                <div className="edu-card__activities">
                  <p className="edu-card__activities-title">Activities & Roles</p>
                  <ul>
                    {edu.activities.map((act, j) => (
                      <li key={j} className="edu-card__activity">{act}</li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
