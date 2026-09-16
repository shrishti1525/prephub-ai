import React from 'react';
import { Link } from 'react-router-dom';
import TiltCard3D from '../components/TiltCard3D';

function About({ token }) {
  const pillars = [
    {
      icon: '🧭',
      title: 'Precision Diagnostics & AI Coaching',
      description:
        'Instead of generic advice, our Gemini-powered engine analyzes your exact problem-solving velocity, aptitude accuracy, and resume weaknesses to formulate daily study roadmaps.'
    },
    {
      icon: '⚡',
      title: 'Algorithmic Mentorship Without Spoilers',
      description:
        'Grinding LeetCode is often frustrating when you get stuck. PrepHub AI provides progressive algorithmic intuition and time complexity guidance so you learn patterns, not memorize solutions.'
    },
    {
      icon: '🎯',
      title: 'Real Corporate OA Simulations',
      description:
        'Most candidates fail at initial online rounds before speaking with an engineer. Our 5-minute timed aptitude sprints simulate high-stress hiring tests at TCS, Infosys, Cognizant, and top tech firms.'
    },
    {
      icon: '📄',
      title: 'Enterprise ATS Compliance',
      description:
        'Corporate recruiters screen hundreds of resumes using Workday, Taleo, and Greenhouse. PrepHub audits missing technical keywords and converts weak bullet points using Google\'s high-impact X-Y-Z formula.'
    },
    {
      icon: '💼',
      title: 'Peer Placement Knowledge Base',
      description:
        'Democratizing placement intelligence. Real students upload authentic round-by-round debriefs, technical coding prompts, HR discussion points, and verified campus tips.'
    },
    {
      icon: '🎨',
      title: '3D Interactive Experience',
      description:
        'Built with Three.js and custom procedural geometry, turning the stressful placement season into an immersive, engaging, and motivating preparation journey.'
    }
  ];

  const milestones = [
    { number: '10,000+', label: 'AI Algorithmic Hints Delivered' },
    { number: '94%', label: 'Average ATS Score Improvement' },
    { number: '450+', label: 'Verified Campus Interview Debriefs' },
    { number: '98.4%', label: 'Candidate Readiness Index' }
  ];

  const comparisons = [
    {
      traditional: '15 fragmented browser tabs, stale Notion tables, and messy Google Docs',
      prephub: 'One unified, developer-first command center with automated visual analytics'
    },
    {
      traditional: 'Checking the full solution immediately when stuck, leading to poor retention',
      prephub: 'Gradual AI hints explaining algorithmic intuition and edge cases without code spoilers'
    },
    {
      traditional: 'Surprised by strict 60-second-per-question aptitude speed tests during company drives',
      prephub: 'Strict 5-minute countdown quizzes with real campus questions and shortcut formulas'
    },
    {
      traditional: 'Submitting resumes blindly without knowing if corporate ATS parsers reject them',
      prephub: 'Comprehensive ATS audit with role-specific keyword analysis and bullet score breakdowns'
    },
    {
      traditional: 'Gatekept interview insights and rumors heard through second-hand word of mouth',
      prephub: 'Open-access community archive featuring chronological rounds and verified placement tips'
    }
  ];

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '40px 24px' }}>
      {/* Hero Header */}
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 60px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '999px',
            background: 'rgba(96, 181, 255, 0.12)',
            border: '1px solid rgba(96, 181, 255, 0.35)',
            marginBottom: '16px'
          }}
        >
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.4px' }}>
            ABOUT PREPHUB AI
          </span>
        </div>

        <h1 style={{ fontSize: '46px', fontWeight: 800, margin: '8px 0 20px', letterSpacing: '-1.5px', color: 'var(--text-primary)', lineHeight: 1.18 }}>
          Empowering Every Student to <br />
          <span className="text-gradient">Crack Dream Tech Offers</span>
        </h1>

        <p style={{ fontSize: '17px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          PrepHub AI was built to solve the most fragmented challenge in college tech careers: transforming academic theory into offer-winning campus placement readiness through intelligent diagnostics, timed simulations, and AI mentoring.
        </p>
      </div>

      {/* Our Mission Statement Card */}
      <TiltCard3D
        maxTilt={5}
        className="card"
        style={{
          padding: '40px 48px',
          marginBottom: '64px',
          background: 'linear-gradient(135deg, rgba(96, 181, 255, 0.08) 0%, rgba(94, 242, 213, 0.06) 50%, var(--bg-card) 100%)',
          border: '1px solid rgba(96, 181, 255, 0.28)'
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
              OUR NORTH STAR
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 16px', lineHeight: 1.3 }}>
              Bridging the Gap Between Engineering Classrooms and Top Tech Drives
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.65, margin: '0 0 16px' }}>
              Every placement season, thousands of talented engineers miss out on their dream companies not because they lack passion, but because campus hiring is an uncoordinated triathlon of DSA speed, quantitative aptitude, and ATS resume filters.
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.65, margin: 0 }}>
              PrepHub AI unifies these critical phases into a single, cohesive command center. Powered by Google Gemini AI, it acts as your round-the-clock placement coach, helping you identify your exact preparation blindspots before recruiters do.
            </p>
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '28px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '14px', textTransform: 'uppercase' }}>
              Key Placement Pillars
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#5EF2D5', fontSize: '18px' }}>✓</span>
                <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600 }}>
                  Automated Placement Readiness Scoring (0 to 100%)
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#5EF2D5', fontSize: '18px' }}>✓</span>
                <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600 }}>
                  Real Online Assessment Speed Countdown Sprints
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#5EF2D5', fontSize: '18px' }}>✓</span>
                <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600 }}>
                  Google Gemini 3.5 Algorithmic Intuition Mentoring
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#5EF2D5', fontSize: '18px' }}>✓</span>
                <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600 }}>
                  Open Community Archive with Chronological Interview Timelines
                </span>
              </div>
            </div>
          </div>
        </div>
      </TiltCard3D>

      {/* Traditional vs PrepHub AI Comparison Table */}
      <div style={{ marginBottom: '64px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#F79D65', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
            THE PREPARATION DIFFERENCE
          </div>
          <h2 style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Traditional Placement Prep vs. PrepHub AI
          </h2>
        </div>

        <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              background: 'var(--bg-input)',
              padding: '16px 24px',
              borderBottom: '1px solid var(--border-color)',
              fontWeight: 700,
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.8px'
            }}
          >
            <div style={{ color: '#F35252' }}>❌ Traditional Fragmented Prep</div>
            <div style={{ color: '#5EF2D5' }}>✓ The PrepHub AI Way</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {comparisons.map((c, i) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  padding: '18px 24px',
                  borderBottom: i === comparisons.length - 1 ? 'none' : '1px solid var(--border-color)',
                  fontSize: '14px',
                  lineHeight: 1.55,
                  backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)'
                }}
              >
                <div style={{ color: 'var(--text-secondary)', paddingRight: '20px' }}>
                  {c.traditional}
                </div>
                <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                  {c.prephub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Six Pillars Grid */}
      <div style={{ marginBottom: '64px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
            CORE ARCHITECTURE
          </div>
          <h2 style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            The Six Pillars of PrepHub AI
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          {pillars.map((p, i) => (
            <TiltCard3D
              key={i}
              maxTilt={8}
              className="card"
              style={{
                padding: '28px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ fontSize: '32px' }}>{p.icon}</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                {p.title}
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                {p.description}
              </p>
            </TiltCard3D>
          ))}
        </div>
      </div>

      {/* Platform Impact Stats */}
      <div
        className="card"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '24px',
          padding: '36px',
          marginBottom: '64px',
          textAlign: 'center',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)'
        }}
      >
        {milestones.map((m, i) => (
          <div key={i}>
            <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-1px' }}>
              {m.number}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 600 }}>
              {m.label}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA Card */}
      <div
        className="card"
        style={{
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(96, 181, 255, 0.16) 0%, rgba(94, 242, 213, 0.12) 50%, var(--bg-card) 100%)',
          border: '1px solid rgba(96, 181, 255, 0.35)',
          padding: '48px 32px'
        }}
      >
        <h2 style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 12px' }}>
          Take the Stress Out of Campus Placements
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '580px', margin: '0 auto 28px', lineHeight: 1.6 }}>
          Join fellow students mastering DSA patterns, conquering aptitude speed sprints, and optimizing resumes for dream tech roles.
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to={token ? '/dashboard' : '/signup'}
            className="btn btn-primary"
            style={{ padding: '13px 34px', fontSize: '15px' }}
          >
            {token ? 'Go to Dashboard →' : 'Start Preparing Free →'}
          </Link>
          <Link
            to="/"
            className="btn btn-secondary"
            style={{ padding: '13px 26px', fontSize: '15px' }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default About;
