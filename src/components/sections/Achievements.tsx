import { motion } from 'framer-motion'
import { Trophy, Code, BookOpen, Zap, ExternalLink, Github, Terminal } from 'lucide-react'
import { achievements, codingProfiles } from '../../data/portfolio'
import type { Achievement } from '../../data/portfolio'
import './Achievements.css'

const categoryIcons: Record<Achievement['category'], React.ReactNode> = {
  competitive: <Trophy size={16} />,
  academic: <BookOpen size={16} />,
  'open-source': <Code size={16} />,
  award: <Zap size={16} />,
}

const categoryColors: Record<Achievement['category'], string> = {
  competitive: '#fbbf24',
  academic: '#34d399',
  'open-source': '#60a5fa',
  award: '#f472b6',
}

const platformIcons: Record<string, React.ReactNode> = {
  github: <Github size={24} />,
  code: <Code size={24} />,
  terminal: <Terminal size={24} />,
}

export default function Achievements() {
  return (
    <section className="section achievements" id="achievements">
      <div className="container">
        <p className="section-label">Recognition & Credentials</p>
        <h2 className="section-title">Achievements</h2>
        <p className="section-subtitle">
          Highlights from competitive programming, academics, and open-source.
        </p>

        {/* Coding Profiles */}
        <div className="coding-profiles">
          {codingProfiles.map((profile, i) => (
            <motion.a
              key={profile.id}
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              className="coding-profile-card"
              style={{ '--profile-color': profile.color } as React.CSSProperties}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
            >
              <div className="coding-profile-card__icon">
                {platformIcons[profile.icon]}
              </div>
              <div className="coding-profile-card__body">
                <span className="coding-profile-card__platform">{profile.platform}</span>
                <span className="coding-profile-card__username">@{profile.username}</span>
                <span className="coding-profile-card__stats">{profile.stats}</span>
              </div>
              <ExternalLink size={16} className="coding-profile-card__external" />
            </motion.a>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="achievements__grid">
          {achievements.map((ach, i) => (
            <motion.div
              key={ach.id}
              className="ach-card card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <div
                className="ach-card__icon"
                style={{ color: categoryColors[ach.category], background: `${categoryColors[ach.category]}18` }}
              >
                {categoryIcons[ach.category]}
              </div>
              <div className="ach-card__body">
                <h3 className="ach-card__title">{ach.title}</h3>
                <p className="ach-card__desc">{ach.description}</p>
                <div className="ach-card__footer">
                  <span className="ach-card__date">{ach.date}</span>
                  {ach.url && (
                    <a href={ach.url} target="_blank" rel="noopener noreferrer" className="ach-card__link">
                      <ExternalLink size={13} /> View
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
