import React from 'react';
import { Link } from 'react-router-dom';
import Hero3DCanvas from '../components/Hero3DCanvas';
import TiltCard3D from '../components/TiltCard3D';

function Home({ token }) {
  const targetCompanies = [
    'Google', 'Amazon', 'Microsoft', 'TCS Digital', 'Goldman Sachs',
    'Adobe', 'Infosys Power Programmer', 'Accenture', 'Oracle', 'Uber'
  ];

  const features = [
    {
      icon: '📊',
      badge: 'VISUAL ANALYTICS',
      title: 'Centralized Placement Dashboard',
      description: 'Replace fragmented spreadsheets with automated Recharts analytics tracking your DSA difficulty spread, topic mastery, and placement readiness score.'
    },
    {
      icon: '🧭',
      badge: 'AI COACH',
      title: 'Personalized AI Study Planner',
      description: 'Google Gemini analyzes your actual weak areas across DSA and aptitude to engineer a realistic 7-day or 30-day day-by-day sprint roadmap.'
    },
    {
      icon: '⚡',
      badge: 'GEMINI 3.5 HINTS',
      title: 'DSA Tracker with AI Mentoring',
      description: 'Catalog your coding problems with LeetCode links. Request on-demand algorithmic intuition and Big-O complexity hints without spoiling solutions.'
    },
    {
      icon: '🎯',
      badge: 'TIMED PRACTICE',
      title: 'Aptitude Practice & Diagnostic Quizzes',
      description: 'Master Quantitative, Logical, and Verbal reasoning with 5-minute timed test sets, accuracy percentages, and instant step-by-step explanations.'
    },
    {
      icon: '📄',
      badge: 'ATS SCANNER',
      title: 'Resume ATS Optimizer & Parser',
      description: 'Upload your PDF resume to uncover critical missing keywords for target roles and transform bullet points using Google\'s high-impact X-Y-Z formula.'
    },
    {
      icon: '💼',
      badge: 'PEER ARCHIVE',
      title: 'Interview Experience Community',
      description: 'Browse round-by-round debriefs from real campus placement drives with questions asked, OA patterns, candidate advice, and community upvotes.'
    }
  ];

  const highlights = [
    { label: 'DSA Tracking', value: 'Donut & Bar Charts' },
    { label: 'Aptitude Bank', value: 'Timed Diagnostic Mode' },
    { label: 'Resume Engine', value: 'Google Gemini ATS' },
    { label: 'AI Study Coach', value: '7 & 30 Day Sprints' }
  ];

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '40px 24px' }}>
      {/* 3D Hero Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '32px', alignItems: 'center', marginBottom: '60px' }}>
        {/* Left Hero Column */}
        <div style={{ textAlign: 'left' }}>
          {/* Glow pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', background: 'rgba(247, 157, 101, 0.12)', border: '1px solid rgba(247, 157, 101, 0.35)', marginBottom: '18px' }}>
            <span className="live-dot" />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#F79D65', letterSpacing: '0.3px' }}>
              CAMPUS PLACEMENT SEASON 2026
            </span>
          </div>

          <h1 style={{ fontSize: '50px', fontWeight: 800, margin: '8px 0 18px', letterSpacing: '-1.5px', color: '#fff', lineHeight: 1.15 }}>
            Crack Your Dream Tech Offer with <br />
            <span className="text-gradient">3D Intelligent Prep</span>
          </h1>

          <p style={{ fontSize: '16.5px', color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 0 28px', lineHeight: 1.65 }}>
            A unified, developer-first workspace replacing fragmented spreadsheets and PDFs. Track DSA problems, practice timed OA aptitude, scan resumes against corporate ATS, and execute your Gemini AI study sprint.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '36px' }}>
            {token ? (
              <Link to="/dashboard" className="btn btn-primary" style={{ padding: '13px 32px', fontSize: '15px' }}>
                Launch Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/signup" className="btn btn-primary" style={{ padding: '13px 32px', fontSize: '15px' }}>
                  Start Preparing Free →
                </Link>
                <Link to="/login" className="btn btn-secondary" style={{ padding: '13px 26px', fontSize: '15px' }}>
                  Sign In
                </Link>
              </>
            )}
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', fontSize: '12.5px', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#5EF2D5' }}>✓</span> Free for Students
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#5EF2D5' }}>✓</span> Gemini 3.5 AI Core
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#5EF2D5' }}>✓</span> Real Placement Questions
            </span>
          </div>
        </div>

        {/* Right 3D Interactive Canvas Column */}
        <div style={{ position: 'relative', minHeight: '440px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Background Ambient Glow Behind 3D Canvas */}
          <div
            style={{
              position: 'absolute',
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(96, 181, 255, 0.35) 0%, rgba(94, 242, 213, 0.18) 50%, transparent 70%)',
              filter: 'blur(30px)',
              zIndex: 0,
              pointerEvents: 'none'
            }}
          />

          {/* Three.js Interactive 3D Canvas */}
          <Hero3DCanvas />

          {/* Floating 3D Micro Glass Badges */}
          <div
            style={{
              position: 'absolute',
              top: '18%',
              left: '5%',
              background: 'rgba(7, 12, 24, 0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(96, 181, 255, 0.4)',
              borderRadius: '10px',
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
              animation: 'pulseDot 3s infinite ease-in-out'
            }}
          >
            <span style={{ fontSize: '14px' }}>⚡</span>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>DSA ENGINE</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#60B5FF' }}>AI Intuition Mentoring</div>
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: '16%',
              right: '6%',
              background: 'rgba(7, 12, 24, 0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(94, 242, 213, 0.4)',
              borderRadius: '10px',
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
              animation: 'pulseDot 2.6s infinite ease-in-out reverse'
            }}
          >
            <span style={{ fontSize: '14px' }}>📄</span>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>ATS SCANNER</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#5EF2D5' }}>94% SDE Match Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Strip with 3D Tilt */}
      <TiltCard3D
        maxTilt={6}
        className="card"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '56px',
          background: 'rgba(8, 14, 28, 0.75)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--border-color)',
          padding: '22px 32px'
        }}
      >
        {highlights.map((h, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 700 }}>
              {h.label}
            </div>
            <div style={{ fontSize: '17px', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
              {h.value}
            </div>
          </div>
        ))}
      </TiltCard3D>

      {/* Target Companies Strip */}
      <div style={{ textAlign: 'center', marginBottom: '56px' }}>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: '14px' }}>
          PREPARE FOR ROUNDS AT TOP TECH COMPANIES
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {targetCompanies.map((comp, idx) => (
            <span
              key={idx}
              style={{
                padding: '6px 14px',
                background: 'rgba(12, 19, 36, 0.6)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-full)',
                fontSize: '13px',
                color: 'var(--text-secondary)',
                fontWeight: 600
              }}
            >
              {comp}
            </span>
          ))}
        </div>
      </div>

      {/* Feature Cards Grid with 3D Tilt Hover */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '64px' }}>
        {features.map((feat, idx) => (
          <TiltCard3D
            key={idx}
            maxTilt={9}
            className="card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              padding: '28px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '32px' }}>{feat.icon}</span>
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: 800,
                  color: '#60B5FF',
                  background: 'rgba(96, 181, 255, 0.12)',
                  border: '1px solid rgba(96, 181, 255, 0.3)',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  letterSpacing: '0.6px'
                }}
              >
                {feat.badge}
              </span>
            </div>
            <h3 style={{ fontSize: '18px', color: '#fff', margin: 0, fontWeight: 700 }}>
              {feat.title}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', lineHeight: 1.6 }}>
              {feat.description}
            </p>
          </TiltCard3D>
        ))}
      </div>

      {/* CTA Bottom Banner */}
      <div
        className="card"
        style={{
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(96, 181, 255, 0.16) 0%, rgba(94, 242, 213, 0.12) 50%, rgba(3, 7, 18, 0.95) 100%)',
          border: '1px solid rgba(96, 181, 255, 0.35)',
          padding: '48px 32px',
          boxShadow: '0 0 35px -5px rgba(96, 181, 255, 0.2)'
        }}
      >
        <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', margin: '0 0 12px' }}>
          Ready to Elevate Your Placement Prep?
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '600px', margin: '0 auto 28px', lineHeight: 1.6 }}>
          Join students using PrepHub AI to track coding milestones, practice timed aptitude, and craft ATS-winning resumes.
        </p>
        <Link to={token ? "/dashboard" : "/signup"} className="btn btn-primary" style={{ padding: '14px 36px', fontSize: '16px' }}>
          {token ? "Go to Your Dashboard →" : "Get Started Free Now →"}
        </Link>
      </div>
    </div>
  );
}

export default Home;