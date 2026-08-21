import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Skills from './components/sections/Skills'
import Projects from './components/sections/Projects'
import Experience from './components/sections/Experience'
import Achievements from './components/sections/Achievements'
import Education from './components/sections/Education'
import Contact from './components/sections/Contact'
import AdminPage from './components/admin/AdminPage'
import './App.css'

function PortfolioPage() {
  return (
    <div className="portfolio-wrapper">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Achievements />
        <Education />
        <Contact />
      </main>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<PortfolioPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  )
}

export default App
