import { useState, useEffect } from 'react'
import axios from 'axios'

function Dashboard({ token }) {
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
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

  return (
    <div>
      <h1>Dashboard</h1>
      <p>{message}</p>
    </div>
  )
}

export default Dashboard