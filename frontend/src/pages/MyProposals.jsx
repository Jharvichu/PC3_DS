import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

const initialUserProposals = [
  {
    id: 101,
    title: 'Mejora de iluminación en barrio norte',
    summary: 'Aumentar puntos de luz en las calles principales del barrio norte.',
    votes: 45,
    status: 'En revisión',
    documents: ['Propuesta inicial', 'Presupuesto estimado'],
    revisions: ['Revisión 1: feedback ciudadano'],
  },
  {
    id: 102,
    title: 'Área de juegos infantil',
    summary: 'Crear un espacio seguro y moderno para niños en la plaza central.',
    votes: 32,
    status: 'Aprobada',
    documents: ['Diseño del parque', 'Estudio de seguridad'],
    revisions: ['Revisión 1: ajustes de diseño', 'Revisión 2: materiales seguros'],
  },
]

export default function MyProposals() {
  const navigate = useNavigate()
  const [userProposals, setUserProposals] = useState(initialUserProposals)
  const [selectedProposal, setSelectedProposal] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) navigate('/login', { replace: true })
  }, [navigate])

  const handleViewProposal = (proposal) => {
    setSelectedProposal(proposal)
  }

  const handleCloseModal = () => {
    setSelectedProposal(null)
  }

  const handleGoBack = () => {
    navigate('/home')
  }

  return (
    <div className={`proposal-page ${selectedProposal ? 'modal-open' : ''}`}>
      <header className="proposal-topbar">
        <div className="proposal-title">MIS PROPUESTAS</div>
        <div className="proposal-actions">
          <button className="nav-btn nav-btn-secondary" type="button" onClick={handleGoBack}>
            Ver propuestas de otros
          </button>
          <button className="nav-btn nav-btn-primary" type="button">
            + Crear propuesta
          </button>
          <div className="user-badge">USER</div>
        </div>
      </header>

      <section className="proposal-grid">
        {userProposals.length > 0 ? (
          userProposals.map((proposal) => (
            <article key={proposal.id} className="proposal-card">
              <div className="proposal-card-top">
                <span className="proposal-badge proposal-badge-user">{proposal.status}</span>
                <span className="proposal-votes">{proposal.votes} votos</span>
              </div>
              <h3>{proposal.title}</h3>
              <p>{proposal.summary}</p>
              <button className="proposal-view-btn" type="button" onClick={() => handleViewProposal(proposal)}>
                Ver detalles
              </button>
            </article>
          ))
        ) : (
          <div className="proposal-empty">No tienes propuestas aún.</div>
        )}
      </section>

      {selectedProposal && (
        <div className="proposal-modal-overlay" onClick={handleCloseModal}>
          <div className="proposal-modal" onClick={(event) => event.stopPropagation()}>
            <header className="proposal-modal-header">
              <h2>{selectedProposal.title}</h2>
              <button className="modal-close-btn" type="button" onClick={handleCloseModal}>
                ×
              </button>
            </header>

            <div className="proposal-modal-body">
              <div className="proposal-modal-left">
                <div className="proposal-section">
                  <h3>Documentos</h3>
                  <ul>
                    {selectedProposal.documents.map((doc, index) => (
                      <li key={index}>{doc}</li>
                    ))}
                  </ul>
                </div>
                <div className="proposal-section">
                  <h3>Revisiones</h3>
                  <ul>
                    {selectedProposal.revisions.map((revision, index) => (
                      <li key={index}>{revision}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="proposal-modal-right">
                <div className="proposal-description">
                  <h4>Descripción</h4>
                  <p>{selectedProposal.summary}</p>
                </div>

                <div className="proposal-status-badge">
                  <strong>Estado:</strong> {selectedProposal.status}
                </div>

                <button className="edit-proposal-btn" type="button">
                  Editar propuesta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
