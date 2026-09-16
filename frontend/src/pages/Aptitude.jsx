import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TiltCard3D from '../components/TiltCard3D';

function Aptitude({ token }) {
  const [activeTab, setActiveTab] = useState('quiz'); // 'quiz' | 'practice' | 'history'
  const [category, setCategory] = useState('Quantitative');

  // Quiz State
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [qId]: optionIndex }
  const [quizActive, setQuizActive] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [quizResult, setQuizResult] = useState(null);

  // Practice Browser State
  const [practiceQuestions, setPracticeQuestions] = useState([]);
  const [practiceLoading, setPracticeLoading] = useState(false);
  const [revealedSolutions, setRevealedSolutions] = useState({}); // { [qId]: bool }

  // History State
  const [attempts, setAttempts] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Timer effect for Quiz
  useEffect(() => {
    let timer = null;
    if (quizActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (quizActive && timeLeft === 0) {
      handleSubmitQuiz();
    }
    return () => clearInterval(timer);
  }, [quizActive, timeLeft]);

  // Fetch practice questions when switching to practice tab or category
  useEffect(() => {
    if (activeTab === 'practice') {
      fetchPracticeQuestions();
    } else if (activeTab === 'history') {
      fetchAttempts();
    }
  }, [activeTab, category]);

  async function fetchPracticeQuestions() {
    try {
      setPracticeLoading(true);
      const res = await axios.get('http://localhost:5000/api/aptitude/questions', {
        headers: { authorization: token },
        params: { category }
      });
      setPracticeQuestions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setPracticeLoading(false);
    }
  }

  async function fetchAttempts() {
    try {
      setHistoryLoading(true);
      const res = await axios.get('http://localhost:5000/api/aptitude/attempts', {
        headers: { authorization: token }
      });
      setAttempts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  }

  async function startQuiz(selectedCat) {
    try {
      setQuizLoading(true);
      setQuizResult(null);
      setSelectedAnswers({});
      setCurrentQIndex(0);
      setTimeLeft(300);

      const res = await axios.get('http://localhost:5000/api/aptitude/quiz', {
        headers: { authorization: token },
        params: { category: selectedCat, count: 5 }
      });

      setQuizQuestions(res.data);
      setQuizActive(true);
    } catch (err) {
      console.error(err);
    } finally {
      setQuizLoading(false);
    }
  }

  async function handleSubmitQuiz() {
    setQuizActive(false);
    setQuizLoading(true);

    const answersPayload = quizQuestions.map((q) => ({
      questionId: q._id,
      selectedOptionIndex: selectedAnswers[q._id] !== undefined ? selectedAnswers[q._id] : -1
    }));

    const timeSpent = 300 - timeLeft;

    try {
      const res = await axios.post(
        'http://localhost:5000/api/aptitude/submit',
        {
          category,
          answers: answersPayload,
          timeTakenSeconds: timeSpent
        },
        { headers: { authorization: token } }
      );
      setQuizResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setQuizLoading(false);
    }
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  const currentQ = quizQuestions[currentQIndex];

  return (
    <div className="content-area">
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-solved">OA Assessment Arena</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>TCS • Infosys • Cognizant • Capgemini</span>
          </div>
          <h1 style={{ fontSize: '26px', margin: 0, fontWeight: 800 }}>
            Placement Aptitude <span className="text-gradient">Engine</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Master Quantitative, Logical, and Verbal aptitude with timed assessment sprints and step-by-step solutions.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(17, 24, 39, 0.7)', padding: '6px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <button
            className={`filter-pill ${activeTab === 'quiz' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('quiz');
              setQuizActive(false);
              setQuizResult(null);
            }}
          >
            ⏱️ Timed Quiz
          </button>
          <button
            className={`filter-pill ${activeTab === 'practice' ? 'active' : ''}`}
            onClick={() => setActiveTab('practice')}
          >
            📚 Question Bank
          </button>
          <button
            className={`filter-pill ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            📈 Attempt History
          </button>
        </div>
      </div>

      {/* TAB 1: TIMED QUIZ MODE */}
      {activeTab === 'quiz' && (
        <div>
          {!quizActive && !quizResult && (
            <div style={{ maxWidth: '820px', margin: '0 auto' }}>
              {/* Quiz Landing Card */}
              <div
                className="card"
                style={{
                  padding: '36px',
                  background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9))',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.7)'
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                  <div style={{ fontSize: '44px', marginBottom: '10px' }}>⏱️</div>
                  <h2 style={{ fontSize: '24px', color: '#fff', fontWeight: 800 }}>
                    Online Assessment (OA) Speed Sprint
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', maxWidth: '560px', margin: '8px auto 0', lineHeight: 1.6 }}>
                    Select a category to launch a 5-question test with a strict 5-minute timer. Simulates top tech and service MNC initial hiring rounds.
                  </p>
                </div>

                {/* Category Selection Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '32px' }}>
                  {[
                    {
                      id: 'Quantitative',
                      icon: '📐',
                      title: 'Quantitative',
                      desc: 'Work, Speed, Percentages, Profit/Loss'
                    },
                    {
                      id: 'Logical',
                      icon: '🧩',
                      title: 'Logical',
                      desc: 'Syllogisms, Blood Relations, Series'
                    },
                    {
                      id: 'Verbal',
                      icon: '📖',
                      title: 'Verbal',
                      desc: 'Grammar, Comprehension, Correction'
                    },
                    {
                      id: 'Mixed',
                      icon: '⚡',
                      title: 'Mixed Placement',
                      desc: 'Simulates full TCS NQT / Infosys test'
                    }
                  ].map((cat) => {
                    const isSelected = category === cat.id;
                    return (
                      <TiltCard3D
                        key={cat.id}
                        maxTilt={12}
                        onClick={() => setCategory(cat.id)}
                        style={{
                          padding: '18px 16px',
                          borderRadius: '12px',
                          background: isSelected
                            ? 'linear-gradient(135deg, rgba(96, 181, 255, 0.25), rgba(94, 242, 213, 0.2))'
                            : 'rgba(13, 20, 36, 0.65)',
                          border: isSelected ? '1.5px solid #60B5FF' : '1px solid rgba(255, 255, 255, 0.08)',
                          boxShadow: isSelected ? '0 0 20px rgba(96, 181, 255, 0.35)' : 'none',
                          cursor: 'pointer',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ fontSize: '28px', marginBottom: '8px' }}>{cat.icon}</div>
                        <div style={{ fontWeight: 700, fontSize: '15px', color: isSelected ? '#fff' : 'var(--text-primary)' }}>
                          {cat.title}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                          {cat.desc}
                        </div>
                      </TiltCard3D>
                    );
                  })}
                </div>

                {/* Features Pill Banner */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '28px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#5EF2D5' }}>✓</span> 5 Questions
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#5EF2D5' }}>✓</span> 300s Countdown
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#5EF2D5' }}>✓</span> Instant Detailed Solutions
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#5EF2D5' }}>✓</span> Auto-saves to History
                  </span>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <button
                    className="btn btn-primary"
                    style={{ padding: '13px 40px', fontSize: '15px', fontWeight: 800 }}
                    onClick={() => startQuiz(category)}
                    disabled={quizLoading}
                  >
                    {quizLoading ? 'Preparing Questions...' : `⚡ Begin ${category} Test →`}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Active Quiz View */}
          {quizActive && currentQ && (
            <div style={{ maxWidth: '820px', margin: '0 auto' }}>
              {/* Question Header Card */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="badge badge-solved" style={{ fontSize: '12px', background: 'rgba(96, 181, 255, 0.15)', color: '#60B5FF' }}>
                    {currentQ.category}
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    Topic: {currentQ.topic}
                  </span>
                </div>

                {/* Glowing Live Countdown */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 14px',
                    borderRadius: '999px',
                    background: timeLeft < 60 ? 'rgba(243, 82, 82, 0.15)' : 'rgba(15, 23, 42, 0.8)',
                    border: timeLeft < 60 ? '1px solid rgba(243, 82, 82, 0.4)' : '1px solid var(--border-color)'
                  }}
                >
                  <span style={{ fontSize: '12px', color: timeLeft < 60 ? '#F35252' : 'var(--text-muted)' }}>
                    {timeLeft < 60 ? '⚠️ Time Critical:' : 'Time Left:'}
                  </span>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 800,
                      fontSize: '17px',
                      color: timeLeft < 60 ? '#F35252' : '#60B5FF'
                    }}
                  >
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>

              {/* Clickable Question Navigation Dots */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {quizQuestions.map((q, idx) => {
                    const isAnswered = selectedAnswers[q._id] !== undefined;
                    const isCurrent = currentQIndex === idx;
                    return (
                      <div
                        key={q._id}
                        onClick={() => setCurrentQIndex(idx)}
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '13px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          background: isCurrent
                            ? 'linear-gradient(135deg, #60B5FF, #5EF2D5)'
                            : isAnswered
                            ? 'rgba(94, 242, 213, 0.15)'
                            : 'var(--bg-input)',
                          border: isCurrent
                            ? '2px solid #fff'
                            : isAnswered
                            ? '1px solid #5EF2D5'
                            : '1px solid var(--border-color)',
                          color: isCurrent ? '#090e1a' : isAnswered ? '#5EF2D5' : 'var(--text-secondary)',
                          boxShadow: isCurrent ? '0 0 14px rgba(96, 181, 255, 0.5)' : 'none'
                        }}
                        title={`Jump to Question ${idx + 1} (${isAnswered ? 'Answered' : 'Unanswered'})`}
                      >
                        {idx + 1}
                      </div>
                    );
                  })}
                </div>

                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <span style={{ fontWeight: 700, color: '#10b981' }}>
                    {Object.keys(selectedAnswers).length}
                  </span>{' '}
                  of {quizQuestions.length} answered
                </div>
              </div>

              {/* Question Text */}
              <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '20px', borderRadius: '12px', marginBottom: '24px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
                  QUESTION {currentQIndex + 1}
                </div>
                <h3 style={{ fontSize: '16.5px', color: 'var(--text-primary)', margin: 0, lineHeight: 1.6, fontWeight: 600 }}>
                  {currentQ.question}
                </h3>
              </div>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedAnswers[currentQ._id] === idx;
                  return (
                    <div
                      key={idx}
                      className={`question-option-card ${isSelected ? 'selected' : ''}`}
                      onClick={() =>
                        setSelectedAnswers({ ...selectedAnswers, [currentQ._id]: idx })
                      }
                    >
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          border: isSelected ? '2px solid #60B5FF' : '1px solid #334155',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '13px',
                          fontWeight: 800,
                          color: isSelected ? '#030712' : 'var(--text-secondary)',
                          background: isSelected ? 'linear-gradient(135deg, #60B5FF, #5EF2D5)' : 'rgba(11, 17, 32, 0.8)',
                          flexShrink: 0
                        }}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <div style={{ fontSize: '14.5px', color: isSelected ? '#fff' : 'var(--text-primary)', fontWeight: isSelected ? 600 : 400 }}>
                        {option}
                      </div>
                      {isSelected && (
                        <div style={{ marginLeft: 'auto', color: '#5EF2D5', fontSize: '16px', fontWeight: 700 }}>
                          ✓
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Navigation Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '18px' }}>
                <button
                  className="btn btn-secondary"
                  disabled={currentQIndex === 0}
                  onClick={() => setCurrentQIndex((prev) => prev - 1)}
                  style={{ opacity: currentQIndex === 0 ? 0.4 : 1 }}
                >
                  ← Previous
                </button>

                {currentQIndex < quizQuestions.length - 1 ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => setCurrentQIndex((prev) => prev + 1)}
                    style={{ padding: '9px 24px' }}
                  >
                    Next Question →
                  </button>
                ) : (
                  <button
                    className="btn btn-primary"
                    style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', padding: '9px 26px', fontWeight: 700 }}
                    onClick={handleSubmitQuiz}
                  >
                    Submit Test ✓
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Quiz Result View */}
          {quizResult && (
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              {/* Result Summary Card */}
              <div
                className="card"
                style={{
                  textAlign: 'center',
                  marginBottom: '24px',
                  padding: '36px',
                  background: 'linear-gradient(135deg, rgba(30, 41, 59, 1), rgba(15, 23, 42, 1))',
                  border: '1px solid rgba(99, 102, 241, 0.3)'
                }}
              >
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>
                  {quizResult.percentage >= 80 ? '🏆' : quizResult.percentage >= 60 ? '⚡' : '📚'}
                </div>
                <h2 style={{ fontSize: '26px', color: '#fff', margin: 0, fontWeight: 800 }}>
                  Test Score: {quizResult.score} / {quizResult.totalQuestions}{' '}
                  <span className={quizResult.percentage >= 70 ? 'text-gradient-emerald' : 'text-gradient-gold'}>
                    ({quizResult.percentage}%)
                  </span>
                </h2>

                <div style={{ display: 'inline-flex', gap: '8px', margin: '14px 0', alignItems: 'center' }}>
                  <span
                    className="badge"
                    style={{
                      backgroundColor:
                        quizResult.percentage >= 80
                          ? 'rgba(16, 185, 129, 0.2)'
                          : quizResult.percentage >= 60
                          ? 'rgba(56, 189, 248, 0.2)'
                          : 'rgba(245, 158, 11, 0.2)',
                      color:
                        quizResult.percentage >= 80
                          ? '#34d399'
                          : quizResult.percentage >= 60
                          ? '#38bdf8'
                          : '#fbbf24',
                      fontSize: '13px'
                    }}
                  >
                    {quizResult.percentage >= 80
                      ? 'Placement OA Ready • High Percentile'
                      : quizResult.percentage >= 60
                      ? 'Solid Foundation • Revise Timing'
                      : 'Concept Practice Sprint Recommended'}
                  </span>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6 }}>
                  {quizResult.percentage >= 80
                    ? 'Outstanding speed and accuracy! You are well-positioned for initial aptitude screening in tier-1/tier-2 company drives.'
                    : quizResult.percentage >= 60
                    ? 'Good effort! Review the step-by-step formula shortcuts below to improve your speed under time pressure.'
                    : 'Aptitude tests are all about pattern recognition. Inspect the solutions below and re-attempt to solidify formulas.'}
                </p>

                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setQuizResult(null);
                      setQuizActive(false);
                    }}
                    style={{ padding: '10px 28px' }}
                  >
                    Take Another Test
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setActiveTab('practice')}
                  >
                    Browse Question Bank
                  </button>
                </div>
              </div>

              {/* Review / Explanations List */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', color: '#fff', margin: 0 }}>Detailed Question Solutions</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Explanations with shortcut formulas
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {quizResult.review.map((item, idx) => (
                  <div
                    key={idx}
                    className="card"
                    style={{
                      borderLeft: `4px solid ${item.isCorrect ? '#10b981' : '#ef4444'}`,
                      background: item.isCorrect ? 'rgba(16, 185, 129, 0.03)' : 'rgba(239, 68, 68, 0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                        QUESTION {idx + 1} • {item.topic}
                      </span>
                      <span className={`badge ${item.isCorrect ? 'badge-easy' : 'badge-hard'}`}>
                        {item.isCorrect ? '✓ Correct (+1)' : '✕ Incorrect (0)'}
                      </span>
                    </div>

                    <div style={{ fontWeight: 600, fontSize: '15.5px', marginBottom: '14px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                      {item.question}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px', marginBottom: '14px' }}>
                      <div
                        style={{
                          padding: '10px 14px',
                          borderRadius: '8px',
                          background: item.isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          border: item.isCorrect ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(239, 68, 68, 0.25)',
                          fontSize: '13px'
                        }}
                      >
                        <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Your Answer: </span>
                        <span style={{ fontWeight: 700, color: item.isCorrect ? '#34d399' : '#f87171' }}>
                          {item.selectedOptionIndex >= 0 ? item.options[item.selectedOptionIndex] : 'Not Answered'}
                        </span>
                      </div>

                      {!item.isCorrect && (
                        <div
                          style={{
                            padding: '10px 14px',
                            borderRadius: '8px',
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.25)',
                            fontSize: '13px'
                          }}
                        >
                          <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Correct Answer: </span>
                          <span style={{ fontWeight: 700, color: '#34d399' }}>
                            {item.options[item.correctOptionIndex]}
                          </span>
                        </div>
                      )}
                    </div>

                    {item.explanation && (
                      <div
                        style={{
                          background: 'var(--bg-input)',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          color: 'var(--text-secondary)',
                          lineHeight: 1.6,
                          border: '1px solid var(--border-color)'
                        }}
                      >
                        <strong style={{ color: '#FFE588' }}>💡 Step-by-Step Explanation: </strong>
                        {item.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: QUESTION BANK BROWSER */}
      {activeTab === 'practice' && (
        <div>
          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '22px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginRight: '6px' }}>Category:</span>
            {['Quantitative', 'Logical', 'Verbal'].map((cat) => (
              <button
                key={cat}
                className={`filter-pill ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat === 'Quantitative' ? '📐' : cat === 'Logical' ? '🧩' : '📖'} {cat}
              </button>
            ))}
          </div>

          {practiceLoading ? (
            <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>
              Loading practice questions...
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {practiceQuestions.map((q, idx) => {
                const isRevealed = revealedSolutions[q._id];
                return (
                  <div key={q._id} className="card" style={{ padding: '22px 24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span className="badge badge-solved">
                          {q.topic}
                        </span>
                        <span className={`badge badge-${q.difficulty.toLowerCase()}`}>
                          {q.difficulty}
                        </span>
                      </div>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                        Question #{idx + 1}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '16px', margin: '8px 0 16px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                      {q.question}
                    </h4>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px', marginBottom: '16px' }}>
                      {q.options.map((opt, oIdx) => {
                        const isCorrect = isRevealed && oIdx === q.correctOptionIndex;
                        return (
                          <div
                            key={oIdx}
                            style={{
                              padding: '10px 14px',
                              background: isCorrect ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-input)',
                              borderRadius: '8px',
                              fontSize: '13.5px',
                              border: isCorrect
                                ? '1px solid #10b981'
                                : '1px solid var(--border-color)',
                              color: isCorrect ? '#34d399' : 'var(--text-primary)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}
                          >
                            <span style={{ fontWeight: 700, color: isCorrect ? '#34d399' : 'var(--text-muted)' }}>
                              {String.fromCharCode(65 + oIdx)}.
                            </span>
                            <span>{opt}</span>
                            {isCorrect && <span style={{ marginLeft: 'auto', fontWeight: 800 }}>✓</span>}
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() =>
                          setRevealedSolutions({
                            ...revealedSolutions,
                            [q._id]: !isRevealed
                          })
                        }
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <span>{isRevealed ? '▲ Hide Solution' : '💡 Show Answer & Step-by-Step Formula'}</span>
                      </button>
                    </div>

                    {isRevealed && (
                      <div
                        style={{
                          marginTop: '14px',
                          background: 'rgba(16, 185, 129, 0.06)',
                          padding: '14px 18px',
                          borderRadius: '8px',
                          border: '1px solid rgba(16, 185, 129, 0.2)',
                          fontSize: '13.5px',
                          lineHeight: 1.6
                        }}
                      >
                        <div style={{ color: '#34d399', fontWeight: 700, marginBottom: '4px' }}>
                          Correct Answer: Option {String.fromCharCode(65 + q.correctOptionIndex)} — {q.options[q.correctOptionIndex]}
                        </div>
                        <div style={{ color: 'var(--text-secondary)' }}>
                          <strong>Explanation: </strong> {q.explanation}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ATTEMPT HISTORY */}
      {activeTab === 'history' && (
        <div>
          {historyLoading ? (
            <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>
              Loading test records...
            </div>
          ) : attempts.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>📊</div>
              <div style={{ fontSize: '16px', color: 'var(--text-primary)', fontWeight: 600 }}>No test attempts recorded yet</div>
              <p style={{ marginTop: '6px', fontSize: '13.5px' }}>
                Launch your first test in the "Timed Quiz" tab to track your accuracy and time-per-question metrics.
              </p>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Score</th>
                    <th>Accuracy</th>
                    <th>Time Spent</th>
                    <th>Performance Tier</th>
                    <th>Date Taken</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((att) => (
                    <tr key={att._id}>
                      <td>
                        <span className="badge badge-solved">{att.category}</span>
                      </td>
                      <td style={{ fontWeight: 700, fontSize: '14.5px' }}>
                        {att.score} / {att.totalQuestions}
                      </td>
                      <td>
                        <span
                          style={{
                            fontWeight: 700,
                            color: att.percentage >= 70 ? '#34d399' : att.percentage >= 50 ? '#fbbf24' : '#f87171'
                          }}
                        >
                          {att.percentage}%
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '13px', fontFamily: 'monospace' }}>
                        {att.timeTakenSeconds}s
                      </td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            backgroundColor:
                              att.percentage >= 80
                                ? 'rgba(16, 185, 129, 0.15)'
                                : att.percentage >= 60
                                ? 'rgba(56, 189, 248, 0.15)'
                                : 'rgba(245, 158, 11, 0.15)',
                            color:
                              att.percentage >= 80
                                ? '#34d399'
                                : att.percentage >= 60
                                ? '#38bdf8'
                                : '#fbbf24'
                          }}
                        >
                          {att.percentage >= 80 ? 'Tier 1 • High' : att.percentage >= 60 ? 'Tier 2 • Solid' : 'Practice'}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '12.5px' }}>
                        {new Date(att.dateTaken).toLocaleDateString()} at{' '}
                        {new Date(att.dateTaken).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Aptitude;
