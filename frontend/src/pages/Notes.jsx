import { useState, useEffect } from 'react'
import axios from 'axios'

function Notes({ token }) {
  const [formData, setFormData] = useState({ title: '', content: '' })
  const [notes, setNotes] = useState([])
  const [message, setMessage] = useState('')

  async function fetchNotes() {
    try {
      const response = await axios.get('http://localhost:5000/api/notes', {
        headers: { authorization: token }
      })
      setNotes(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [token])

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await axios.post('http://localhost:5000/api/notes', formData, {
        headers: { authorization: token }
      })
      setMessage('Note added!')
      setFormData({ title: '', content: '' })
      fetchNotes()
    } catch (error) {
      setMessage('Failed to add note.')
      console.log(error)
    }
  }

  return (
    <div>
      <h1>Notes</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Note title"
          value={formData.title}
          onChange={handleChange}
        />
        <br />
        <textarea
          name="content"
          placeholder="Write your note here..."
          value={formData.content}
          onChange={handleChange}
        />
        <br />
        <button type="submit">Add Note</button>
      </form>
      {message && <p>{message}</p>}

      <h2>Your Notes</h2>
      <ul>
        {notes.map((note) => (
          <li key={note._id}>
            <strong>{note.title}</strong>: {note.content}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Notes