import { useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const navigate = useNavigate()

  function handleLogout() {
    setToken('')
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        {' | '}
        <Link to="/signup">Signup</Link>
        {' | '}
        <Link to="/login">Login</Link>
        {token && (
          <>
            {' | '}
            <Link to="/dashboard">Dashboard</Link>
            {' | '}
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/dashboard" element={<Dashboard token={token} setToken={setToken} />} />
      </Routes>
    </div>
  )
}

export default App