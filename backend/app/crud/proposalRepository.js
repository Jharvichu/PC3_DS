import Database from '../db/database.js'

export default class ProposalRepository {
  constructor() {
    this.db = Database.getInstance()
  }

  async list() {
    const result = await this.db.query(
      `SELECT p.*, COALESCE(s.count, 0) AS votes
       FROM proposals p
       LEFT JOIN (
         SELECT proposal_id, COUNT(*) AS count
         FROM supports
         GROUP BY proposal_id
       ) s ON p.id = s.proposal_id
       ORDER BY p.created_at DESC`,
    )
    return result.rows
  }

  async listByAuthor(dni) {
    const result = await this.db.query(
      `SELECT p.*, COALESCE(s.count, 0) AS votes
       FROM proposals p
       LEFT JOIN (
         SELECT proposal_id, COUNT(*) AS count
         FROM supports
         GROUP BY proposal_id
       ) s ON p.id = s.proposal_id
       WHERE p.author_dni = $1
       ORDER BY p.created_at DESC`,
      [dni],
    )
    return result.rows
  }

  async findById(id) {
    const result = await this.db.query(
      `SELECT p.*, COALESCE(s.count, 0) AS votes
       FROM proposals p
       LEFT JOIN (
         SELECT proposal_id, COUNT(*) AS count
         FROM supports
         GROUP BY proposal_id
       ) s ON p.id = s.proposal_id
       WHERE p.id = $1`,
      [id],
    )
    return result.rows[0]
  }

  async create(proposal) {
    const result = await this.db.query(
      `INSERT INTO proposals (title, summary, status, votes, author_dni, attachments)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        proposal.title,
        proposal.summary,
        proposal.status,
        proposal.votes,
        proposal.author_dni,
        proposal.attachments,
      ],
    )
    return result.rows[0]
  }

  async addSupport(proposalId, supporterDni) {
    await this.db.query(
      `INSERT INTO supports (proposal_id, supporter_dni)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [proposalId, supporterDni],
    )
  }

  async removeSupport(proposalId, supporterDni) {
    await this.db.query(
      `DELETE FROM supports
       WHERE proposal_id = $1 AND supporter_dni = $2`,
      [proposalId, supporterDni],
    )
  }

  async hasSupport(proposalId, supporterDni) {
    const result = await this.db.query(
      `SELECT 1 FROM supports
       WHERE proposal_id = $1 AND supporter_dni = $2`,
      [proposalId, supporterDni],
    )
    return result.rowCount > 0
  }
}
