import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Dashboard({ token, setToken }) {
  const [message, setMessage] = useState('Loading...')
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    async function fetchDashboard() {
      try {
        const response = await axios.get('http://localhost:5000/api/dashboard', {
          headers: { authorization: token }
        })
        setMessage(response.data.message)
      } catch (error) {
        setMessage('Access denied. Please log in.')
        console.log(error)
      }
    }
    fetchDashboard()
  }, [token])

  function handleLogout() {
    setToken('')
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>{message}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Dashboard