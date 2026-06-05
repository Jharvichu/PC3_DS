import AuthForm from '../components/AuthForm'
import { login } from '../services/auth'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()

  const handleAuth = async ({ dni, signature }) => {
    const token = await login(dni, signature)
    localStorage.setItem('token', token)
    navigate('/home', { replace: true })
  }

  return <AuthForm onSubmit={handleAuth} />
}
