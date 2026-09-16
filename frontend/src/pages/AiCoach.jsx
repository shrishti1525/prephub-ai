import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AiCoach({ token }) {
  const [activePlan, setActivePlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [targetRole, setTargetRole] = useState('Software Development Engineer');
  const [durationDays, setDurationDays] = useState(7);
  const [hoursPerDay, setHoursPerDay] = useState(3);

  const roleOptions = [
    'Software Development Engineer',
    'Full Stack Developer (MERN)',
    'Frontend Developer (React)',
    'Backend Developer (Node.js/Express)',
    'Data Analyst / Machine Learning'
  ];

  async function fetchActivePlan() {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/coach/active', {
        headers: { authorization: token }
      });
      setActivePlan(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchActivePlan();
  }, [token]);

  async function handleGeneratePlan(e) {
    if (e) e.preventDefault();
    setGenerating(true);
    setErrorMsg('');

    try {
      const res = await axios.post(
        'http://localhost:5000/api/coach/generate',
        {
          targetRole,
          durationDays,
          hoursPerDay
        },
        { headers: { authorization: token } }
      );
      setActivePlan(res.data);
      setShowModal(false);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to generate study plan.');
    } finally {
      setGenerating(false);
    }
  }

  async function handleToggleTask(dayNumber) {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/coach/tasks/${dayNumber}`,
        {},
        { headers: { authorization: token } }
      );
      setActivePlan(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  const completedCount = activePlan?.dailySchedule?.filter((d) => d.completed).length || 0;
  const totalDays = activePlan?.dailySchedule?.length || 0;
  const progressPercent = activePlan?.completionPercentage || 0;

  return (
    <div className="content-area">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-solved">AI Placement Coach</span>
            <span className="live-dot" />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Gemini Diagnostics Active</span>
          </div>
          <h1 style={{ fontSize: '26px', margin: 0, fontWeight: 800 }}>
            Personalized Study Plan & <span className="text-gradient">AI Coach</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            AI analyzes your real-time preparation gaps and generates a day-by-day roadmap tailored to your timeline.
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ padding: '10px 22px' }}>
          ✨ {activePlan ? 'Customize / Regenerate Plan' : 'Generate My AI Study Plan'}
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          Loading your personalized coach diagnostics...
        </div>
      ) : !activePlan ? (
        /* Empty State */
        <div className="card" style={{ textAlign: 'center', padding: '60px 24px', maxWidth: '640px', margin: '40px auto' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🧭</div>
          <h2 style={{ fontSize: '22px', color: '#fff' }}>No Active Study Sprint Yet</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '12px 0 24px', lineHeight: 1.6 }}>
            Let our AI Coach analyze your tracked DSA problems, aptitude accuracy, and resume ATS score to build a targeted daily study roadmap.
          </p>
          <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '15px' }}>
            ✨ Create My Personalized Plan
          </button>
        </div>
      ) : (
        /* Active Plan View */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Top Diagnostics & Progress Card */}
          <div
            className="card"
            style={{
              background: 'linear-gradient(135deg, rgba(20, 32, 54, 0.95), rgba(13, 20, 36, 0.95))',
              border: '1px solid rgba(96, 181, 255, 0.35)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '20px', color: '#fff', margin: 0 }}>
                    {activePlan.durationDays}-Day Sprint for {activePlan.targetRole}
                  </h2>
                  <span className="badge badge-easy">
                    {activePlan.hoursPerDay} Hours / Day
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '6px' }}>
                  Created by PrepHub AI Coach • {new Date(activePlan.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Progress Box */}
              <div style={{ minWidth: '220px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  <span>Sprint Completion</span>
                  <span style={{ color: '#60B5FF' }}>{progressPercent}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--bg-input)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${progressPercent}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #60B5FF, #5EF2D5)',
                      transition: 'width 0.4s ease'
                    }}
                  />
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', textAlign: 'right' }}>
                  {completedCount} of {totalDays} days finished
                </div>
              </div>
            </div>

            {/* AI Diagnostics Breakdown Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
              {/* DSA Gaps */}
              <div style={{ background: 'var(--bg-input)', padding: '14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: '#F35252', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  ⚡ DSA Priority Gaps
                </div>
                <ul style={{ margin: '6px 0 0 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {activePlan.diagnostics?.dsaGaps?.map((gap, idx) => (
                    <li key={idx}>{gap}</li>
                  ))}
                </ul>
              </div>

              {/* Aptitude Gaps */}
              <div style={{ background: 'var(--bg-input)', padding: '14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: '#F79D65', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  🎯 Aptitude Weaknesses
                </div>
                <ul style={{ margin: '6px 0 0 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {activePlan.diagnostics?.aptitudeGaps?.map((gap, idx) => (
                    <li key={idx}>{gap}</li>
                  ))}
                </ul>
              </div>

              {/* Resume Insights */}
              <div style={{ background: 'var(--bg-input)', padding: '14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: '#60B5FF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  📄 ATS Strategy & Verdict
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.4 }}>
                  {activePlan.diagnostics?.resumeStatus}
                </p>
                {activePlan.diagnostics?.keyAdvice && (
                  <p style={{ fontSize: '12px', color: '#5EF2D5', marginTop: '6px', fontWeight: 600 }}>
                    💡 {activePlan.diagnostics.keyAdvice}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Daily Milestone Schedule List */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', color: '#fff', margin: 0 }}>Day-by-Day Study Schedule</h3>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Check off each day as you complete tasks to track your momentum
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {activePlan.dailySchedule?.map((day) => (
                <div
                  key={day.dayNumber}
                  className="card"
                  style={{
                    padding: '18px 20px',
                    borderLeft: day.completed ? '4px solid #5EF2D5' : '4px solid #60B5FF',
                    background: day.completed ? 'rgba(94, 242, 213, 0.05)' : 'var(--bg-card)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: day.completed ? 'rgba(94, 242, 213, 0.2)' : 'rgba(96, 181, 255, 0.2)',
                          color: day.completed ? '#5EF2D5' : '#60B5FF',
                          fontSize: '12px'
                        }}
                      >
                        Day {day.dayNumber}
                      </span>
                      <h4 style={{ fontSize: '16px', margin: 0, color: day.completed ? 'var(--text-secondary)' : '#fff', textDecoration: day.completed ? 'line-through' : 'none' }}>
                        {day.title}
                      </h4>
                    </div>

                    <button
                      onClick={() => handleToggleTask(day.dayNumber)}
                      className={`btn btn-sm ${day.completed ? 'btn-secondary' : 'btn-primary'}`}
                      style={{
                        backgroundColor: day.completed ? 'transparent' : undefined,
                        borderColor: day.completed ? '#5EF2D5' : undefined,
                        color: day.completed ? '#5EF2D5' : undefined
                      }}
                    >
                      {day.completed ? '✓ Completed' : 'Mark Complete'}
                    </button>
                  </div>

                  {/* Task Columns */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                    {/* DSA Task */}
                    <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '11px', color: '#60B5FF', fontWeight: 700, marginBottom: '4px' }}>
                        ⚡ DSA CODING TARGET
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                        {day.dsaTask}
                      </div>
                    </div>

                    {/* Aptitude Task */}
                    <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '11px', color: '#5EF2D5', fontWeight: 700, marginBottom: '4px' }}>
                        🎯 APTITUDE PRACTICE
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                        {day.aptitudeTask}
                      </div>
                    </div>

                    {/* Core CS / HR Task */}
                    <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '11px', color: '#F79D65', fontWeight: 700, marginBottom: '4px' }}>
                        📘 CS CONCEPTS & INTERVIEW PREP
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                        {day.coreCsTask}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Customize / Generate Sprint Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <h3 style={{ margin: 0 }}>Configure AI Placement Sprint</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            {errorMsg && <div className="alert alert-error">{errorMsg}</div>}

            <form onSubmit={handleGeneratePlan}>
              <div className="form-group">
                <label className="form-label">Target Role *</label>
                <select
                  className="form-select"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                >
                  {roleOptions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Sprint Timeline</label>
                  <select
                    className="form-select"
                    value={durationDays}
                    onChange={(e) => setDurationDays(parseInt(e.target.value, 10))}
                  >
                    <option value={7}>7-Day Fast Sprint</option>
                    <option value={30}>30-Day Master Sprint</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Daily Study Hours</label>
                  <select
                    className="form-select"
                    value={hoursPerDay}
                    onChange={(e) => setHoursPerDay(parseInt(e.target.value, 10))}
                  >
                    <option value={2}>2 Hours / Day</option>
                    <option value={3}>3 Hours / Day</option>
                    <option value={4}>4 Hours / Day</option>
                    <option value={5}>5+ Hours / Day</option>
                  </select>
                </div>
              </div>

              <div style={{ background: 'rgba(99, 102, 241, 0.08)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)', margin: '14px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <strong>🤖 How the AI Coach works:</strong>
                <p style={{ marginTop: '4px', lineHeight: 1.4 }}>
                  Google Gemini will cross-reference your currently tracked DSA problems, your aptitude test scores, and your resume ATS score to identify real gaps and customize daily milestones.
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={generating}>
                  {generating ? '✨ Analyzing & Generating Roadmap...' : 'Generate Roadmap'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AiCoach;
