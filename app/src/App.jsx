import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Logo Section */}
        <div className="flex justify-center items-center space-x-8 mb-8">
          <a 
            href="https://vite.dev" 
            target="_blank" 
            className="group transition-transform hover:scale-110 duration-300"
          >
            <img 
              src={viteLogo} 
              className="w-20 h-20 hover:drop-shadow-2xl transition-all duration-300 group-hover:animate-pulse" 
              alt="Vite logo" 
            />
          </a>
          <a 
            href="https://react.dev" 
            target="_blank"
            className="group transition-transform hover:scale-110 duration-300"
          >
            <img 
              src={reactLogo} 
              className="w-20 h-20 hover:drop-shadow-2xl transition-all duration-300 group-hover:animate-spin" 
              alt="React logo" 
            />
          </a>
        </div>

        {/* Title */}
        <h1 className="text-6xl font-bold text-white mb-8 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
          Vite + React
        </h1>

        {/* Card Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 mb-8">
          <button 
            onClick={() => setCount((count) => count + 1)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl mb-6 active:scale-95"
          >
            Contador: {count}
          </button>
          <p className="text-gray-300 text-lg">
            Edite <code className="bg-gray-800 text-cyan-400 px-2 py-1 rounded font-mono">src/App.jsx</code> e salve para testar o HMR
          </p>
        </div>

        {/* Footer */}
        <p className="text-gray-400 text-lg hover:text-white transition-colors duration-300">
          Clique nos logos do Vite e React para saber mais
        </p>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl animate-bounce"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-pink-500/20 rounded-full blur-xl animate-bounce delay-75"></div>
        <div className="absolute top-1/2 left-5 w-12 h-12 bg-cyan-500/20 rounded-full blur-xl animate-bounce delay-150"></div>
      </div>
    </div>
  )
}

export default App
