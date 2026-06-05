import Database from '../db/database.js'

export default class UserRepository {
  constructor() {
    this.db = Database.getInstance()
  }

  async findByDni(dni) {
    const result = await this.db.query('SELECT * FROM users WHERE dni = $1', [dni])
    return result.rows[0]
  }
}
