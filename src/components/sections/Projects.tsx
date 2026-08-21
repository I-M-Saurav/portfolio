import { useState } from 'react'
import { motion } from 'framer-motion'
import { Github, ExternalLink, Star } from 'lucide-react'
import { projects } from '../../data/portfolio'
import './Projects.css'

export default function Projects() {
  const [showAll, setShowAll] = useState(false)
  const displayed = showAll ? projects : projects.filter(p => p.featured)

  return (
    <section className="section projects" id="projects">
      <div className="container">
        <p className="section-label">Things I've built</p>
        <h2 className="section-title">Featured Projects</h2>
        <p className="section-subtitle">
          A selection of projects that showcase my skills across different domains.
        </p>

        <div className="projects__grid">
          {displayed.map((project, i) => (
            <motion.div
              key={project.id}
              className={`project-card ${project.featured ? 'project-card--featured' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              {/* Header */}
              <div className="project-card__header">
                <div className="project-card__icon">
                  <Star size={18} />
                </div>
                <div className="project-card__links">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                       className="project-card__link" aria-label="View on GitHub">
                      <Github size={18} />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                       className="project-card__link" aria-label="Live demo">
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
              </div>

              {/* Body */}
              <h3 className="project-card__title">{project.title}</h3>
              <p className="project-card__desc">{project.description}</p>

              {/* Tech Stack */}
              <div className="project-card__tech">
                {project.tech.map(t => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {projects.length > projects.filter(p => p.featured).length && (
          <div className="projects__more">
            <button
              className="btn btn-outline"
              onClick={() => setShowAll(s => !s)}
            >
              {showAll ? 'Show Less' : `View All ${projects.length} Projects`}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
