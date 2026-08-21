import { useState } from 'react'
import { motion } from 'framer-motion'
import { skills } from '../../data/portfolio'
import './Skills.css'

const CATEGORIES = ['All', ...Array.from(new Set(skills.map(s => s.category)))]

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All'
    ? skills
    : skills.filter(s => s.category === activeCategory)

  return (
    <section className="section skills" id="skills">
      <div className="container">
        <p className="section-label">What I work with</p>
        <h2 className="section-title">Skills & Technologies</h2>
        <p className="section-subtitle">
          A curated set of tools and technologies I use to build exceptional software.
        </p>

        {/* Category Filter */}
        <div className="skills__filter">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`skills__filter-btn ${activeCategory === cat ? 'skills__filter-btn--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="skills__grid">
          {filtered.map((skill, i) => (
            <motion.div
              key={skill.id}
              className="skill-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
            >
              <div className="skill-card__top">
                <span className="skill-card__name">{skill.name}</span>
                <span className="skill-card__level">{skill.level}%</span>
              </div>
              <div className="skill-card__bar-track">
                <motion.div
                  className="skill-card__bar-fill"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.04 + 0.2, ease: 'easeOut' }}
                />
              </div>
              <span className="tag">{skill.category}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
