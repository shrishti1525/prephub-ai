import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Hero3DCanvas from '../components/Hero3DCanvas';
import TiltCard3D from '../components/TiltCard3D';

function Home({ token }) {
  const [openFaq, setOpenFaq] = useState(null);

  const targetCompanies = [
    'Google', 'Amazon', 'Microsoft', 'TCS Digital', 'Goldman Sachs',
    'Adobe', 'Infosys Power Programmer', 'Accenture', 'Oracle', 'Uber',
    'Flipkart', 'Morgan Stanley'
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

  const howItWorks = [
    {
      step: '01',
      title: 'Diagnostic Baseline',
      desc: 'Log in and upload your current resume. PrepHub calculates your baseline Campus Readiness Score (0-100%) and identifies skill gaps.'
    },
    {
      step: '02',
      title: 'AI Sprint Generation',
      desc: 'Our Gemini AI Coach analyzes your target companies and timelines to engineer a daily step-by-step preparation plan.'
    },
    {
      step: '03',
      title: 'Execute & Practice',
      desc: 'Solve DSA problems with progressive intuition hints and take 5-minute timed OA tests simulating TCS, Infosys, and Cognizant rounds.'
    },
    {
      step: '04',
      title: 'Debrief & Crack Offers',
      desc: 'Review verified interview questions asked in recent campus drives, attend interviews with confidence, and celebrate your offer.'
    }
  ];

  const testimonials = [
    {
      quote: 'The 5-minute aptitude quizzes matched the exact difficulty and time pressure of the TCS Digital assessment. Cracked it on my first try!',
      name: 'Rohan Verma',
      role: 'Placed at TCS Digital',
      batch: 'Class of 2025'
    },
    {
      quote: 'The Gemini ATS resume scan pointed out 4 missing distributed systems keywords that got my resume shortlisted for Amazon SDE-1.',
      name: 'Pooja Iyer',
      role: 'Placed at Amazon',
      batch: 'Class of 2026'
    },
    {
      quote: 'I loved the DSA intuition hints. When I was stuck on Dynamic Programming, it explained the subproblem recurrence without spoiling the code.',
      name: 'Karan Patel',
      role: 'Placed at Microsoft',
      batch: 'Class of 2025'
    }
  ];

  const faqs = [
    {
      q: 'Is PrepHub AI free to use for college students?',
      a: 'Yes! PrepHub AI is 100% free and developer-friendly. You can track unlimited DSA problems, take timed aptitude quizzes, scan resumes, and generate AI study plans.'
    },
    {
      q: 'How does the Gemini AI Algorithmic Mentor work without spoiling answers?',
      a: 'When you request a hint on any DSA problem, Google Gemini analyzes the constraints and patterns to deliver progressive conceptual hints (e.g. two pointers intuition, edge case caveats, optimal Big-O targets) without revealing raw solution code.'
    },
    {
      q: 'What companies are covered in the Aptitude Practice arena?',
      a: 'The assessment arena features questions and timing patterns modeled after premier tech companies and service MNCs, including TCS NQT, Infosys, Cognizant, Wipro, Capgemini, Accenture, and product firm hiring rounds.'
    },
    {
      q: 'Can I log in using my Google account?',
      a: 'Yes! PrepHub AI supports seamless Google authentication. Click "Continue with Google" on the login or signup page to sign in instantly with 1 click.'
    },
    {
      q: 'How does the Resume ATS scanner analyze my PDF?',
      a: 'Our server extracts raw text from your uploaded PDF and cross-checks it against company benchmarks for Software Engineers, Frontend, Backend, and Full Stack roles. It identifies missing keywords, evaluates format readability, and suggests high-impact X-Y-Z rewrites.'
    },
    {
      q: 'Can I toggle between Dark and Light themes?',
      a: 'Absolutely! PrepHub AI features a universal theme toggle button (☀️ / 🌙) in the top navigation and sidebar footer, styled with a high-contrast 5-color palette.'
    }
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

          <h1 style={{ fontSize: '50px', fontWeight: 800, margin: '8px 0 18px', letterSpacing: '-1.5px', color: 'var(--text-primary)', lineHeight: 1.15 }}>
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
                  Sign In with Google
                </Link>
              </>
            )}
            <Link to="/about" className="btn btn-secondary" style={{ padding: '13px 22px', fontSize: '15px' }}>
              About PrepHub
            </Link>
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
              background: 'var(--bg-card)',
              backdropFilter: 'blur(12px)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
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
              background: 'var(--bg-card)',
              backdropFilter: 'blur(12px)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
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
          background: 'var(--bg-card)',
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
            <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
              {h.value}
            </div>
          </div>
        ))}
      </TiltCard3D>

      {/* Target Companies Strip */}
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: '14px' }}>
          PREPARE FOR ROUNDS AT TOP TECH COMPANIES
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {targetCompanies.map((comp, idx) => (
            <span
              key={idx}
              style={{
                padding: '7px 16px',
                background: 'var(--bg-card)',
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
      <div style={{ marginBottom: '64px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
            ALL-IN-ONE COMMAND CENTER
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Everything You Need for Campus Hiring
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
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
                border: '1px solid var(--border-color)'
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
              <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', margin: 0, fontWeight: 700 }}>
                {feat.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', lineHeight: 1.6 }}>
                {feat.description}
              </p>
            </TiltCard3D>
          ))}
        </div>
      </div>

      {/* How It Works - 4 Step Interactive Workflow */}
      <div style={{ marginBottom: '64px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#F79D65', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
            THE 4-STEP ROADMAP
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            How PrepHub Powers Your Placement Sprint
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {howItWorks.map((item, idx) => (
            <div
              key={idx}
              className="card"
              style={{
                padding: '28px',
                border: '1px solid var(--border-color)',
                position: 'relative'
              }}
            >
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 900,
                  color: 'var(--primary)',
                  opacity: 0.85,
                  marginBottom: '12px',
                  fontFamily: 'monospace'
                }}
              >
                {item.step}
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 10px' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Student Testimonials */}
      <div style={{ marginBottom: '64px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#5EF2D5', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
            STUDENT SUCCESS
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            From Campus Sprints to Full-Time Offers
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="card"
              style={{
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid var(--border-color)'
              }}
            >
              <div style={{ fontSize: '14.5px', color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: 1.6, marginBottom: '20px' }}>
                "{t.quote}"
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>{t.name}</div>
                <div style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 600 }}>{t.role}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.batch}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive FAQ Accordion */}
      <div style={{ marginBottom: '64px', maxWidth: '840px', margin: '0 auto 64px auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
            GOT QUESTIONS?
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Frequently Asked Questions
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="card"
                style={{
                  padding: '18px 24px',
                  cursor: 'pointer',
                  border: '1px solid var(--border-color)',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => setOpenFaq(isOpen ? null : idx)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    {faq.q}
                  </h3>
                  <span style={{ fontSize: '18px', color: 'var(--primary)', fontWeight: 700 }}>
                    {isOpen ? '−' : '+'}
                  </span>
                </div>
                {isOpen && (
                  <p style={{ marginTop: '14px', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.65, margin: '14px 0 0' }}>
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Bottom Banner */}
      <div
        className="card"
        style={{
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(96, 181, 255, 0.16) 0%, rgba(94, 242, 213, 0.12) 50%, var(--bg-card) 100%)',
          border: '1px solid rgba(96, 181, 255, 0.35)',
          padding: '48px 32px',
          boxShadow: '0 0 35px -5px rgba(96, 181, 255, 0.2)',
          marginBottom: '56px'
        }}
      >
        <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 12px' }}>
          Ready to Elevate Your Placement Prep?
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '600px', margin: '0 auto 28px', lineHeight: 1.6 }}>
          Join students using PrepHub AI to track coding milestones, practice timed aptitude, and craft ATS-winning resumes.
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to={token ? "/dashboard" : "/signup"} className="btn btn-primary" style={{ padding: '14px 36px', fontSize: '16px' }}>
            {token ? "Go to Your Dashboard →" : "Get Started Free Now →"}
          </Link>
          <Link to="/about" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '16px' }}>
            Learn More in About Us
          </Link>
        </div>
      </div>

      {/* Comprehensive Landing Page Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '32px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div className="logo-badge">P</div>
            <span style={{ fontWeight: 800, fontSize: '18px', color: 'var(--text-primary)' }}>
              PrepHub <span style={{ color: 'var(--primary)' }}>AI</span>
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            The AI-powered diagnostic platform & 3D study planner built for college engineering placements.
          </p>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '12px' }}>
            © 2026 PrepHub AI. Built with ❤️ for students.
          </div>
        </div>

        <div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            Prep Tools
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '13px' }}>
            <Link to={token ? "/dashboard" : "/login"} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Placement Dashboard</Link>
            <Link to={token ? "/coach" : "/login"} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>AI Study Coach</Link>
            <Link to={token ? "/dsa-tracker" : "/login"} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>DSA Problem Tracker</Link>
            <Link to={token ? "/aptitude" : "/login"} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Timed Aptitude Quizzes</Link>
            <Link to={token ? "/resume" : "/login"} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Resume & ATS Scanner</Link>
            <Link to={token ? "/experiences" : "/login"} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Interview Archive</Link>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            Resources & Company
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '13px' }}>
            <Link to="/about" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600 }}>About PrepHub AI</Link>
            <a href="https://github.com/shrishti1525/prephub-ai" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
              GitHub Repository ↗
            </a>
            <span style={{ color: 'var(--text-muted)' }}>Campus Drive Guide 2026</span>
            <span style={{ color: 'var(--text-muted)' }}>Privacy & Terms</span>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            Authentication
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link to="/login" className="btn btn-secondary btn-sm" style={{ textAlign: 'center' }}>
              Sign In
            </Link>
            <Link to="/signup" className="btn btn-primary btn-sm" style={{ textAlign: 'center' }}>
              Register Free
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;