import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, Github, Linkedin, Code, FileText, Terminal } from 'lucide-react'
import { personalInfo, socialLinks } from '../../data/portfolio'
import './Hero.css'

const TYPING_STRINGS = [
  'Software Engineer',
  'Competitive Programmer',
  'Open-Source Contributor',
  'System Designer',
  'Problem Solver',
]

function useTypingEffect(strings: string[], speed = 80, pause = 2000) {
  const [displayed, setDisplayed] = useState('')
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'erasing'>('typing')
  const [stringIdx, setStringIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)

  useEffect(() => {
    let timeout: number
    const current = strings[stringIdx]

    if (phase === 'typing') {
      if (charIdx < current.length) {
        timeout = window.setTimeout(() => {
          setDisplayed(current.slice(0, charIdx + 1))
          setCharIdx(c => c + 1)
        }, speed)
      } else {
        timeout = window.setTimeout(() => setPhase('pausing'), pause)
      }
    } else if (phase === 'pausing') {
      timeout = window.setTimeout(() => setPhase('erasing'), 200)
    } else if (phase === 'erasing') {
      if (charIdx > 0) {
        timeout = window.setTimeout(() => {
          setDisplayed(current.slice(0, charIdx - 1))
          setCharIdx(c => c - 1)
        }, speed / 2)
      } else {
        setStringIdx(i => (i + 1) % strings.length)
        setPhase('typing')
      }
    }

    return () => clearTimeout(timeout)
  }, [phase, charIdx, stringIdx, strings, speed, pause])

  return displayed
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const typed = useTypingEffect(TYPING_STRINGS)

  // Particle/grid background
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let animId: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles: { x: number; y: number; vx: number; vy: number; alpha: number }[] = []
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.4 + 0.1,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 212, 255, ${p.alpha})`
        ctx.fill()
      })

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(0, 212, 255, ${0.08 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const handleScrollDown = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero" id="hero">
      <canvas ref={canvasRef} className="hero__canvas" />

      {/* Glowing orbs */}
      <div className="hero__orb hero__orb--1" />
      <div className="hero__orb hero__orb--2" />

      <div className="container hero__content">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="hero__greeting mono">
            <span className="text-accent">$</span> hello_world.sh
          </p>

          <h1 className="hero__name">
            {personalInfo.name.split(' ').map((word, i) => (
              <span key={i} className={i === 1 ? 'text-gradient' : ''}>
                {word}{i === 0 ? ' ' : ''}
              </span>
            ))}
          </h1>

          <div className="hero__tagline">
            <span className="text-accent">&gt; </span>
            <span className="hero__typed">{typed}</span>
            <span className="hero__cursor">|</span>
          </div>

          <p className="hero__bio">{personalInfo.bio}</p>

          <div className="hero__actions">
            <a href={personalInfo.resumeUrl} className="btn btn-primary" download>
              <FileText size={18} />
              View Resume
            </a>
            <a href="#projects" className="btn btn-outline"
              onClick={e => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) }}>
              <Code size={18} />
              See My Work
            </a>
          </div>

          <div className="hero__socials">
            <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="hero__social-link" aria-label="GitHub">
              <Github size={20} />
            </a>
            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hero__social-link" aria-label="LinkedIn">
              <Linkedin size={20} />
            </a>
            <a href={socialLinks.codeforces} target="_blank" rel="noopener noreferrer" className="hero__social-link" aria-label="Codeforces">
              <Terminal size={20} />
            </a>
          </div>
        </motion.div>

        {/* Floating code card */}
        <motion.div
          className="hero__code-card"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero__code-card-header">
            <div className="hero__code-dot" style={{ background: '#ff5f57' }} />
            <div className="hero__code-dot" style={{ background: '#febc2e' }} />
            <div className="hero__code-dot" style={{ background: '#28c840' }} />
            <span className="hero__code-filename">saurav.cpp</span>
          </div>
          <pre className="hero__code-body"><code>{`// Engineering excellence since 2020

class SauravKumar {
public:
  string name = "Saurav Kumar";
  string role = "Software Engineer";
  
  vector<string> languages = {
    "C++", "Python", "TypeScript", "Go"
  };
  
  int solve(Problem& p) {
    return optimize(
      design(understand(p))
    );
  }
  
  // Always learning, always building
  ~SauravKumar() { contribute(); }
};`}</code></pre>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        className="hero__scroll-btn"
        onClick={handleScrollDown}
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        aria-label="Scroll down"
      >
        <ArrowDown size={20} />
      </motion.button>
    </section>
  )
}
