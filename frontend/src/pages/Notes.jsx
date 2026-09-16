import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_CLIENT_URI || '').replace(/\/+$/, '') + '/';

function Notes({ token }) {
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  async function fetchNotes() {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}notes`, {
        headers: { authorization: token }
      });
      setNotes(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNotes();
  }, [token]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}notes`, formData, {
        headers: { authorization: token }
      });
      setMessage('Note added successfully!');
      setFormData({ title: '', content: '' });
      fetchNotes();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to add note.');
      console.error(error);
    }
  }

  async function handleDeleteNote(id) {
    try {
      await axios.delete(`${API_BASE_URL}notes/${id}`, {
        headers: { authorization: token }
      });
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  }

  return (
    <div className="content-area">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', margin: 0 }}>Placement Notes & Cheat Sheets</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
          Capture fast formulas, behavioral answers, and last-minute interview pointers.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 400px) 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Create Note Card */}
        <div className="card">
          <h3 style={{ fontSize: '16px', marginBottom: '16px', color: 'var(--text-primary)' }}>Add New Note</h3>
          {message && (
            <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                type="text"
                required
                className="form-input"
                name="title"
                placeholder="e.g. DBMS Normalization, Floyd Cycle Detection"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Note Content</label>
              <textarea
                className="form-textarea"
                rows="6"
                name="content"
                placeholder="Write your bullet points, code snippets, or notes..."
                value={formData.content}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px' }}>
              Save Note
            </button>
          </form>
        </div>

        {/* Notes Grid */}
        <div>
          <h3 style={{ fontSize: '16px', marginBottom: '16px', color: 'var(--text-secondary)' }}>
            Your Saved Notes ({notes.length})
          </h3>
          {loading ? (
            <div style={{ color: 'var(--text-muted)' }}>Loading notes...</div>
          ) : notes.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              No notes written yet. Use the form on the left to save quick revision points!
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {notes.map((note) => (
                <div key={note._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h4 style={{ fontSize: '15px', color: 'var(--text-primary)', margin: 0 }}>{note.title}</h4>
                      <button
                        onClick={() => handleDeleteNote(note._id)}
                        style={{ background: 'none', border: 'none', color: '#F35252', cursor: 'pointer', fontSize: '13px' }}
                      >
                        ✕
                      </button>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                      {note.content}
                    </p>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '14px', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
                    {new Date(note.dateAdded || Date.now()).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notes;