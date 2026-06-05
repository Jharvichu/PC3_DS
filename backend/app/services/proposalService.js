import RepositoryFactory from '../core/factories/repositoryFactory.js'
import EntityFactory from '../core/factories/entityFactory.js'
import ProposalAdapter from '../core/adapters/proposalAdapter.js'

export default class ProposalService {
  constructor() {
    this.proposalRepository = RepositoryFactory.create('proposal')
    this.commentRepository = RepositoryFactory.create('comment')
  }

  async listAll() {
    const proposals = await this.proposalRepository.list()
    return proposals.map(ProposalAdapter.toDomain)
  }

  async listByAuthor(dni) {
    const proposals = await this.proposalRepository.listByAuthor(dni)
    return proposals.map(ProposalAdapter.toDomain)
  }

  async getById(id, currentDni) {
    const proposalRow = await this.proposalRepository.findById(id)
    const proposal = ProposalAdapter.toDomain(proposalRow)
    if (!proposal) {
      return null
    }
    const comments = await this.commentRepository.listByProposal(id)
    const supported = currentDni ? await this.proposalRepository.hasSupport(id, currentDni) : false
    return {
      ...proposal,
      documents: [
        `${proposal.title} - documento base`,
        'Análisis de impacto social',
        'Archivo de sustentos y cifras',
      ],
      revisions: [
        'Revisión 1: primer feedback ciudadano',
        'Revisión 2: propuesta ajustada',
      ],
      comments,
      supported,
    }
  }

  async createProposal(data) {
    const proposal = EntityFactory.createProposal(data)
    return this.proposalRepository.create(proposal)
  }

  async addComment(proposalId, authorDni, message) {
    const comment = EntityFactory.createComment(proposalId, authorDni, message)
    return this.commentRepository.create(comment)
  }

  async toggleSupport(proposalId, supporterDni) {
    const exists = await this.proposalRepository.hasSupport(proposalId, supporterDni)
    if (exists) {
      await this.proposalRepository.removeSupport(proposalId, supporterDni)
    } else {
      await this.proposalRepository.addSupport(proposalId, supporterDni)
    }
    return this.proposalRepository.findById(proposalId)
  }
}
