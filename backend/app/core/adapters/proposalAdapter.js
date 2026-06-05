export default class ProposalAdapter {
  static toDomain(dbRow) {
    if (!dbRow) return null

    return {
      id: dbRow.id,
      title: dbRow.title,
      summary: dbRow.summary,
      status: dbRow.status,
      votes: Number(dbRow.votes || 0),
      author_dni: dbRow.author_dni,
      attachments: Array.isArray(dbRow.attachments) ? dbRow.attachments : [],
      created_at: dbRow.created_at,
    }
  }
}
