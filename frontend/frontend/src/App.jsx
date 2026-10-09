import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Feedback from './pages/Feedback'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('adminToken')
  if (!token) return <Navigate to="/login" />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/Male/feedbackform" element={<Feedback />} />
        <Route path="*" element={<Navigate to="/Male/feedbackform" />} />
      </Routes>
    </BrowserRouter>
  )
}
