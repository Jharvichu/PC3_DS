import express from 'express'
import AuthService from '../../services/authService.js'

const router = express.Router()
const authService = new AuthService()

router.post('/login', async (req, res) => {
  try {
    const { dni, signature } = req.body
    if (!dni || !signature) {
      return res.status(400).json({ error: 'DNI y firma digital requeridos' })
    }

    const result = await authService.login(dni, signature)
    res.json(result)
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
})

export default router
