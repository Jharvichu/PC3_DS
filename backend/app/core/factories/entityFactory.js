export default class EntityFactory {
  static createProposal(data) {
    return new ProposalBuilder()
      .setTitle(data.title)
      .setSummary(data.summary)
      .setStatus(data.status || 'En revisión')
      .setAuthorDni(data.author_dni)
      .setAttachments(data.attachments)
      .build()
  }

  static createComment(proposalId, authorDni, message) {
    return {
      proposal_id: proposalId,
      author_dni: String(authorDni || '').trim(),
      message: String(message || '').trim(),
      private: true,
    }
  }
}

export class ProposalBuilder {
  constructor() {
    this.proposal = {
      title: '',
      summary: '',
      status: 'En revisión',
      votes: 0,
      author_dni: '',
      attachments: [],
    }
  }

  setTitle(title) {
    if (title) this.proposal.title = String(title).trim()
    return this
  }

  setSummary(summary) {
    if (summary) this.proposal.summary = String(summary).trim()
    return this
  }

  setStatus(status) {
    if (status) this.proposal.status = String(status).trim()
    return this
  }

  setAuthorDni(authorDni) {
    if (authorDni) this.proposal.author_dni = String(authorDni).trim()
    return this
  }

  setAttachments(attachments) {
    if (Array.isArray(attachments)) {
      this.proposal.attachments = attachments
    }
    return this
  }

  build() {
    return { ...this.proposal }
  }
}
