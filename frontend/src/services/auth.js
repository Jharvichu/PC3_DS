const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'

export async function login(dni, signature) {
  if (!dni || !signature) {
    throw new Error('DNI y firma digital son obligatorios')
  }

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dni, signature }),
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => null)
      throw new Error(errText || 'DNI o firma digital inválidos')
    }

    const data = await res.json()
    return data.token
  } catch (error) {
    const errText = error instanceof Error ? error.message : 'Error en la autenticación'
    throw new Error(errText)
  }
}

export default { login }
