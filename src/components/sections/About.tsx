import { motion } from 'framer-motion'
import { MapPin, Mail, Download, Terminal } from 'lucide-react'
import { personalInfo, socialLinks } from '../../data/portfolio'
import './About.css'

const stats = [
  { label: 'Years Coding', value: '5+' },
  { label: 'Projects Built', value: '20+' },
  { label: 'Problems Solved', value: '500+' },
  { label: 'Open Source PRs', value: '10+' },
]

export default function About() {
  return (
    <section className="section about" id="about">
      <div className="container">
        <div className="about__grid">
          {/* Avatar Column */}
          <motion.div
            className="about__avatar-col"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="about__avatar-wrapper">
              <div className="about__avatar">
                <span className="about__avatar-initials">SK</span>
              </div>
              <div className="about__avatar-glow" />
              <div className="about__badge">
                <Terminal size={14} />
                <span>Open to Work</span>
              </div>
            </div>

            {/* Stats */}
            <div className="about__stats">
              {stats.map(s => (
                <div key={s.label} className="about__stat">
                  <span className="about__stat-value">{s.value}</span>
                  <span className="about__stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Text Column */}
          <motion.div
            className="about__text-col"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="section-label">About Me</p>
            <h2 className="section-title">Crafting Code<br />with Purpose</h2>
            <div className="divider" />

            <div className="about__bio">
              <p>
                I'm <strong>{personalInfo.name}</strong>, a software engineer with a deep passion
                for building systems that are fast, reliable, and elegant. My journey in programming
                started with competitive programming, and that mindset of analytical thinking shapes
                everything I build.
              </p>
              <p>
                I specialize in backend systems, distributed computing, and full-stack development.
                Whether it's designing microservices at scale or squeezing out that last millisecond
                of performance, I thrive on engineering challenges that push limits.
              </p>
              <p>
                When I'm not coding, you'll find me on Codeforces working through algorithmic
                problems, contributing to open-source, or mentoring fellow programmers.
              </p>
            </div>

            <div className="about__meta">
              <div className="about__meta-item">
                <MapPin size={16} />
                <span>{personalInfo.location}</span>
              </div>
              <div className="about__meta-item">
                <Mail size={16} />
                <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
              </div>
            </div>

            <div className="about__actions">
              <a href={personalInfo.resumeUrl} download className="btn btn-primary">
                <Download size={16} />
                Download Resume
              </a>
              <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                View GitHub
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
