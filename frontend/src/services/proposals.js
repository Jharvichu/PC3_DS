const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'

function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!res.ok) {
    const errorBody = await res.text().catch(() => null)
    throw new Error(errorBody || 'Error en la petición')
  }

  return res.json()
}

export async function getProposals() {
  return request('/proposals')
}

export async function getMyProposals() {
  return request('/proposals/mine')
}

export async function getProposalById(id) {
  return request(`/proposals/${id}`)
}

export async function createProposal(title, summary, attachments = []) {
  return request('/proposals', {
    method: 'POST',
    body: JSON.stringify({ title, summary, attachments }),
  })
}

export async function createComment(proposalId, message) {
  return request(`/proposals/${proposalId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  })
}

export async function toggleSupport(proposalId) {
  return request(`/proposals/${proposalId}/support`, {
    method: 'POST',
  })
}
