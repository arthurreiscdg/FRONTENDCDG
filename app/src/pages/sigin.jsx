import { Link } from 'react-router-dom'
import { useState } from 'react'

function SignIn() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Login attempt:', formData)
    // Aqui você implementaria a lógica de autenticação
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
              <button
              type="submit"
              className="w-full py-3 px-4 bg-[#008fad] text-white font-medium rounded-lg hover:bg-[#007a94] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#008fad] transition-colors"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignIn