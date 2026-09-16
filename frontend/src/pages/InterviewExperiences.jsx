import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_CLIENT_URI || '').replace(/\/+$/, '') + '/';

function InterviewExperiences({ token, currentUser }) {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [verdictFilter, setVerdictFilter] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    role: 'Software Development Engineer',
    batchYear: '2026',
    difficulty: 'Medium',
    verdict: 'Selected',
    tips: '',
    rounds: [
      { roundName: 'Round 1: Online Assessment (OA)', questionsAsked: '', experience: '' },
      { roundName: 'Round 2: Technical Interview (DSA/Core CS)', questionsAsked: '', experience: '' }
    ]
  });
  const [submitError, setSubmitError] = useState('');

  async function fetchExperiences() {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (verdictFilter) params.verdict = verdictFilter;

      const res = await axios.get(`${API_BASE_URL}experiences`, {
        headers: { authorization: token },
        params
      });
      setExperiences(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchExperiences();
  }, [token, verdictFilter]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    fetchExperiences();
  }

  function handleAddRound() {
    setFormData((prev) => ({
      ...prev,
      rounds: [
        ...prev.rounds,
        {
          roundName: `Round ${prev.rounds.length + 1}: Technical / Managerial`,
          questionsAsked: '',
          experience: ''
        }
      ]
    }));
  }

  function handleRoundChange(index, field, value) {
    setFormData((prev) => {
      const updated = [...prev.rounds];
      updated[index][field] = value;
      return { ...prev, rounds: updated };
    });
  }

  async function handleCreateExperience(e) {
    e.preventDefault();
    setSubmitError('');
    try {
      await axios.post(`${API_BASE_URL}experiences`, formData, {
        headers: { authorization: token }
      });
      setShowModal(false);
      setFormData({
        company: '',
        role: 'Software Development Engineer',
        batchYear: '2026',
        difficulty: 'Medium',
        verdict: 'Selected',
        tips: '',
        rounds: [
          { roundName: 'Round 1: Online Assessment (OA)', questionsAsked: '', experience: '' },
          { roundName: 'Round 2: Technical Interview (DSA/Core CS)', questionsAsked: '', experience: '' }
        ]
      });
      fetchExperiences();
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to share experience.');
    }
  }

  async function handleToggleUpvote(expId) {
    try {
      const res = await axios.put(
        `${API_BASE_URL}experiences/${expId}/upvote`,
        {},
        { headers: { authorization: token } }
      );
      setExperiences((prev) =>
        prev.map((exp) => {
          if (exp._id === expId) {
            const userIdStr = currentUser?._id;
            let newUpvotes = [...(exp.upvotes || [])];
            if (res.data.upvoted) {
              if (!newUpvotes.includes(userIdStr)) newUpvotes.push(userIdStr);
            } else {
              newUpvotes = newUpvotes.filter((id) => id !== userIdStr);
            }
            return { ...exp, upvotes: newUpvotes };
          }
          return exp;
        })
      );
    } catch (err) {
      console.error(err);
    }
  }

  const topCompanies = ['Google', 'Amazon', 'Microsoft', 'TCS', 'Infosys', 'Cognizant', 'Flipkart'];

  function getCompanyGradient(name = '') {
    const char = name.toUpperCase().charAt(0);
    if (['G', 'B', 'P'].includes(char)) return 'linear-gradient(135deg, #60B5FF, #3ea0ff)';
    if (['A', 'O', 'Y'].includes(char)) return 'linear-gradient(135deg, #F79D65, #FFE588)';
    if (['M', 'S', 'W'].includes(char)) return 'linear-gradient(135deg, #5EF2D5, #60B5FF)';
    if (['T', 'I', 'C'].includes(char)) return 'linear-gradient(135deg, #F35252, #F79D65)';
    return 'linear-gradient(135deg, #60B5FF, #5EF2D5)';
  }

  return (
    <div className="content-area">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-solved">Community Knowledgebase</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Verified Campus Debriefs</span>
          </div>
          <h1 style={{ fontSize: '26px', margin: 0, fontWeight: 800 }}>
            Interview Experiences <span className="text-gradient">Archive</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Real-world round breakdowns, technical questions asked, and candidate tips from campus placement drives.
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ padding: '10px 22px' }}>
          + Share Your Experience
        </button>
      </div>

      {/* Search & Company Filter Bar */}
      <div className="card" style={{ marginBottom: '24px', padding: '18px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '36px' }}
                placeholder="Search by company (e.g. Google, Amazon, TCS) or topics..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '14px' }}>
                🔍
              </span>
            </div>

            <select
              className="form-select"
              style={{ width: '160px' }}
              value={verdictFilter}
              onChange={(e) => setVerdictFilter(e.target.value)}
            >
              <option value="">All Verdicts</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
              <option value="Pending">Pending</option>
            </select>

            <button type="submit" className="btn btn-secondary">
              Search
            </button>
            {(search || verdictFilter) && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setSearch('');
                  setVerdictFilter('');
                }}
                style={{ color: 'var(--text-muted)' }}
              >
                Reset
              </button>
            )}
          </form>

          {/* Quick Company Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', paddingTop: '6px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginRight: '4px' }}>Popular Drives:</span>
            <button
              type="button"
              className={`filter-pill ${search === '' ? 'active' : ''}`}
              onClick={() => {
                setSearch('');
                fetchExperiences();
              }}
            >
              All Companies
            </button>
            {topCompanies.map((comp) => (
              <button
                key={comp}
                type="button"
                className={`filter-pill ${search.toLowerCase() === comp.toLowerCase() ? 'active' : ''}`}
                onClick={() => {
                  setSearch(comp);
                }}
              >
                {comp}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Experiences Feed */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>⏳</div>
          <div>Loading verified interview debriefs...</div>
        </div>
      ) : experiences.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>🏢</div>
          <h3 style={{ color: 'var(--text-primary)', fontSize: '18px' }}>No interview experiences match your filter</h3>
          <p style={{ marginTop: '6px', fontSize: '14px' }}>
            Be the pioneer! Share questions and insights from your recent placement drive to empower your peers.
          </p>
          <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ marginTop: '18px' }}>
            + Share First Experience
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {experiences.map((exp) => {
            const isUpvoted = currentUser?._id && exp.upvotes?.includes(currentUser._id);
            const avatarBg = getCompanyGradient(exp.company);
            return (
              <div
                key={exp._id}
                className="card"
                style={{
                  border: '1px solid var(--border-color)',
                  padding: '24px 26px',
                  transition: 'transform 0.2s, border-color 0.2s'
                }}
              >
                {/* Header Row with Avatar, Role, Verdict, and Upvote Button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    {/* Company Initial Avatar */}
                    <div className="avatar-initial" style={{ background: avatarBg }}>
                      {exp.company.charAt(0)}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <h2 style={{ fontSize: '20px', color: 'var(--text-primary)', margin: 0, fontWeight: 800 }}>
                          {exp.company}
                        </h2>
                        <span className="badge badge-solved" style={{ fontSize: '12px' }}>
                          {exp.role}
                        </span>
                        <span className={`badge ${exp.verdict === 'Selected' ? 'badge-easy' : 'badge-hard'}`}>
                          {exp.verdict === 'Selected' ? '✓ Selected' : exp.verdict}
                        </span>
                        <span className={`badge badge-${exp.difficulty.toLowerCase()}`}>
                          {exp.difficulty}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Shared by <strong style={{ color: 'var(--text-secondary)' }}>{exp.authorName}</strong> • Batch of {exp.batchYear} •{' '}
                        {new Date(exp.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <button
                    className={`btn btn-sm ${isUpvoted ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => handleToggleUpvote(exp._id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '7px 14px',
                      borderRadius: '999px'
                    }}
                    title="Helpful experience debrief"
                  >
                    <span style={{ fontSize: '13px' }}>▲</span>
                    <span style={{ fontWeight: 600 }}>Helpful ({exp.upvotes?.length || 0})</span>
                  </button>
                </div>

                {/* Round Breakdown in Timeline Steps */}
                {exp.rounds && exp.rounds.length > 0 && (
                  <div style={{ marginTop: '16px', marginBottom: '18px', paddingLeft: '6px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, marginBottom: '12px' }}>
                      INTERVIEW ROUNDS TIMELINE
                    </div>
                    <div>
                      {exp.rounds.map((round, rIdx) => (
                        <div key={rIdx} className="round-timeline-step">
                          <div className="round-timeline-dot">{rIdx + 1}</div>
                          <div
                            style={{
                              background: 'var(--bg-input)',
                              padding: '14px 18px',
                              borderRadius: '10px',
                              border: '1px solid var(--border-color)'
                            }}
                          >
                            <div style={{ fontWeight: 700, fontSize: '14.5px', color: '#60B5FF', marginBottom: '6px' }}>
                              {round.roundName}
                            </div>
                            {round.questionsAsked && (
                              <div style={{ fontSize: '13.5px', color: 'var(--text-primary)', marginBottom: '6px', lineHeight: 1.5 }}>
                                <strong style={{ color: '#5EF2D5' }}>Questions & Problems: </strong>
                                {round.questionsAsked}
                              </div>
                            )}
                            {round.experience && (
                              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                <strong>Candidate Experience & Tips: </strong>
                                {round.experience}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Candidate Tips Callout */}
                {exp.tips && (
                  <div
                    style={{
                      background: 'rgba(16, 185, 129, 0.08)',
                      padding: '14px 18px',
                      borderRadius: '10px',
                      fontSize: '13.5px',
                      color: 'var(--text-secondary)',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                      lineHeight: 1.6
                    }}
                  >
                    <strong style={{ color: '#34d399' }}>💡 Key Placement Advice: </strong>
                    {exp.tips}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Share Experience Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px' }}>
            <div className="modal-header">
              <div>
                <span className="badge badge-solved" style={{ marginBottom: '4px' }}>Placement Debrief</span>
                <h3 style={{ margin: 0, marginTop: '2px', fontSize: '18px' }}>Share Campus Interview Experience</h3>
              </div>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            {submitError && <div className="alert alert-error">{submitError}</div>}

            <form onSubmit={handleCreateExperience}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Company Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Google, Amazon, TCS, Microsoft"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Role *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. SDE-1, Intern, Analyst"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Batch Year</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.batchYear}
                    onChange={(e) => setFormData({ ...formData, batchYear: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Overall Difficulty</label>
                  <select
                    className="form-select"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Verdict</label>
                  <select
                    className="form-select"
                    value={formData.verdict}
                    onChange={(e) => setFormData({ ...formData, verdict: e.target.value })}
                  >
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              {/* Rounds */}
              <div style={{ marginTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    Rounds Breakdown
                  </label>
                  <button type="button" onClick={handleAddRound} className="btn btn-secondary btn-sm">
                    + Add Another Round
                  </button>
                </div>

                {formData.rounds.map((round, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--bg-input)',
                      padding: '12px',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <input
                      type="text"
                      className="form-input"
                      style={{ marginBottom: '8px', fontWeight: 600 }}
                      value={round.roundName}
                      onChange={(e) => handleRoundChange(idx, 'roundName', e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-input"
                      style={{ marginBottom: '8px' }}
                      placeholder="Questions or coding problems asked..."
                      value={round.questionsAsked}
                      onChange={(e) => handleRoundChange(idx, 'questionsAsked', e.target.value)}
                    />
                    <textarea
                      className="form-textarea"
                      rows="2"
                      placeholder="Experience details, interviewer feedback, or tips for this round..."
                      value={round.experience}
                      onChange={(e) => handleRoundChange(idx, 'experience', e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <div className="form-group" style={{ marginTop: '12px' }}>
                <label className="form-label">General Advice & Preparation Tips</label>
                <textarea
                  className="form-textarea"
                  rows="3"
                  placeholder="Resources used, advice on what to prioritize..."
                  value={formData.tips}
                  onChange={(e) => setFormData({ ...formData, tips: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default InterviewExperiences;
