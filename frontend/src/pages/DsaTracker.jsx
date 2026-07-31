import { useState, useEffect } from 'react'
import axios from 'axios'

function DsaTracker({ token }) {
  const [formData, setFormData] = useState({ title: '', topic: '', difficulty: 'Easy' })
  const [problems, setProblems] = useState([])
  const [message, setMessage] = useState('')

  async function fetchProblems() {
    try {
      const response = await axios.get('http://localhost:5000/api/problems', {
        headers: { authorization: token }
      })
      setProblems(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchProblems()
  }, [token])

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await axios.post('http://localhost:5000/api/problems', formData, {
        headers: { authorization: token }
      })
      setMessage('Problem added!')
      setFormData({ title: '', topic: '', difficulty: 'Easy' })
      fetchProblems()
    } catch (error) {
      setMessage('Failed to add problem.')
      console.log(error)
    }
  }

  return (
    <div>
      <h1>DSA Tracker</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Problem title"
          value={formData.title}
          onChange={handleChange}
        />
        <br />
        <input
          type="text"
          name="topic"
          placeholder="Topic (e.g. Arrays)"
          value={formData.topic}
          onChange={handleChange}
        />
        <br />
        <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <br />
        <button type="submit">Add Problem</button>
      </form>
      {message && <p>{message}</p>}

      <h2>Your Problems</h2>
      <ul>
        {problems.map((problem) => (
          <li key={problem._id}>
            {problem.title} — {problem.topic} — {problem.difficulty}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default DsaTracker