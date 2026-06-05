import UserRepository from '../../crud/userRepository.js'
import ProposalRepository from '../../crud/proposalRepository.js'
import CommentRepository from '../../crud/commentRepository.js'

export default class RepositoryFactory {
  static create(type) {
    switch (type) {
      case 'user':
        return new UserRepository()
      case 'proposal':
        return new ProposalRepository()
      case 'comment':
        return new CommentRepository()
      default:
        throw new Error(`Repository ${type} no encontrado`)
    }
  }
}
