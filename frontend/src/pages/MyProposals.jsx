import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyProposals, getProposalById } from '../services/proposals'
import '../App.css'

export default function MyProposals() {
  const navigate = useNavigate()
  const [userProposals, setUserProposals] = useState([])
  const [selectedProposal, setSelectedProposal] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    loadMyProposals()
  }, [navigate])

  const loadMyProposals = async () => {
    try {
      const proposals = await getMyProposals()
      setUserProposals(proposals)
    } catch (error) {
      setUserProposals([])
    }
  }

  const handleViewProposal = async (proposalId) => {
    try {
      const proposal = await getProposalById(proposalId)
      setSelectedProposal(proposal)
    } catch (error) {
      console.error(error)
    }
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
          <button className="nav-btn nav-btn-primary" type="button" onClick={() => navigate('/home')}>
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
              <button className="proposal-view-btn" type="button" onClick={() => handleViewProposal(proposal.id)}>
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
                    {selectedProposal.documents?.map((doc, index) => (
                      <li key={index}>{doc}</li>
                    ))}
                  </ul>
                </div>
                <div className="proposal-section">
                  <h3>Revisiones</h3>
                  <ul>
                    {selectedProposal.revisions?.map((revision, index) => (
                      <li key={index}>{revision}</li>
                    ))}
                  </ul>
                </div>
                <div className="proposal-section">
                  <h3>Adjuntos</h3>
                  <ul>
                    {selectedProposal.attachments?.length > 0 ? (
                      selectedProposal.attachments.map((attachment, index) => (
                        <li key={index}>
                          {attachment.type === 'link' ? (
                            <a href={attachment.url} target="_blank" rel="noreferrer">
                              {attachment.label}
                            </a>
                          ) : (
                            <span>{attachment.label} ({attachment.url})</span>
                          )}
                        </li>
                      ))
                    ) : (
                      <li>No hay adjuntos</li>
                    )}
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
