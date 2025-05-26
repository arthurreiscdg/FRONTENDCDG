import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignIn from '../pages/sigin'

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes
