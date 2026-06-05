import express from 'express'
import cors from 'cors'
import authRoutes from './api/routes/auth.js'
import proposalRoutes from './api/routes/proposals.js'
import Database from './db/database.js'

const app = express()
app.use(cors({ origin: true }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/proposals', proposalRoutes)

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

const port = process.env.PORT || 8000

async function initServer() {
  try {
    const db = Database.getInstance()
    await db.query(
      "ALTER TABLE proposals ADD COLUMN IF NOT EXISTS attachments JSONB NOT NULL DEFAULT '[]'::jsonb",
    )
  } catch (error) {
    console.error('Inicialización DB fallida:', error)
  }

  app.listen(port, () => {
    console.log(`Backend listening on port ${port}`)
  })
}

initServer()
