import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import SignIn from '../pages/sigin'
import Home from '../pages/Home'
import Formularios from '../pages/Formularios'
import Montink from '../pages/Montink'
import MainLayout from '../components/MainLayout'
import ProtectedRoute from '../components/ProtectedRoute'
import { useAuth } from '../contexts/AuthContext'

// Carregamento sob demanda para o formulário ZeroHum
const ZeroHumForm = lazy(() => import('../pages/formularios/ZeroHum'))

// Componente de carregamento para ser usado com Suspense
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-app-dark flex items-center justify-center p-4">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-app-card rounded-2xl p-8 shadow-2xl border border-app-border flex flex-col items-center">
          <img src="/cdg_logo.svg" alt="CDG Logo" className="h-24 mb-4 filter drop-shadow-lg" />
          <h1 className="text-4xl font-bold text-app-primary mb-2">CDG SYSTEM</h1>          <div className="mt-8 flex items-center justify-center">
            <div className="animate-spin rounded-md h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
          </div>
          <p className="text-gray-400 mt-4">Carregando sistema...</p>
        </div>
      </div>
    </div>
  )
}

function AppRoutes() {
  const { loading } = useAuth();
  
  // Mostrar tela de carregamento enquanto verifica a autenticação
  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Suspense fallback={<LoadingScreen />}>
            <SignIn />
          </Suspense>
        } />
        
        {/* Rotas protegidas com o layout principal */}
        <Route element={<ProtectedRoute redirectTo="/" />}>
          <Route element={
            <Suspense fallback={<LoadingScreen />}>
              <MainLayout />
            </Suspense>
          }>
            {/* Rotas acessíveis a todos os usuários autenticados */}
            <Route path="/home" element={<Home />} />
            
            {/* Rotas que exigem permissão específica */}            <Route element={<ProtectedRoute requiredPermissions={['formularios']} />}>
              <Route path="/formularios" element={<Formularios />} />
              <Route path="/formularios/zerohum" element={
                <Suspense fallback={<LoadingScreen />}>
                  <ZeroHumForm />
                </Suspense>
              } />
              <Route path="/formularios/:formId" element={
                <div className="p-4 bg-app-card rounded-lg shadow-lg border border-app-border">
                  <h1 className="text-2xl font-bold text-app-primary">Detalhes do Formulário</h1>
                  <p className="text-gray-400">Esta página está em construção.</p>
                </div>
              } />
            </Route>
              <Route element={<ProtectedRoute requiredPermissions={['montik']} />}>
              <Route path="/montik" element={<Montink />} />
            </Route>
            
            <Route element={<ProtectedRoute requiredPermissions={['all']} />}>
              <Route path="/administracao" element={
                <div className="p-4 bg-app-card rounded-lg shadow-lg border border-app-border">
                  <h1 className="text-2xl font-bold text-app-primary">Administração</h1>
                  <p className="text-gray-400">Esta página está em construção.</p>
                </div>
              } />
              <Route path="/novo-usuario" element={
                <div className="p-4 bg-app-card rounded-lg shadow-lg border border-app-border">
                  <h1 className="text-2xl font-bold text-app-primary">Novo Usuário</h1>
                  <p className="text-gray-400">Esta página está em construção.</p>
                </div>
              } />
            </Route>
            
            <Route element={<ProtectedRoute requiredPermissions={['config-montik']} />}>
              <Route path="/config-montik" element={
                <div className="p-4 bg-app-card rounded-lg shadow-lg border border-app-border">
                  <h1 className="text-2xl font-bold text-app-primary">Configurações Montik</h1>
                  <p className="text-gray-400">Esta página está em construção.</p>
                </div>
              } />
            </Route>
            
            <Route element={<ProtectedRoute requiredPermissions={['all']} />}>
              <Route path="/config-form" element={
                <div className="p-4 bg-app-card rounded-lg shadow-lg border border-app-border">
                  <h1 className="text-2xl font-bold text-app-primary">Configurações Form</h1>
                  <p className="text-gray-400">Esta página está em construção.</p>
                </div>
              } />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default AppRoutes
