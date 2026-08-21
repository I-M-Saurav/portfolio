import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Github, Linkedin, Terminal, Mail, MapPin } from 'lucide-react'
import { personalInfo, socialLinks } from '../../data/portfolio'
import './Contact.css'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    // Simulate send (in production, integrate with EmailJS / Formspree)
    setTimeout(() => {
      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
    }, 1200)
  }

  return (
    <section className="section contact" id="contact">
      <div className="container">
        <p className="section-label">Get In Touch</p>
        <h2 className="section-title">Let's Work Together</h2>
        <p className="section-subtitle">
          I'm currently open to new opportunities. Whether you have a project, question, or just want to say hi — my inbox is open.
        </p>

        <div className="contact__grid">
          {/* Info */}
          <motion.div
            className="contact__info"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="contact__info-items">
              <div className="contact__info-item">
                <div className="contact__info-icon"><Mail size={20} /></div>
                <div>
                  <p className="contact__info-label">Email</p>
                  <a href={`mailto:${personalInfo.email}`} className="contact__info-value">{personalInfo.email}</a>
                </div>
              </div>
              <div className="contact__info-item">
                <div className="contact__info-icon"><MapPin size={20} /></div>
                <div>
                  <p className="contact__info-label">Location</p>
                  <p className="contact__info-value">{personalInfo.location}</p>
                </div>
              </div>
            </div>

            <div className="contact__socials">
              <p className="contact__socials-title">Find me on</p>
              <div className="contact__social-links">
                <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="contact__social-btn" id="contact-github">
                  <Github size={20} />
                  <span>GitHub</span>
                </a>
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="contact__social-btn" id="contact-linkedin">
                  <Linkedin size={20} />
                  <span>LinkedIn</span>
                </a>
                <a href={socialLinks.codeforces} target="_blank" rel="noopener noreferrer" className="contact__social-btn" id="contact-codeforces">
                  <Terminal size={20} />
                  <span>Codeforces</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            className="contact__form card"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="contact__form-group">
              <label htmlFor="contact-name" className="contact__label">Name</label>
              <input
                id="contact-name"
                type="text"
                className="contact__input"
                placeholder="Your name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div className="contact__form-group">
              <label htmlFor="contact-email" className="contact__label">Email</label>
              <input
                id="contact-email"
                type="email"
                className="contact__input"
                placeholder="your@email.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div className="contact__form-group">
              <label htmlFor="contact-message" className="contact__label">Message</label>
              <textarea
                id="contact-message"
                className="contact__input contact__textarea"
                placeholder="Tell me about your project or just say hi..."
                rows={5}
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary contact__submit"
              disabled={status === 'sending' || status === 'sent'}
              id="contact-submit"
            >
              {status === 'idle' && <><Send size={16} /> Send Message</>}
              {status === 'sending' && 'Sending...'}
              {status === 'sent' && '✓ Message Sent!'}
            </button>
          </motion.form>
        </div>

        {/* Footer */}
        <div className="contact__footer">
          <p className="contact__footer-text">
            Built with <span className="text-accent">♥</span> by Saurav Kumar · {new Date().getFullYear()}
          </p>
          <a href="/admin" className="contact__admin-link">Admin</a>
        </div>
      </div>
    </section>
  )
}
