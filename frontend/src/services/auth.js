const API_BASE = 'http://localhost:8000/api/auth'

export async function login(dni, signature) {
  if (!dni || !signature) {
    throw new Error('DNI y firma digital son obligatorios')
  }

  try {
    const res = await fetch(`${API_BASE}/login`, {
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
    // Si no hay backend disponible, permitimos un modo demo con cualquier DNI
    if (error instanceof TypeError || error.message.includes('Failed to fetch')) {
      return `demo-token-${dni}`
    }
    throw error
  }
}

export default { login }
