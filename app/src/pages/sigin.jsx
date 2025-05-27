import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

function SignIn() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login, authenticated } = useAuth()
    // Redirecionar para home ou formulário específico se já estiver autenticado
  const { getDirectFormPath } = useAuth()
  
  useEffect(() => {
    if (authenticated) {
      const directPath = getDirectFormPath()
      if (directPath) {
        navigate(directPath)
      } else {
        navigate('/home')
      }
    }
  }, [authenticated, navigate, getDirectFormPath])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const result = await login(formData.username, formData.password)
        if (result.success) {
        // O redirecionamento acontecerá automaticamente pelo useEffect
        // que monitora o estado de autenticação e direciona para o formulário específico
      } else {
        setError(result.message || 'Usuário ou senha inválidos')
      }
    } catch (err) {
      console.error('Erro ao fazer login:', err)
      setError('Ocorreu um erro ao tentar fazer login')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-app-dark flex items-center justify-center p-4">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-app-card rounded-2xl p-8 shadow-2xl border border-app-border">
          <div className="flex flex-col items-center mb-6">
            <div className="h-24 mb-4 flex items-center justify-center">
              <img 
                src="/cdg_logo.svg" 
                alt="CDG Logo" 
                className="h-full filter drop-shadow-lg"
              />
            </div>
            <h1 className="text-4xl font-bold text-app-primary mb-2">
              CDG SYSTEM
            </h1>
            <p className="text-gray-400 mb-6">
              Entre com suas credenciais para acessar o sistema
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                Usuário
              </label>                <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                placeholder="Digite seu nome de usuário"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Senha
              </label>              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                placeholder="Digite sua senha"
                required
              /></div>
            
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-100 text-sm">
                {error}
              </div>
            )}            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 bg-[var(--color-primary)] text-white font-medium rounded-lg 
                ${!loading && 'hover:bg-[var(--color-primary-hover)]'} 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] 
                transition-colors ${loading && 'opacity-70 cursor-not-allowed'}`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                  Entrando...
                </div>
              ) : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignIn