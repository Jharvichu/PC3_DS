import { useState } from 'react'
import '../styles/Auth.css'

export default function AuthForm({ onSubmit }) {
  const [dni, setDni] = useState('')
  const [signature, setSignature] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await onSubmit({ dni: dni.trim(), signature })
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">PROPUESTA CIUDADANA</div>
          <p className="auth-subtitle">Ingresa tu DNI y firma digital. En modo demo puedes usar cualquier valor.</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="dni">DNI</label>
            <input
              id="dni"
              type="text"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              placeholder="Ingresa tu DNI"
              maxLength={20}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="signature">Firma Digital</label>
            <input
              id="signature"
              type="password"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="Ingresa tu firma digital"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}
