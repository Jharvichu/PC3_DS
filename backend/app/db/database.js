import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

export default class Database {
  static instance

  constructor() {
    this.pool = new Pool({
      user: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      host: process.env.POSTGRES_HOST || 'db',
      database: process.env.POSTGRES_DB || 'voz_ciudadana',
      port: Number(process.env.POSTGRES_PORT || 5432),
    })
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }

  query(text, params) {
    return this.pool.query(text, params)
  }
}
