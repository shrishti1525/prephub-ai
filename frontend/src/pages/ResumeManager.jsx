import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TiltCard3D from '../components/TiltCard3D';
import { API_BASE_URL } from '../config/api.js';

function ResumeManager({ token }) {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('Placement Resume');
  const [targetRole, setTargetRole] = useState('Software Development Engineer');
  const [resumeText, setResumeText] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeAnalysis, setActiveAnalysis] = useState(null);

  const [inputMode, setInputMode] = useState('upload'); // 'upload' | 'text'
  const [copiedKeywords, setCopiedKeywords] = useState(false);

  const roleOptions = [
    'Software Development Engineer',
    'Frontend Developer (React)',
    'Backend Developer (Node.js/MERN)',
    'Full Stack Developer (MERN)',
    'Data Analyst / Machine Learning',
    'DevOps & Cloud Engineer'
  ];

  async function fetchResumes() {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}resumes`, {
        headers: { authorization: token }
      });
      setResumes(res.data);
      if (res.data.length > 0 && !activeAnalysis) {
        setActiveAnalysis(res.data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchResumes();
  }, [token]);

  async function handleAnalyze(e) {
    e.preventDefault();
    setErrorMsg('');
    setAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('targetRole', targetRole);

      if (inputMode === 'upload') {
        if (!resumeFile) {
          setErrorMsg('Please select a PDF or TXT resume file to upload.');
          setAnalyzing(false);
          return;
        }
        formData.append('resumeFile', resumeFile);
      } else {
        if (!resumeText.trim()) {
          setErrorMsg('Please paste your resume text into the box.');
          setAnalyzing(false);
          return;
        }
        formData.append('resumeText', resumeText);
      }

      const res = await axios.post(`${API_BASE_URL}resumes/analyze`, formData, {
        headers: {
          authorization: token,
          'Content-Type': 'multipart/form-data'
        }
      });

      setActiveAnalysis(res.data);
      fetchResumes();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to analyze resume.');
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleDeleteResume(id) {
    if (!window.confirm('Delete this resume analysis?')) return;
    try {
      await axios.delete(`${API_BASE_URL}resumes/${id}`, {
        headers: { authorization: token }
      });
      setResumes((prev) => prev.filter((r) => r._id !== id));
      if (activeAnalysis?._id === id) {
        setActiveAnalysis(null);
      }
    } catch (err) {
      console.error(err);
    }
  }

  function handleCopyKeywords() {
    if (!activeAnalysis?.missingKeywords?.length) return;
    navigator.clipboard.writeText(activeAnalysis.missingKeywords.join(', '));
    setCopiedKeywords(true);
    setTimeout(() => setCopiedKeywords(false), 2000);
  }

  return (
    <div className="content-area">
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span className="badge badge-solved">ATS Compliance Engine</span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Powered by Google Gemini 3.5</span>
        </div>
        <h1 style={{ fontSize: '26px', margin: 0, fontWeight: 800 }}>
          Resume Manager & <span className="text-gradient">AI ATS Scanner</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
          Simulate corporate applicant tracking algorithms (Workday, Taleo, Greenhouse) and optimize keywords before campus placement drives.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 440px) 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Left Column: Upload & Analyze Form */}
        <div>
          <div className="card" style={{ marginBottom: '20px', padding: '24px' }}>
            <h3 style={{ fontSize: '17px', marginBottom: '16px', color: 'var(--text-primary)', fontWeight: 700 }}>
              Scan New Resume
            </h3>

            {errorMsg && <div className="alert alert-error">{errorMsg}</div>}

            <form onSubmit={handleAnalyze}>
              <div className="form-group">
                <label className="form-label">Resume Version Label</label>
                <input
                  type="text"
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. SDE-1 Master Resume (v2)"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Placement Role</label>
                <select
                  className="form-select"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mode Toggle Pills */}
              <div className="form-group">
                <label className="form-label">Input Format</label>
                <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-input)', padding: '4px', borderRadius: '8px' }}>
                  <button
                    type="button"
                    className={`btn btn-sm ${inputMode === 'upload' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1 }}
                    onClick={() => setInputMode('upload')}
                  >
                    📄 Upload PDF / TXT
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${inputMode === 'text' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1 }}
                    onClick={() => setInputMode('text')}
                  >
                    📝 Paste Text
                  </button>
                </div>
              </div>

              {inputMode === 'upload' ? (
                <div className="form-group">
                  <label className="form-label">Resume File (.pdf, .txt)</label>
                  <div
                    style={{
                      border: '2px dashed var(--border-color)',
                      borderRadius: '12px',
                      padding: '24px 16px',
                      textAlign: 'center',
                      background: 'var(--bg-input)',
                      transition: 'border-color 0.2s',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                  >
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>📤</div>
                    {resumeFile ? (
                      <div>
                        <div style={{ fontWeight: 700, color: '#34d399', fontSize: '14px' }}>
                          ✓ {resumeFile.name}
                        </div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {(resumeFile.size / 1024).toFixed(1)} KB • Ready for scan
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setResumeFile(null);
                          }}
                          style={{
                            marginTop: '8px',
                            background: 'none',
                            border: 'none',
                            color: '#f87171',
                            fontSize: '12px',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                          }}
                        >
                          Remove file
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: '13.5px', color: 'var(--text-primary)', fontWeight: 600 }}>
                          Click to select or drag resume PDF
                        </div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          PDF, TXT up to 5MB
                        </div>
                      </div>
                    )}
                    <input
                      type="file"
                      accept=".pdf,.txt"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: 0,
                        cursor: 'pointer',
                        width: '100%',
                        height: '100%'
                      }}
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setResumeFile(e.target.files[0]);
                        }
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label">Resume Content</label>
                  <textarea
                    className="form-textarea"
                    rows="6"
                    placeholder="Paste education, skills, projects, and work experience sections here..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                  />
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', marginTop: '14px', fontWeight: 700 }}
                disabled={analyzing}
              >
                {analyzing ? '✨ Analyzing with Gemini ATS...' : '✨ Run AI ATS Scan'}
              </button>
            </form>
          </div>

          {/* Saved Audits List */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '14.5px', margin: 0, color: 'var(--text-secondary)', fontWeight: 700 }}>
                Audit History ({resumes.length})
              </h3>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Click to inspect</span>
            </div>

            {loading ? (
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '12px' }}>
                Loading scans...
              </div>
            ) : resumes.length === 0 ? (
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '16px' }}>
                No saved scans yet. Scan your first resume above.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {resumes.map((r) => {
                  const isSelected = activeAnalysis?._id === r._id;
                  return (
                    <div
                      key={r._id}
                      onClick={() => setActiveAnalysis(r)}
                      style={{
                        padding: '12px 14px',
                        background: isSelected ? 'rgba(96, 181, 255, 0.15)' : 'var(--bg-input)',
                        borderRadius: '8px',
                        border: isSelected ? '1.5px solid #60B5FF' : '1px solid var(--border-color)',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.2s',
                        boxShadow: isSelected ? '0 0 14px rgba(96, 181, 255, 0.25)' : 'none'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '13.5px', color: isSelected ? '#fff' : 'var(--text-primary)' }}>
                          {r.title}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {r.targetRole} • {new Date(r.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span
                          className="badge"
                          style={{
                            backgroundColor: r.atsScore >= 75 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            color: r.atsScore >= 75 ? '#34d399' : '#fbbf24',
                            fontWeight: 700
                          }}
                        >
                          {r.atsScore}/100
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteResume(r._id);
                          }}
                          style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '15px' }}
                          title="Delete Scan"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active ATS Audit Report */}
        <div>
          {activeAnalysis ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Score Header Card with 3D Parallax Tilt */}
              <TiltCard3D
                className="card"
                maxTilt={6}
                style={{
                  background: 'linear-gradient(135deg, rgba(20, 32, 54, 0.95), rgba(13, 20, 36, 0.95))',
                  border: '1px solid rgba(96, 181, 255, 0.35)',
                  padding: '28px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span className="badge badge-solved" style={{ background: 'rgba(96, 181, 255, 0.15)', color: '#60B5FF' }}>
                        Target Role: {activeAnalysis.targetRole}
                      </span>
                      <span
                        className="badge"
                        style={{
                          backgroundColor:
                            activeAnalysis.atsScore >= 75
                              ? 'rgba(94, 242, 213, 0.15)'
                              : 'rgba(247, 157, 101, 0.15)',
                          color: activeAnalysis.atsScore >= 75 ? '#5EF2D5' : '#F79D65'
                        }}
                      >
                        {activeAnalysis.atsScore >= 75 ? 'Tier 1 • High ATS Pass' : 'Tier 2 • Needs Optimization'}
                      </span>
                    </div>
                    <h2 style={{ fontSize: '24px', margin: '4px 0', color: 'var(--text-primary)', fontWeight: 800 }}>
                      {activeAnalysis.title}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
                      Audited by PrepHub AI ATS Engine on{' '}
                      {new Date(activeAnalysis.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Circular Score Gauge */}
                  <div
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      background:
                        'radial-gradient(circle, var(--bg-card) 58%, transparent 59%), conic-gradient(' +
                        (activeAnalysis.atsScore >= 75 ? '#5EF2D5 ' : activeAnalysis.atsScore >= 50 ? '#F79D65 ' : '#F35252 ') +
                        activeAnalysis.atsScore * 3.6 +
                        'deg, var(--border-color) 0deg)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: activeAnalysis.atsScore >= 75 ? '0 0 25px rgba(94, 242, 213, 0.35)' : '0 0 25px rgba(247, 157, 101, 0.35)',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {activeAnalysis.atsScore}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                      ATS SCORE
                    </div>
                  </div>
                </div>

                {/* Sub Scores Bar with Visual Progress Tracks */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>
                      <span>SKILLS MATCH</span>
                      <span style={{ color: '#60B5FF' }}>{activeAnalysis.categoryScores?.skillsMatch || 75}%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'var(--bg-input)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${activeAnalysis.categoryScores?.skillsMatch || 75}%`,
                          height: '100%',
                          background: '#60B5FF',
                          borderRadius: '999px'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>
                      <span>QUANTIFIABLE IMPACT</span>
                      <span style={{ color: '#F79D65' }}>{activeAnalysis.categoryScores?.impact || 60}%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'var(--bg-input)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${activeAnalysis.categoryScores?.impact || 60}%`,
                          height: '100%',
                          background: '#F79D65',
                          borderRadius: '999px'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>
                      <span>READABILITY & FORMAT</span>
                      <span style={{ color: '#5EF2D5' }}>{activeAnalysis.categoryScores?.readability || 85}%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'var(--bg-input)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${activeAnalysis.categoryScores?.readability || 85}%`,
                          height: '100%',
                          background: '#5EF2D5',
                          borderRadius: '999px'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </TiltCard3D>

              {/* Strengths Card */}
              <div className="card">
                <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>✅ Resume Strengths</span>
                  <span style={{ fontSize: '12px', color: '#5EF2D5', fontWeight: 700 }}>Verified Ready</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {activeAnalysis.strengths?.map((str, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'flex-start',
                        fontSize: '13.5px',
                        color: 'var(--text-primary)',
                        lineHeight: 1.5
                      }}
                    >
                      <span style={{ color: '#5EF2D5', fontWeight: 800 }}>✓</span>
                      <span>{str}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing Keywords Card */}
              <div className="card">
                <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>⚠️ Missing Placement Keywords for {activeAnalysis.targetRole}</span>
                  <button
                    type="button"
                    onClick={handleCopyKeywords}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '11.5px', padding: '4px 10px' }}
                  >
                    {copiedKeywords ? '✓ Copied All' : '📋 Copy All'}
                  </button>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.5 }}>
                  Corporate applicant tracking engines (Workday, Greenhouse) search for these industry keywords:
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {activeAnalysis.missingKeywords?.map((kw, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '5px 12px',
                        background: 'rgba(255, 229, 136, 0.1)',
                        border: '1px solid rgba(255, 229, 136, 0.35)',
                        color: '#FFE588',
                        borderRadius: '6px',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <span>+</span> {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Bullet Point Suggestions */}
              <div className="card">
                <div className="card-title">
                  <span>💡 Actionable Bullet Point Improvements (STAR Method)</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {activeAnalysis.suggestions?.map((sug, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '14px 16px',
                        background: 'var(--bg-input)',
                        borderRadius: '8px',
                        fontSize: '13.5px',
                        color: 'var(--text-secondary)',
                        borderLeft: '4px solid #60B5FF',
                        lineHeight: 1.6
                      }}
                    >
                      {sug}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '40px', marginBottom: '14px' }}>📄</div>
              <h3 style={{ color: 'var(--text-primary)', fontSize: '18px' }}>No Resume Selected</h3>
              <p style={{ marginTop: '6px', fontSize: '14px', maxWidth: '420px', margin: '6px auto 0', lineHeight: 1.6 }}>
                Upload your resume PDF on the left to view comprehensive ATS scoring, keyword match breakdown, and bullet rewrites.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResumeManager;
