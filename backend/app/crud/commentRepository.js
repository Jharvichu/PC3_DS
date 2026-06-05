import Database from '../db/database.js'

export default class CommentRepository {
  constructor() {
    this.db = Database.getInstance()
  }

  async listByProposal(proposalId) {
    const result = await this.db.query(
      `SELECT * FROM comments WHERE proposal_id = $1 ORDER BY created_at DESC`,
      [proposalId],
    )
    return result.rows
  }

  async create(comment) {
    const result = await this.db.query(
      `INSERT INTO comments (proposal_id, author_dni, message, private)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [comment.proposal_id, comment.author_dni, comment.message, comment.private],
    )
    return result.rows[0]
  }
}
