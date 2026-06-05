import RepositoryFactory from '../core/factories/repositoryFactory.js'

export default class AuthService {
  constructor() {
    this.userRepository = RepositoryFactory.create('user')
  }

  async login(dni, signature) {
    const user = await this.userRepository.findByDni(dni)
    if (!user || user.signature !== signature) {
      throw new Error('DNI o firma digital inválidos')
    }

    return {
      token: `token-${user.dni}`,
      user: {
        dni: user.dni,
        name: user.name,
        role: user.role,
      },
    }
  }

  static resolveDniFromToken(token) {
    if (!token || !token.startsWith('token-')) {
      return null
    }
    return token.replace('token-', '')
  }
}
