import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { login } from '../services/authService'

function SignIn() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      // Usando o service de autenticação
      const user = await login(formData.username, formData.password)
      
      // Salvando informações do usuário (já que o token é gerenciado no authService)
      localStorage.setItem('currentUser', JSON.stringify({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role // Agora o backend retornaria a role correta
      }))
      
      // Redirecionar para a página home
      navigate('/home')
    } catch (err) {
      setError('Credenciais inválidas. Por favor tente novamente.')
      console.error('Erro durante o login:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-800">
          <div className="flex flex-col items-center mb-6">
            <img 
              src="/cdg_logo.svg" 
              alt="CDG Logo" 
              className="h-24 mb-4"
            />
            <h1 className="text-4xl font-bold text-white mb-2">
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
              </label>              
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#008fad] focus:border-transparent"
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
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#008fad] focus:border-transparent"
                placeholder="Digite sua senha"
                required
              />
            </div>
            
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-100 text-sm">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#008fad] text-white font-medium rounded-lg hover:bg-[#007a94] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#008fad] transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignIn
