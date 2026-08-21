import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  LogOut, FolderOpen, Briefcase, Trophy, Code2, GraduationCap,
  Plus, Trash2, Edit3, Save, X
} from 'lucide-react'
import {
  projects as initialProjects,
  experience as initialExperience,
  achievements as initialAchievements,
  skills as initialSkills,
} from '../../data/portfolio'
import type { Project, Experience, Achievement, Skill } from '../../data/portfolio'
import './AdminDashboard.css'

type Tab = 'projects' | 'experience' | 'achievements' | 'skills'

interface AdminDashboardProps {
  onLogout: () => void
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('projects')

  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [experience, setExperience] = useState<Experience[]>(initialExperience)
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements)
  const [skills, setSkills] = useState<Skill[]>(initialSkills)

  const tabs = [
    { id: 'projects' as Tab, label: 'Projects', icon: <FolderOpen size={16} />, count: projects.length },
    { id: 'experience' as Tab, label: 'Experience', icon: <Briefcase size={16} />, count: experience.length },
    { id: 'achievements' as Tab, label: 'Achievements', icon: <Trophy size={16} />, count: achievements.length },
    { id: 'skills' as Tab, label: 'Skills', icon: <Code2 size={16} />, count: skills.length },
  ]

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">
          <GraduationCap size={20} />
          <span>Portfolio Admin</span>
        </div>

        <nav className="admin-sidebar__nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`admin-sidebar__item ${activeTab === tab.id ? 'admin-sidebar__item--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              id={`admin-tab-${tab.id}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span className="admin-sidebar__count">{tab.count}</span>
            </button>
          ))}
        </nav>

        <button className="admin-sidebar__logout" onClick={onLogout} id="admin-logout">
          <LogOut size={16} /> Logout
        </button>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <div className="admin-main__header">
          <h1 className="admin-main__title">{tabs.find(t => t.id === activeTab)?.label}</h1>
          <p className="admin-main__subtitle">Manage your portfolio content</p>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === 'projects' && (
            <ProjectsEditor projects={projects} setProjects={setProjects} />
          )}
          {activeTab === 'experience' && (
            <ExperienceEditor experience={experience} setExperience={setExperience} />
          )}
          {activeTab === 'achievements' && (
            <AchievementsEditor achievements={achievements} setAchievements={setAchievements} />
          )}
          {activeTab === 'skills' && (
            <SkillsEditor skills={skills} setSkills={setSkills} />
          )}
        </motion.div>
      </main>
    </div>
  )
}

/* -------- Projects Editor -------- */
function ProjectsEditor({
  projects, setProjects
}: { projects: Project[]; setProjects: React.Dispatch<React.SetStateAction<Project[]>> }) {
  const [editing, setEditing] = useState<Project | null>(null)

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  const saveProject = (p: Project) => {
    setProjects(prev => {
      const exists = prev.find(x => x.id === p.id)
      if (exists) return prev.map(x => x.id === p.id ? p : x)
      return [...prev, p]
    })
    setEditing(null)
  }

  const newProject: Project = {
    id: `p${Date.now()}`, title: '', description: '', tech: [], featured: false
  }

  return (
    <div className="admin-editor">
      <div className="admin-editor__toolbar">
        <button className="btn btn-primary" onClick={() => setEditing(newProject)} id="add-project-btn">
          <Plus size={16} /> Add Project
        </button>
      </div>

      {editing && (
        <ProjectForm project={editing} onSave={saveProject} onCancel={() => setEditing(null)} />
      )}

      <div className="admin-table">
        {projects.map(p => (
          <div key={p.id} className="admin-table__row">
            <div className="admin-table__info">
              <p className="admin-table__name">{p.title || 'Untitled'}</p>
              <p className="admin-table__sub">{p.tech.join(', ')}</p>
            </div>
            <div className="admin-table__badges">
              {p.featured && <span className="admin-badge admin-badge--green">Featured</span>}
            </div>
            <div className="admin-table__actions">
              <button className="admin-icon-btn" onClick={() => setEditing(p)} title="Edit">
                <Edit3 size={15} />
              </button>
              <button className="admin-icon-btn admin-icon-btn--danger" onClick={() => deleteProject(p.id)} title="Delete">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProjectForm({ project, onSave, onCancel }: { project: Project; onSave: (p: Project) => void; onCancel: () => void }) {
  const [form, setForm] = useState(project)
  return (
    <div className="admin-form-panel">
      <div className="admin-form-panel__header">
        <h3>{project.title ? 'Edit Project' : 'New Project'}</h3>
        <button onClick={onCancel} className="admin-icon-btn"><X size={18} /></button>
      </div>
      <div className="admin-form-grid">
        <div className="admin-form-group admin-form-group--full">
          <label>Title</label>
          <input className="admin-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
        </div>
        <div className="admin-form-group admin-form-group--full">
          <label>Description</label>
          <textarea className="admin-input admin-textarea" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        </div>
        <div className="admin-form-group">
          <label>Tech (comma-separated)</label>
          <input className="admin-input" value={form.tech.join(', ')} onChange={e => setForm(f => ({ ...f, tech: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))} />
        </div>
        <div className="admin-form-group">
          <label>GitHub URL</label>
          <input className="admin-input" value={form.githubUrl || ''} onChange={e => setForm(f => ({ ...f, githubUrl: e.target.value }))} />
        </div>
        <div className="admin-form-group">
          <label>Live URL</label>
          <input className="admin-input" value={form.liveUrl || ''} onChange={e => setForm(f => ({ ...f, liveUrl: e.target.value }))} />
        </div>
        <div className="admin-form-group">
          <label className="admin-checkbox-label">
            <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} />
            Featured project
          </label>
        </div>
      </div>
      <div className="admin-form-panel__footer">
        <button className="btn btn-outline" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary" onClick={() => onSave(form)}><Save size={15} /> Save</button>
      </div>
    </div>
  )
}

/* -------- Experience Editor -------- */
function ExperienceEditor({
  experience, setExperience
}: { experience: Experience[]; setExperience: React.Dispatch<React.SetStateAction<Experience[]>> }) {
  const deleteExp = (id: string) => setExperience(prev => prev.filter(e => e.id !== id))

  return (
    <div className="admin-editor">
      <div className="admin-editor__toolbar">
        <p className="admin-editor__note">Edit <code>src/data/portfolio.ts</code> to add experience entries.</p>
      </div>
      <div className="admin-table">
        {experience.map(exp => (
          <div key={exp.id} className="admin-table__row">
            <div className="admin-table__info">
              <p className="admin-table__name">{exp.role} @ {exp.company}</p>
              <p className="admin-table__sub">{exp.duration} · {exp.location}</p>
            </div>
            <div className="admin-table__badges">
              <span className={`admin-badge admin-badge--${exp.type === 'full-time' ? 'blue' : 'purple'}`}>
                {exp.type}
              </span>
            </div>
            <div className="admin-table__actions">
              <button className="admin-icon-btn admin-icon-btn--danger" onClick={() => deleteExp(exp.id)} title="Delete">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* -------- Achievements Editor -------- */
function AchievementsEditor({
  achievements, setAchievements
}: { achievements: Achievement[]; setAchievements: React.Dispatch<React.SetStateAction<Achievement[]>> }) {
  const deleteAch = (id: string) => setAchievements(prev => prev.filter(a => a.id !== id))

  return (
    <div className="admin-editor">
      <div className="admin-table">
        {achievements.map(ach => (
          <div key={ach.id} className="admin-table__row">
            <div className="admin-table__info">
              <p className="admin-table__name">{ach.title}</p>
              <p className="admin-table__sub">{ach.description.slice(0, 80)}...</p>
            </div>
            <div className="admin-table__badges">
              <span className="admin-badge admin-badge--yellow">{ach.category}</span>
              <span className="admin-badge">{ach.date}</span>
            </div>
            <div className="admin-table__actions">
              <button className="admin-icon-btn admin-icon-btn--danger" onClick={() => deleteAch(ach.id)} title="Delete">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* -------- Skills Editor -------- */
function SkillsEditor({
  skills, setSkills
}: { skills: Skill[]; setSkills: React.Dispatch<React.SetStateAction<Skill[]>> }) {
  const deleteSkill = (id: string) => setSkills(prev => prev.filter(s => s.id !== id))
  const [adding, setAdding] = useState(false)
  const [newSkill, setNewSkill] = useState<Skill>({ id: `s${Date.now()}`, name: '', category: '', level: 80 })

  const saveSkill = () => {
    setSkills(prev => [...prev, { ...newSkill, id: `s${Date.now()}` }])
    setAdding(false)
    setNewSkill({ id: '', name: '', category: '', level: 80 })
  }

  return (
    <div className="admin-editor">
      <div className="admin-editor__toolbar">
        <button className="btn btn-primary" onClick={() => setAdding(a => !a)} id="add-skill-btn">
          <Plus size={16} /> Add Skill
        </button>
      </div>

      {adding && (
        <div className="admin-form-panel">
          <div className="admin-form-panel__header">
            <h3>New Skill</h3>
            <button onClick={() => setAdding(false)} className="admin-icon-btn"><X size={18} /></button>
          </div>
          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label>Name</label>
              <input className="admin-input" value={newSkill.name} onChange={e => setNewSkill(s => ({ ...s, name: e.target.value }))} />
            </div>
            <div className="admin-form-group">
              <label>Category</label>
              <input className="admin-input" value={newSkill.category} onChange={e => setNewSkill(s => ({ ...s, category: e.target.value }))} />
            </div>
            <div className="admin-form-group admin-form-group--full">
              <label>Level: {newSkill.level}%</label>
              <input type="range" min={0} max={100} value={newSkill.level} onChange={e => setNewSkill(s => ({ ...s, level: Number(e.target.value) }))} className="admin-range" />
            </div>
          </div>
          <div className="admin-form-panel__footer">
            <button className="btn btn-outline" onClick={() => setAdding(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={saveSkill}><Save size={15} /> Save</button>
          </div>
        </div>
      )}

      <div className="admin-table">
        {skills.map(skill => (
          <div key={skill.id} className="admin-table__row">
            <div className="admin-table__info">
              <p className="admin-table__name">{skill.name}</p>
              <div className="admin-skill-bar">
                <div className="admin-skill-bar__fill" style={{ width: `${skill.level}%` }} />
              </div>
            </div>
            <div className="admin-table__badges">
              <span className="admin-badge admin-badge--blue">{skill.category}</span>
              <span className="admin-badge">{skill.level}%</span>
            </div>
            <div className="admin-table__actions">
              <button className="admin-icon-btn admin-icon-btn--danger" onClick={() => deleteSkill(skill.id)} title="Delete">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
