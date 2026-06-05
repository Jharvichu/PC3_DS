import express from 'express'
import ProposalService from '../../services/proposalService.js'
import AuthService from '../../services/authService.js'

const router = express.Router()
const proposalService = new ProposalService()

function extractDni(req) {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.replace('Bearer ', '').trim()
  return AuthService.resolveDniFromToken(token)
}

router.get('/', async (req, res) => {
  try {
    const proposals = await proposalService.listAll()
    res.json(proposals)
  } catch (error) {
    res.status(500).json({ error: 'No se pudieron cargar las propuestas' })
  }
})

router.get('/mine', async (req, res) => {
  try {
    const dni = extractDni(req)
    if (!dni) return res.status(401).json({ error: 'Token inválido' })

    const proposals = await proposalService.listByAuthor(dni)
    res.json(proposals)
  } catch (error) {
    res.status(500).json({ error: 'No se pudo obtener tus propuestas' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const proposalId = Number(req.params.id)
    const dni = extractDni(req)
    const proposal = await proposalService.getById(proposalId, dni)
    if (!proposal) return res.status(404).json({ error: 'Propuesta no encontrada' })
    res.json(proposal)
  } catch (error) {
    res.status(500).json({ error: 'No se pudo cargar la propuesta' })
  }
})

router.post('/', async (req, res) => {
  try {
    const dni = extractDni(req)
    if (!dni) return res.status(401).json({ error: 'Token inválido' })

    const { title, summary, attachments } = req.body
    if (!title || !summary) {
      return res.status(400).json({ error: 'Título y descripción son obligatorios' })
    }

    const proposal = await proposalService.createProposal({
      title,
      summary,
      author_dni: dni,
      attachments: Array.isArray(attachments) ? attachments : [],
    })
    res.status(201).json(proposal)
  } catch (error) {
    res.status(500).json({ error: 'No se pudo crear la propuesta' })
  }
})

router.post('/:id/comments', async (req, res) => {
  try {
    const dni = extractDni(req)
    if (!dni) return res.status(401).json({ error: 'Token inválido' })

    const proposalId = Number(req.params.id)
    const { message } = req.body
    if (!message) return res.status(400).json({ error: 'El comentario no puede estar vacío' })

    const comment = await proposalService.addComment(proposalId, dni, message)
    res.status(201).json(comment)
  } catch (error) {
    res.status(500).json({ error: 'No se pudo guardar el comentario' })
  }
})

router.post('/:id/support', async (req, res) => {
  try {
    const dni = extractDni(req)
    if (!dni) return res.status(401).json({ error: 'Token inválido' })

    const proposalId = Number(req.params.id)
    const proposal = await proposalService.toggleSupport(proposalId, dni)
    res.json(proposal)
  } catch (error) {
    res.status(500).json({ error: 'No se pudo actualizar el respaldo' })
  }
})

export default router
