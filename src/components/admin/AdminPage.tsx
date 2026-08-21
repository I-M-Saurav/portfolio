import { useState } from 'react'
import { Lock, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AdminDashboard from './AdminDashboard'
import './AdminPage.css'

// Simple password gate — in production, replace with proper auth
const ADMIN_PASSWORD = 'admin123'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthed(true)
      setError('')
    } else {
      setError('Incorrect password')
      setPassword('')
    }
  }

  if (authed) return <AdminDashboard onLogout={() => setAuthed(false)} />

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <button className="admin-login__back" onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> Back to Portfolio
        </button>

        <div className="admin-login__icon">
          <Lock size={28} />
        </div>
        <h1 className="admin-login__title">Admin Access</h1>
        <p className="admin-login__subtitle">Enter your password to manage portfolio content</p>

        <form onSubmit={handleLogin} className="admin-login__form">
          <input
            id="admin-password"
            type="password"
            className={`admin-login__input ${error ? 'admin-login__input--error' : ''}`}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus
          />
          {error && <p className="admin-login__error">{error}</p>}
          <button type="submit" className="btn btn-primary admin-login__submit" id="admin-login-btn">
            <Lock size={16} /> Login
          </button>
        </form>

        <p className="admin-login__hint">
          Default password: <code>admin123</code>
        </p>
      </div>
    </div>
  )
}
