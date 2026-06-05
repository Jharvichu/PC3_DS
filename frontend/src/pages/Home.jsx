import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  createComment,
  createProposal,
  getProposalById,
  getProposals,
  toggleSupport,
} from '../services/proposals'
import '../App.css'

const initialProposals = [
  {
    id: 1,
    title: 'Parques públicos para todos',
    summary: 'Crear más espacios verdes y mejorar la iluminación en los parques de la ciudad.',
    votes: 128,
    documents: ['Plan estratégico 2026', 'Informe de seguridad urbana', 'Estudio de impacto ambiental'],
    revisions: ['Revisión 1: comentarios ciudadanos', 'Revisión 2: ajustes de presupuesto'],
  },
  {
    id: 2,
    title: 'Transporte sostenible',
    summary: 'Aumentar la frecuencia de transporte público eléctrico y bicicletas compartidas.',
    votes: 98,
    documents: ['Propuesta de rutas eléctricas', 'Estudio de movilidad', 'Carta de apoyo de vecinos'],
    revisions: ['Revisión 1: mejoras de accesibilidad', 'Revisión 2: revisión de costos'],
  },
  {
    id: 3,
    title: 'Cultura en barrios',
    summary: 'Financiar actividades culturales en barrios con menos acceso a eventos.',
    votes: 76,
    documents: ['Cronograma cultural', 'Solicitud de recursos', 'Encuesta de interés comunitario'],
    revisions: ['Revisión 1: nuevos distritos incluidos', 'Revisión 2: ajuste de patrocinadores'],
  },
  {
    id: 4,
    title: 'Reciclaje en colegios',
    summary: 'Implementar puntos de reciclaje y educación ambiental en escuelas.',
    votes: 64,
    documents: ['Guía de reciclaje escolar', 'Manual de educación ambiental', 'Informe de implementación piloto'],
    revisions: ['Revisión 1: formación docente', 'Revisión 2: recursos adicionales'],
  },
]

export default function Home() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [proposals, setProposals] = useState(initialProposals)
  const [selectedProposal, setSelectedProposal] = useState(null)
  const [commentText, setCommentText] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newProposal, setNewProposal] = useState({ title: '', summary: '' })
  const [attachments, setAttachments] = useState([])
  const [attachmentLabel, setAttachmentLabel] = useState('')
  const [attachmentUrl, setAttachmentUrl] = useState('')
  const [attachmentType, setAttachmentType] = useState('link')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    loadProposals()
  }, [navigate])

  const loadProposals = async () => {
    try {
      const result = await getProposals()
      setProposals(result)
    } catch (error) {
      setProposals(initialProposals)
    }
  }

  const filteredProposals = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return proposals
    return proposals.filter(
      (proposal) =>
        proposal.title.toLowerCase().includes(query) ||
        proposal.summary.toLowerCase().includes(query),
    )
  }, [search, proposals])

  const handleSubmitSearch = (event) => {
    event.preventDefault()
  }

  const handleViewProposal = async (proposalId) => {
    try {
      const proposal = await getProposalById(proposalId)
      setSelectedProposal(proposal)
      setCommentText('')
    } catch (error) {
      const fallback = proposals.find((proposal) => proposal.id === proposalId)
      if (fallback) {
        setSelectedProposal(fallback)
      }
    }
  }

  const handleCloseModal = () => {
    setSelectedProposal(null)
    setCommentText('')
  }

  const handleAddComment = async (event) => {
    event.preventDefault()
    if (!commentText.trim() || !selectedProposal) return

    try {
      await createComment(selectedProposal.id, commentText)
      const updatedProposal = await getProposalById(selectedProposal.id)
      setSelectedProposal(updatedProposal)
      setCommentText('')
    } catch (error) {
      console.error(error)
    }
  }

  const handleSupportClick = async () => {
    if (!selectedProposal) return
    try {
      await toggleSupport(selectedProposal.id)
      const updatedProposal = await getProposalById(selectedProposal.id)
      setSelectedProposal(updatedProposal)
      await loadProposals()
    } catch (error) {
      console.error(error)
    }
  }

  const handleOpenCreateModal = () => {
    setShowCreateModal(true)
  }

  const handleCloseCreateModal = () => {
    setShowCreateModal(false)
    setNewProposal({ title: '', summary: '' })
    setAttachments([])
    setAttachmentLabel('')
    setAttachmentUrl('')
    setAttachmentType('link')
  }

  const handleAddAttachment = () => {
    if (!attachmentLabel.trim() || !attachmentUrl.trim()) return
    setAttachments((current) => [
      ...current,
      {
        type: attachmentType,
        label: attachmentLabel.trim(),
        url: attachmentUrl.trim(),
      },
    ])
    setAttachmentLabel('')
    setAttachmentUrl('')
  }

  const handleRemoveAttachment = (index) => {
    setAttachments((current) => current.filter((_, i) => i !== index))
  }

  const handleCreateProposal = async (event) => {
    event.preventDefault()
    if (!newProposal.title.trim() || !newProposal.summary.trim()) return

    try {
      await createProposal(newProposal.title, newProposal.summary, attachments)
      await loadProposals()
      handleCloseCreateModal()
    } catch (error) {
      console.error(error)
    }
  }

  const handleGoToMyProposals = () => {
    navigate('/my-proposals')
  }

  return (
    <div className={`proposal-page ${selectedProposal || showCreateModal ? 'modal-open' : ''}`}>
      <header className="proposal-topbar">
        <div className="proposal-title">PROPUESTA CIUDADANA</div>
        <div className="proposal-actions">
          <button className="nav-btn nav-btn-secondary" type="button" onClick={handleGoToMyProposals}>
            Mis propuestas
          </button>
          <button className="nav-btn nav-btn-primary" type="button" onClick={handleOpenCreateModal}>
            + Crear propuesta
          </button>
          <div className="user-badge">USER</div>
        </div>
      </header>

      <section className="proposal-search-panel">
        <div className="proposal-search-card">
          <h2>Buscar propuestas</h2>
          <form onSubmit={handleSubmitSearch} className="proposal-search-form">
            <input
              type="search"
              placeholder="Busca por palabra clave, barrio o tema"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </form>
        </div>
      </section>

      <section id="proposals" className="proposal-grid">
        {filteredProposals.length > 0 ? (
          filteredProposals.map((proposal) => (
            <article key={proposal.id} className="proposal-card">
              <div className="proposal-card-top">
                <span className="proposal-badge">Propuesta</span>
                <span className="proposal-votes">{proposal.votes} votos</span>
              </div>
              <h3>{proposal.title}</h3>
              <p>{proposal.summary}</p>
              <button className="proposal-view-btn" type="button" onClick={() => handleViewProposal(proposal.id)}>
                Ver
              </button>
            </article>
          ))
        ) : (
          <div className="proposal-empty">No se encontraron propuestas.</div>
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
              </div>

              <div className="proposal-modal-right">
                <div className="proposal-description">
                  <h4>Descripción</h4>
                  <p>{selectedProposal.summary}</p>
                </div>

                <button className="support-btn" type="button" onClick={handleSupportClick}>
                  {selectedProposal.supported ? 'Retirar apoyo' : 'Apoyar propuesta'}
                </button>

                <div className="proposal-comments-panel">
                  <h3>Comentarios</h3>
                  <div className="proposal-comments-list">
                    {selectedProposal.comments?.length > 0 ? (
                      selectedProposal.comments.map((comment, index) => (
                        <div key={index} className="proposal-comment-item">
                          {comment.message}
                        </div>
                      ))
                    ) : (
                      <div className="proposal-comment-item">Aún no hay comentarios.</div>
                    )}
                  </div>
                  <form className="proposal-comment-form" onSubmit={handleAddComment}>
                    <textarea
                      value={commentText}
                      onChange={(event) => setCommentText(event.target.value)}
                      placeholder="Escribe un comentario o feedback"
                      rows={4}
                    />
                    <button type="submit" className="comment-submit-btn">
                      Enviar comentario
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="proposal-modal-overlay" onClick={handleCloseCreateModal}>
          <div className="proposal-modal proposal-modal-create" onClick={(event) => event.stopPropagation()}>
            <header className="proposal-modal-header">
              <h2>Crear nueva propuesta</h2>
              <button className="modal-close-btn" type="button" onClick={handleCloseCreateModal}>
                ×
              </button>
            </header>

            <div className="proposal-create-body">
              <form onSubmit={handleCreateProposal}>
                <div className="form-group">
                  <label htmlFor="title">Título de la propuesta</label>
                  <input
                    id="title"
                    type="text"
                    value={newProposal.title}
                    onChange={(event) =>
                      setNewProposal((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                    placeholder="Ej: Mejora de iluminación en barrio norte"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="summary">Descripción detallada</label>
                  <textarea
                    id="summary"
                    value={newProposal.summary}
                    onChange={(event) =>
                      setNewProposal((current) => ({
                        ...current,
                        summary: event.target.value,
                      }))
                    }
                    placeholder="Describe tu propuesta en detalle..."
                    rows={6}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="attachmentType">Tipo de adjunto</label>
                  <select
                    id="attachmentType"
                    value={attachmentType}
                    onChange={(event) => setAttachmentType(event.target.value)}
                  >
                    <option value="link">Link</option>
                    <option value="file">Archivo</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="attachmentLabel">Nombre del adjunto</label>
                  <input
                    id="attachmentLabel"
                    type="text"
                    value={attachmentLabel}
                    onChange={(event) => setAttachmentLabel(event.target.value)}
                    placeholder="Título del archivo o enlace"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="attachmentUrl">URL o nombre del archivo</label>
                  <input
                    id="attachmentUrl"
                    type="text"
                    value={attachmentUrl}
                    onChange={(event) => setAttachmentUrl(event.target.value)}
                    placeholder="https://... o nombre-del-archivo.pdf"
                  />
                </div>

                <button type="button" className="form-btn-secondary" onClick={handleAddAttachment}>
                  Agregar adjunto
                </button>

                {attachments.length > 0 && (
                  <div className="attachment-list">
                    <h4>Adjuntos</h4>
                    <ul>
                      {attachments.map((attachment, index) => (
                        <li key={index}>
                          {attachment.type === 'link' ? 'Link:' : 'Archivo:'} {attachment.label} - {attachment.url}{' '}
                          <button type="button" className="remove-attachment-btn" onClick={() => handleRemoveAttachment(index)}>
                            Quitar
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="form-actions">
                  <button type="button" className="form-btn-cancel" onClick={handleCloseCreateModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="form-btn-submit">
                    Crear propuesta
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
