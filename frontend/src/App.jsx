import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '')

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/dashboard" element={<Dashboard token={token} />} />
      </Routes>
    </div>
  )
}

export default App