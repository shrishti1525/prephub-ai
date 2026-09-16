import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DsaTracker({ token }) {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [starredOnly, setStarredOnly] = useState(false);
  const [copiedHint, setCopiedHint] = useState(false);

  // Form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    topic: 'Arrays',
    difficulty: 'Easy',
    status: 'Solved',
    problemUrl: '',
    notes: '',
    starred: false
  });
  const [submitError, setSubmitError] = useState('');

  // AI Hint Modal state
  const [activeHintProblem, setActiveHintProblem] = useState(null);
  const [hintData, setHintData] = useState(null);
  const [hintLoading, setHintLoading] = useState(false);
  const [hintError, setHintError] = useState('');

  const commonTopics = [
    'Arrays', 'Strings', 'Two Pointers', 'Sliding Window', 'Linked List',
    'Stack & Queue', 'Binary Search', 'Trees & BST', 'Graphs', 'Dynamic Programming',
    'Heaps & Priority Queue', 'Backtracking', 'Trie', 'Greedy', 'Bit Manipulation'
  ];

  async function fetchProblems() {
    try {
      setLoading(true);
      const params = {};
      if (difficultyFilter) params.difficulty = difficultyFilter;
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;

      const response = await axios.get('http://localhost:5000/api/problems', {
        headers: { authorization: token },
        params
      });
      setProblems(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProblems();
  }, [token, difficultyFilter, statusFilter]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    fetchProblems();
  }

  async function handleAddProblem(e) {
    e.preventDefault();
    setSubmitError('');
    try {
      await axios.post('http://localhost:5000/api/problems', formData, {
        headers: { authorization: token }
      });
      setShowAddModal(false);
      setFormData({
        title: '',
        topic: 'Arrays',
        difficulty: 'Easy',
        status: 'Solved',
        problemUrl: '',
        notes: '',
        starred: false
      });
      fetchProblems();
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to add problem.');
    }
  }

  async function handleToggleStatus(problem, newStatus) {
    try {
      await axios.put(
        `http://localhost:5000/api/problems/${problem._id}`,
        { status: newStatus },
        { headers: { authorization: token } }
      );
      setProblems((prev) =>
        prev.map((p) => (p._id === problem._id ? { ...p, status: newStatus } : p))
      );
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  }

  async function handleToggleStar(problem) {
    try {
      const newStarred = !problem.starred;
      await axios.put(
        `http://localhost:5000/api/problems/${problem._id}`,
        { starred: newStarred },
        { headers: { authorization: token } }
      );
      setProblems((prev) =>
        prev.map((p) => (p._id === problem._id ? { ...p, starred: newStarred } : p))
      );
    } catch (err) {
      console.error('Failed to update star:', err);
    }
  }

  async function handleDeleteProblem(id) {
    if (!window.confirm('Are you sure you want to delete this problem?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/problems/${id}`, {
        headers: { authorization: token }
      });
      setProblems((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error('Failed to delete problem:', err);
    }
  }

  async function handleRequestAiHint(problem) {
    setActiveHintProblem(problem);
    setHintData(null);
    setHintError('');
    setHintLoading(true);
    setCopiedHint(false);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/problems/hint',
        {
          title: problem.title,
          topic: problem.topic,
          difficulty: problem.difficulty
        },
        { headers: { authorization: token } }
      );
      setHintData(response.data);
    } catch (err) {
      setHintError(err.response?.data?.message || 'Failed to generate algorithm hint.');
    } finally {
      setHintLoading(false);
    }
  }

  function handleCopyHint() {
    if (!hintData) return;
    const text = `Problem: ${activeHintProblem?.title}\nIntuition: ${hintData.intuition}\nApproach: ${hintData.optimalApproach}\nData Structure: ${hintData.recommendedDataStructure}\nComplexity: Time ${hintData.timeComplexity}, Space ${hintData.spaceComplexity}\nPitfall: ${hintData.commonPitfall || 'N/A'}`;
    navigator.clipboard.writeText(text);
    setCopiedHint(true);
    setTimeout(() => setCopiedHint(false), 2000);
  }

  // Derived problem counts
  const totalCount = problems.length;
  const easyCount = problems.filter((p) => p.difficulty === 'Easy').length;
  const mediumCount = problems.filter((p) => p.difficulty === 'Medium').length;
  const hardCount = problems.filter((p) => p.difficulty === 'Hard').length;
  const solvedCount = problems.filter((p) => p.status === 'Solved').length;
  const revisionCount = problems.filter((p) => p.status === 'Revision').length;
  const starredCount = problems.filter((p) => p.starred).length;

  const displayProblems = starredOnly ? problems.filter((p) => p.starred) : problems;

  return (
    <div className="content-area">
      {/* Header & Primary CTA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-solved">DSA Core Engine</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>NeetCode / Striver Patterns</span>
          </div>
          <h1 style={{ fontSize: '26px', margin: 0, fontWeight: 800 }}>
            DSA Placement <span className="text-gradient">Tracker</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Curate your coding interview problems, flag weak patterns for revision, and get instant Gemini algorithm hints.
          </p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ padding: '10px 22px', fontSize: '14px' }}>
          + Add New Problem
        </button>
      </div>

      {/* Metric Ribbon */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <div className="stat-chip">
          <div style={{ fontSize: '22px' }}>📚</div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total</div>
            <div style={{ fontSize: '17px', fontWeight: 800, color: '#fff' }}>{totalCount}</div>
          </div>
        </div>

        <div className="stat-chip">
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#5EF2D5', boxShadow: '0 0 8px #5EF2D5' }} />
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Easy</div>
            <div style={{ fontSize: '17px', fontWeight: 800, color: '#5EF2D5' }}>{easyCount}</div>
          </div>
        </div>

        <div className="stat-chip">
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F79D65', boxShadow: '0 0 8px #F79D65' }} />
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Medium</div>
            <div style={{ fontSize: '17px', fontWeight: 800, color: '#F79D65' }}>{mediumCount}</div>
          </div>
        </div>

        <div className="stat-chip">
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F35252', boxShadow: '0 0 8px #F35252' }} />
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Hard</div>
            <div style={{ fontSize: '17px', fontWeight: 800, color: '#F35252' }}>{hardCount}</div>
          </div>
        </div>

        <div className="stat-chip">
          <div style={{ fontSize: '20px', color: '#60B5FF' }}>✓</div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Solved</div>
            <div style={{ fontSize: '17px', fontWeight: 800, color: '#60B5FF' }}>{solvedCount}</div>
          </div>
        </div>

        <div className="stat-chip" onClick={() => setStatusFilter(statusFilter === 'Revision' ? '' : 'Revision')} style={{ cursor: 'pointer' }}>
          <div style={{ fontSize: '20px' }}>🔄</div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Revision</div>
            <div style={{ fontSize: '17px', fontWeight: 800, color: '#FFE588' }}>{revisionCount}</div>
          </div>
        </div>

        <div className="stat-chip" onClick={() => setStarredOnly(!starredOnly)} style={{ cursor: 'pointer', borderColor: starredOnly ? '#FFE588' : undefined }}>
          <div style={{ fontSize: '20px', color: '#FFE588' }}>★</div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Starred</div>
            <div style={{ fontSize: '17px', fontWeight: 800, color: '#FFE588' }}>{starredCount}</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="card" style={{ marginBottom: '20px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Top Row: Search & Dropdowns */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '36px' }}
                placeholder="Search by problem name or topic..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '14px' }}>
                🔍
              </span>
            </div>

            <select
              className="form-select"
              style={{ width: '150px' }}
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              <option value="">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            <select
              className="form-select"
              style={{ width: '150px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Solved">Solved</option>
              <option value="In Progress">In Progress</option>
              <option value="Revision">Revision</option>
            </select>

            <button type="submit" className="btn btn-secondary">
              Search
            </button>
            {(search || difficultyFilter || statusFilter || starredOnly) && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setSearch('');
                  setDifficultyFilter('');
                  setStatusFilter('');
                  setStarredOnly(false);
                }}
                style={{ color: 'var(--text-muted)' }}
              >
                Reset
              </button>
            )}
          </form>

          {/* Quick Filter Pills Row */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', paddingTop: '6px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginRight: '4px' }}>Quick Filters:</span>
            <button
              type="button"
              className={`filter-pill ${difficultyFilter === '' && statusFilter === '' && !starredOnly ? 'active' : ''}`}
              onClick={() => {
                setDifficultyFilter('');
                setStatusFilter('');
                setStarredOnly(false);
              }}
            >
              All
            </button>
            <button
              type="button"
              className={`filter-pill ${difficultyFilter === 'Easy' ? 'active' : ''}`}
              onClick={() => setDifficultyFilter(difficultyFilter === 'Easy' ? '' : 'Easy')}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
              Easy
            </button>
            <button
              type="button"
              className={`filter-pill ${difficultyFilter === 'Medium' ? 'active' : ''}`}
              onClick={() => setDifficultyFilter(difficultyFilter === 'Medium' ? '' : 'Medium')}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b' }} />
              Medium
            </button>
            <button
              type="button"
              className={`filter-pill ${difficultyFilter === 'Hard' ? 'active' : ''}`}
              onClick={() => setDifficultyFilter(difficultyFilter === 'Hard' ? '' : 'Hard')}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }} />
              Hard
            </button>
            <button
              type="button"
              className={`filter-pill ${statusFilter === 'Revision' ? 'active' : ''}`}
              onClick={() => setStatusFilter(statusFilter === 'Revision' ? '' : 'Revision')}
            >
              🔄 Revision Queue ({revisionCount})
            </button>
            <button
              type="button"
              className={`filter-pill ${starredOnly ? 'active' : ''}`}
              onClick={() => setStarredOnly(!starredOnly)}
            >
              ★ Starred ({starredCount})
            </button>
          </div>
        </div>
      </div>

      {/* Problems Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '44px', textAlign: 'center' }}>★</th>
              <th>Problem</th>
              <th>Topic</th>
              <th>Difficulty</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                  <div style={{ display: 'inline-block', animation: 'spin 1s linear infinite', fontSize: '20px', marginBottom: '8px' }}>⏳</div>
                  <div style={{ color: 'var(--text-secondary)' }}>Loading your problem list...</div>
                </td>
              </tr>
            ) : displayProblems.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔍</div>
                  <div style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: 600 }}>No problems found</div>
                  <div style={{ fontSize: '13px', marginTop: '4px' }}>
                    {starredOnly ? 'You have no starred problems. Star questions you want to review before campus interviews.' : 'Click "+ Add New Problem" above to start building your placement portfolio.'}
                  </div>
                </td>
              </tr>
            ) : (
              displayProblems.map((problem) => (
                <tr key={problem._id}>
                  <td style={{ textAlign: 'center' }}>
                    <span
                      onClick={() => handleToggleStar(problem)}
                      style={{
                        cursor: 'pointer',
                        fontSize: '18px',
                        color: problem.starred ? '#f59e0b' : '#475569',
                        transition: 'transform 0.2s',
                        display: 'inline-block',
                        textShadow: problem.starred ? '0 0 10px rgba(245, 158, 11, 0.5)' : 'none'
                      }}
                      title={problem.starred ? 'Starred for quick interview review' : 'Star problem'}
                    >
                      ★
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14.5px' }}>
                      {problem.title}
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '4px', flexWrap: 'wrap' }}>
                      {problem.problemUrl && (
                        <a
                          href={problem.problemUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontSize: '12px', color: '#60B5FF', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                        >
                          LeetCode / Practice ↗
                        </a>
                      )}
                      {problem.notes && (
                        <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', background: 'rgba(255, 255, 255, 0.04)', padding: '2px 8px', borderRadius: '4px' }}>
                          📝 {problem.notes.slice(0, 45)}{problem.notes.length > 45 ? '...' : ''}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', background: 'rgba(99, 102, 241, 0.1)', color: '#a5b4fc', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '4px 10px', borderRadius: '6px', fontWeight: 600 }}>
                      {problem.topic}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${problem.difficulty.toLowerCase()}`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td>
                    <select
                      className="form-select"
                      style={{
                        padding: '5px 10px',
                        fontSize: '12px',
                        width: '125px',
                        fontWeight: 600,
                        backgroundColor:
                          problem.status === 'Solved'
                            ? 'rgba(16, 185, 129, 0.12)'
                            : problem.status === 'Revision'
                            ? 'rgba(245, 158, 11, 0.12)'
                            : 'rgba(99, 102, 241, 0.12)',
                        borderColor:
                          problem.status === 'Solved'
                            ? 'rgba(94, 242, 213, 0.4)'
                            : problem.status === 'Revision'
                            ? 'rgba(255, 229, 136, 0.4)'
                            : 'rgba(96, 181, 255, 0.4)',
                        color:
                          problem.status === 'Solved'
                            ? '#5EF2D5'
                            : problem.status === 'Revision'
                            ? '#FFE588'
                            : '#60B5FF'
                      }}
                      value={problem.status}
                      onChange={(e) => handleToggleStatus(problem, e.target.value)}
                    >
                      <option value="Solved">✓ Solved</option>
                      <option value="In Progress">⏳ In Progress</option>
                      <option value="Revision">🔄 Revision</option>
                    </select>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleRequestAiHint(problem)}
                        className="btn btn-secondary btn-sm"
                        style={{
                          color: '#c084fc',
                          borderColor: 'rgba(192, 132, 252, 0.35)',
                          background: 'rgba(192, 132, 252, 0.08)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        title="Get AI algorithm hint & optimal complexity"
                      >
                        <span>✨</span>
                        <span>AI Hint</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProblem(problem._id)}
                        className="btn btn-danger btn-sm"
                        title="Delete Problem"
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Problem Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="badge badge-solved" style={{ marginBottom: '4px' }}>New Problem</span>
                <h3 style={{ margin: 0, marginTop: '2px', fontSize: '18px' }}>Add DSA Problem</h3>
              </div>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                ✕
              </button>
            </div>

            {submitError && <div className="alert alert-error">{submitError}</div>}

            <form onSubmit={handleAddProblem}>
              <div className="form-group">
                <label className="form-label">Problem Title *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Trapping Rain Water, Two Sum, Course Schedule"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Topic</label>
                  <select
                    className="form-select"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  >
                    {commonTopics.map((top) => (
                      <option key={top} value={top}>
                        {top}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Difficulty</label>
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
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Initial Status</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Solved">Solved</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Revision">Revision</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Problem Link (optional)</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://leetcode.com/problems/..."
                    value={formData.problemUrl}
                    onChange={(e) => setFormData({ ...formData, problemUrl: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notes & Algorithm Key Insight</label>
                <textarea
                  className="form-textarea"
                  rows="3"
                  placeholder="Key observations, edge cases, corner checks, or intuition..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '22px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px' }}>
                  Save Problem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Hint Modal */}
      {activeHintProblem && (
        <div className="modal-backdrop" onClick={() => setActiveHintProblem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-solved">PrepHub AI Algorithm Mentor</span>
                  <span className="live-dot" />
                </div>
                <h3 style={{ margin: 0, marginTop: '6px', fontSize: '18px' }}>
                  Intuition & Hint: {activeHintProblem.title}
                </h3>
              </div>
              <button className="modal-close" onClick={() => setActiveHintProblem(null)}>
                ✕
              </button>
            </div>

            {hintLoading && (
              <div style={{ textAlign: 'center', padding: '48px 20px' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>✨</div>
                <div style={{ fontWeight: 600, fontSize: '15px', color: '#fff' }}>
                  Analyzing problem constraints & optimal algorithms...
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Gemini is tailoring optimal time & space complexity hints...
                </div>
              </div>
            )}

            {hintError && <div className="alert alert-error">{hintError}</div>}

            {hintData && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Core Intuition Card */}
                <div style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15))', padding: '16px', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    💡 Core Intuition
                  </div>
                  <div style={{ marginTop: '6px', fontSize: '14px', lineHeight: 1.6, color: '#f8fafc' }}>
                    {hintData.intuition}
                  </div>
                </div>

                {/* Optimal Approach Card */}
                <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    🛠 Step-by-Step Approach
                  </div>
                  <div style={{ marginTop: '8px', fontSize: '13.5px', whiteSpace: 'pre-line', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                    {hintData.optimalApproach}
                  </div>
                </div>

                {/* Complexity & Data Structure */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                  <div style={{ background: 'var(--bg-input)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>RECOMMENDED DATA STRUCTURE</div>
                    <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#38bdf8', marginTop: '3px' }}>
                      {hintData.recommendedDataStructure}
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-input)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>TARGET COMPLEXITY</div>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: '#34d399', marginTop: '3px' }}>
                      Time: {hintData.timeComplexity} | Space: {hintData.spaceComplexity}
                    </div>
                  </div>
                </div>

                {/* Common Pitfall */}
                {hintData.commonPitfall && (
                  <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#f87171' }}>⚠️ Common Pitfall: </span>
                    <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{hintData.commonPitfall}</span>
                  </div>
                )}

                {/* Footer Controls */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                  <button
                    type="button"
                    onClick={handleCopyHint}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <span>📋</span>
                    <span>{copiedHint ? 'Copied to Clipboard!' : 'Copy Hint'}</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => setActiveHintProblem(null)}
                  >
                    Got It, Continue Coding
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DsaTracker;