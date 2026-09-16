import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReadinessOrb3D from '../components/ReadinessOrb3D';
import TiltCard3D from '../components/TiltCard3D';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

function Dashboard({ token }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/dashboard', {
          headers: { authorization: token }
        });
        setData(response.data);
      } catch (err) {
        setError('Failed to load dashboard metrics. Please check server connection.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, [token]);

  if (loading) {
    return (
      <div className="content-area" style={{ textAlign: 'center', paddingTop: '100px' }}>
        <div style={{ fontSize: '36px', marginBottom: '16px' }}>📊</div>
        <h2 style={{ fontSize: '22px', color: '#fff' }}>Aggregating Placement Diagnostics...</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
          Crunching DSA difficulty distributions, aptitude accuracy, and resume scores...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="content-area">
        <div className="alert alert-error">{error || 'Could not load data.'}</div>
      </div>
    );
  }

  const {
    readinessIndex = 0,
    problems = {},
    aptitude = {},
    resume = {},
    community = {},
    noteCount = 0
  } = data;

  const difficultyColors = {
    Easy: '#5EF2D5',
    Medium: '#F79D65',
    Hard: '#F35252'
  };

  const difficultyChartData = (problems.difficultyCounts || []).filter((d) => d.count > 0);
  const hasProblems = (problems.total || 0) > 0;
  const pieData = hasProblems
    ? difficultyChartData
    : [{ name: 'No Problems Yet', count: 1, color: '#334155' }];

  const topicChartData = (problems.topicDistribution || []).slice(0, 6);

  const aptitudeChartData = aptitude.categoryPerformance || [
    { category: 'Quantitative', accuracy: 0 },
    { category: 'Logical', accuracy: 0 },
    { category: 'Verbal', accuracy: 0 }
  ];

  // Dynamic Tier mapped to User Palette
  const tierInfo =
    readinessIndex >= 75
      ? { label: '🏆 Level 3: Interview Ready', color: '#5EF2D5', advice: 'Top percentile candidate! Continue timed mocks and system design.' }
      : readinessIndex >= 40
      ? { label: '⚡ Level 2: Assessment Candidate', color: '#60B5FF', advice: 'Solid core momentum! Focus on tree/graph traversals and quantitative aptitude.' }
      : { label: '🌱 Level 1: Foundations Sprint', color: '#FFE588', advice: 'Getting started! Add your solved problems and scan your resume to boost your readiness.' };

  return (
    <div className="content-area">
      {/* Top Banner: Elevated Placement Readiness Score with 3D Orb */}
      <div
        className="card"
        style={{
          marginBottom: '30px',
          background: 'linear-gradient(135deg, rgba(96, 181, 255, 0.15) 0%, rgba(8, 14, 26, 0.85) 50%, rgba(3, 7, 18, 0.95) 100%)',
          border: '1px solid rgba(96, 181, 255, 0.35)',
          boxShadow: '0 8px 30px rgba(96, 181, 255, 0.12)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
          <div style={{ flex: '1 1 360px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="badge badge-solved" style={{ background: 'rgba(96, 181, 255, 0.18)', color: '#60B5FF' }}>
                Campus Placement Index
              </span>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: tierInfo.color,
                  padding: '3px 10px',
                  borderRadius: '999px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${tierInfo.color}40`
                }}
              >
                {tierInfo.label}
              </span>
            </div>

            <h1 style={{ fontSize: '30px', fontWeight: 800, margin: '8px 0', color: '#fff', letterSpacing: '-0.5px' }}>
              Readiness Score: <span className="text-gradient">{readinessIndex}%</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '650px', lineHeight: 1.5 }}>
              {tierInfo.advice}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            {/* Interactive 3D Readiness Orb */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ReadinessOrb3D score={readinessIndex} tier={tierInfo.label} />
              <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.6px', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '-8px' }}>
                3D Tech Core
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '220px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Overall Progress</span>
                <span style={{ color: '#fff' }}>{readinessIndex} / 100</span>
              </div>
              <div style={{ width: '100%', height: '10px', background: 'rgba(5, 9, 18, 0.85)', borderRadius: '999px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                <div
                  style={{
                    width: `${readinessIndex}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #60B5FF, #5EF2D5, #FFE588)',
                    boxShadow: '0 0 12px rgba(94, 242, 213, 0.5)',
                    transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                />
              </div>
              <Link to="/coach" className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
                🧭 Open AI Study Roadmap →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid with 3D Physics Tilt */}
      <div className="kpi-grid">
        <TiltCard3D className="kpi-card" maxTilt={8}>
          <div className="kpi-header">
            <span>DSA Problems Tracked</span>
            <span style={{ fontSize: '16px' }}>⚡</span>
          </div>
          <div className="kpi-value">{problems.total || 0}</div>
          <div className="kpi-subtext" style={{ display: 'flex', gap: '8px', fontWeight: 600 }}>
            <span style={{ color: '#5EF2D5' }}>Easy: {problems.difficultyCounts?.[0]?.count || 0}</span>
            <span style={{ color: '#F79D65' }}>Med: {problems.difficultyCounts?.[1]?.count || 0}</span>
            <span style={{ color: '#F35252' }}>Hard: {problems.difficultyCounts?.[2]?.count || 0}</span>
          </div>
        </TiltCard3D>

        <TiltCard3D className="kpi-card" maxTilt={8}>
          <div className="kpi-header">
            <span>Aptitude Accuracy</span>
            <span style={{ fontSize: '16px' }}>🎯</span>
          </div>
          <div className="kpi-value">{aptitude.avgPercentage || 0}%</div>
          <div className="kpi-subtext">
            {aptitude.totalAttempts || 0} tests taken • {aptitude.avgPercentage >= 70 ? 'Eligible for OA' : 'Needs practice'}
          </div>
        </TiltCard3D>

        <TiltCard3D className="kpi-card" maxTilt={8}>
          <div className="kpi-header">
            <span>Latest ATS Score</span>
            <span style={{ fontSize: '16px' }}>📄</span>
          </div>
          <div className="kpi-value" style={{ color: resume.latestAtsScore >= 70 ? '#34d399' : '#fff' }}>
            {resume.latestAtsScore ? `${resume.latestAtsScore}/100` : 'Not Scanned'}
          </div>
          <div className="kpi-subtext truncate">
            {resume.latestTargetRole || 'Upload resume to audit'}
          </div>
        </TiltCard3D>

        <TiltCard3D className="kpi-card" maxTilt={8}>
          <div className="kpi-header">
            <span>Interview Archives</span>
            <span style={{ fontSize: '16px' }}>💼</span>
          </div>
          <div className="kpi-value">{community.totalCommunityExperiences || 0}</div>
          <div className="kpi-subtext">
            {community.myExperiencesCount || 0} shared by you • Real OA debriefs
          </div>
        </TiltCard3D>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Chart 1: DSA Difficulty Breakdown (Donut) */}
        <div className="card">
          <div className="card-title">
            <span>DSA Difficulty Distribution</span>
            <Link to="/dsa-tracker" className="btn btn-secondary btn-sm">
              Manage Problems →
            </Link>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={68}
                  outerRadius={96}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color || difficultyColors[entry.name] || '#60B5FF'}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    borderColor: 'rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    color: '#f8fafc',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '22px', marginTop: '12px', fontSize: '13px', fontWeight: 600 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 8px #10b981' }} />
              Easy ({problems.difficultyCounts?.[0]?.count || 0})
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#f59e0b', boxShadow: '0 0 8px #f59e0b' }} />
              Medium ({problems.difficultyCounts?.[1]?.count || 0})
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ef4444', boxShadow: '0 0 8px #ef4444' }} />
              Hard ({problems.difficultyCounts?.[2]?.count || 0})
            </span>
          </div>
        </div>

        {/* Chart 2: Topic Mastery */}
        <div className="card">
          <div className="card-title">
            <span>DSA Topic Mastery</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Top Solved Topics</span>
          </div>
          <div style={{ width: '100%', height: 280 }}>
            {topicChartData.length > 0 ? (
              <ResponsiveContainer>
                <BarChart data={topicChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                  <XAxis dataKey="topic" stroke="#94a3b8" fontSize={12} angle={-15} textAnchor="end" />
                  <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111827',
                      borderColor: 'rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      color: '#f8fafc',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                    }}
                  />
                  <Bar dataKey="count" fill="#60B5FF" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                <span style={{ fontSize: '28px', marginBottom: '8px' }}>⚡</span>
                <span>Track problems in DSA Tracker to see your topic distribution!</span>
              </div>
            )}
          </div>
        </div>

        {/* Chart 3: Aptitude Category Performance */}
        <div className="card">
          <div className="card-title">
            <span>Aptitude Category Breakdown</span>
            <Link to="/aptitude" className="btn btn-secondary btn-sm">
              Practice Quizzes →
            </Link>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={aptitudeChartData} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
                <Tooltip
                  formatter={(val) => [`${val}%`, 'Accuracy']}
                  contentStyle={{
                    backgroundColor: '#111827',
                    borderColor: 'rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    color: '#f8fafc',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                  }}
                />
                <Bar dataKey="accuracy" fill="#60B5FF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Placement Pro-Tip & Shortcuts */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-title">Placement Prep Actions</div>
            
            {/* Daily Pro-Tip Pill */}
            <div style={{ background: 'rgba(255, 229, 136, 0.08)', border: '1px solid rgba(255, 229, 136, 0.3)', borderRadius: 'var(--radius-md)', padding: '14px', marginBottom: '18px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#FFE588', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '4px' }}>
                💡 PRO-TIP OF THE DAY
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                In technical interviews, explain your brute-force $O(N^2)$ solution first within 3 minutes before jumping into two-pointer or hash map optimizations. Interviewers reward structured thought processes.
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/coach" className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>
                🧭 AI Study Coach & Daily Sprint Roadmap
              </Link>
              <Link to="/dsa-tracker" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                ⚡ Track a New Solved Problem + AI Hint
              </Link>
              <Link to="/aptitude" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                🎯 Start a 5-Minute Timed Aptitude Quiz
              </Link>
              <Link to="/resume" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                📄 Run AI ATS Scan on Your Resume
              </Link>
              <Link to="/experiences" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                💼 Read & Share Real Interview Experiences
              </Link>
            </div>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '20px', textAlign: 'center' }}>
            PrepHub AI • Campus Placement Edition 2026
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;