import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense } from 'react'
import SignIn from '../pages/sigin'
import Home from '../pages/Home'
import MainLayout from '../components/MainLayout'

// Componente de carregamento para ser usado com Suspense
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-800 flex flex-col items-center">
          <img src="/cdg_logo.svg" alt="CDG Logo" className="h-24 mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">CDG SYSTEM</h1>
          <div className="mt-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#008fad]"></div>
          </div>
          <p className="text-gray-400 mt-4">Carregando sistema...</p>
        </div>
      </div>
    </div>
  )
}

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Suspense fallback={<LoadingScreen />}>
            <SignIn />
          </Suspense>
        } />
          {/* Rotas protegidas com o layout principal */}
        <Route element={
          <Suspense fallback={<LoadingScreen />}>
            <MainLayout />
          </Suspense>
        }>
          <Route path="/home" element={<Home />} />
          <Route path="/formularios" element={<div className="p-4 bg-white rounded-lg shadow-lg"><h1 className="text-2xl font-bold">Formulários</h1><p>Esta página está em construção.</p></div>} />
          <Route path="/montik" element={<div className="p-4 bg-white rounded-lg shadow-lg"><h1 className="text-2xl font-bold">Montik</h1><p>Esta página está em construção.</p></div>} />
          <Route path="/administracao" element={<div className="p-4 bg-white rounded-lg shadow-lg"><h1 className="text-2xl font-bold">Administração</h1><p>Esta página está em construção.</p></div>} />
          <Route path="/novo-usuario" element={<div className="p-4 bg-white rounded-lg shadow-lg"><h1 className="text-2xl font-bold">Novo Usuário</h1><p>Esta página está em construção.</p></div>} />
          <Route path="/config-montik" element={<div className="p-4 bg-white rounded-lg shadow-lg"><h1 className="text-2xl font-bold">Configurações Montik</h1><p>Esta página está em construção.</p></div>} />
          <Route path="/config-form" element={<div className="p-4 bg-white rounded-lg shadow-lg"><h1 className="text-2xl font-bold">Configurações Form</h1><p>Esta página está em construção.</p></div>} />
        </Route>
      </Routes>
    </Router>
  )
}

export default AppRoutes
