
import { motion } from 'framer-motion'
import { Route, Routes } from 'react-router-dom'
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'))
const Learn = lazy(() => import('./pages/Learn.jsx'))
const Lesson = lazy(() => import('./pages/Lesson.jsx'))
const TypingArena = lazy(() => import('./pages/TypingArena.jsx'))
const History = lazy(() => import('./pages/History.jsx'))
import { lazy, Suspense, useState } from 'react'
const FingerLab = lazy(() => import('./pages/FingerLab.jsx'))
const Games = lazy(() => import('./pages/Games.jsx'))
const GameHistory = lazy(() => import('./pages/GameHistory.jsx'))
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock3,
  Command,
  Flame,
  Keyboard,
  Menu,
  MousePointer2,
  Play,
  Sparkles,
  Target,
  Trophy,
  X,
  Zap,
} from 'lucide-react'

import './App.css'

const features = [
  {
    icon: BookOpen,
    number: '01',
    title: 'Learn from zero',
    description:
      'A structured 30-day academy that teaches proper finger placement, keyboard control and touch typing.',
  },
  {
    icon: Target,
    number: '02',
    title: 'Practice with purpose',
    description:
      'Build accuracy and speed through focused exercises, word drills and realistic typing challenges.',
  },
  {
    icon: Trophy,
    number: '03',
    title: 'See your progress',
    description:
      'Understand your WPM, accuracy, consistency and weak keys as your typing skills improve.',
  },
]

const academyDays = [
  { range: '01 — 07', title: 'Build your foundation', detail: 'Keyboard basics & home row' },
  { range: '08 — 14', title: 'Find your flow', detail: 'Top row & finger coordination' },
  { range: '15 — 21', title: 'Master every row', detail: 'Full keyboard & touch typing' },
  { range: '22 — 30', title: 'Become faster', detail: 'Speed, accuracy & final assessment' },
]

const typingText = 'the quick brown fox jumps over the lazy dog'
function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <main className="typeup">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

     
<header className="navbar">
  <a className="brand" href="#home" onClick={closeMenu}>
    <span className="brand-mark">
      <Keyboard size={21} strokeWidth={2.2} />
    </span>

    <span>
      type<span className="brand-accent">up</span><small>.</small>
    </span>
  </a>

  <button
    className="mobile-menu-button"
    aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
    aria-expanded={menuOpen}
    onClick={() => setMenuOpen(!menuOpen)}
  >
    {menuOpen ? <X /> : <Menu />}
  </button>

  <nav className={`nav-links ${menuOpen ? 'nav-open' : ''}`}>
    <a href="#features" onClick={closeMenu}>Why TYPEUP</a>
    <a href="#academy" onClick={closeMenu}>30-day academy</a>
    <a href="#arena" onClick={closeMenu}>Typing arena</a>
    <a href="#about" onClick={closeMenu}>About</a>
  </nav>

  <Link
    className="nav-cta"
    to="/dashboard"
    onClick={closeMenu}
  >
    Get started <ArrowUpRight size={16} />
  </Link>
</header>


      <section className="hero-section" id="home">
        <div className="hero-copy">
          <motion.div
            className="eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="eyebrow-dot" />
            YOUR JOURNEY TO BETTER TYPING STARTS HERE
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Your fingers.
            <br />
            Your rhythm.
            <br />
            <span className="gradient-text">Your speed.</span>
          </motion.h1>

          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Stop hunting for keys. Start typing with confidence.
            Learn touch typing from the ground up and build a skill
            that stays with you.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <a href="#academy" className="button-primary">
              Start learning <ArrowRight size={18} />
            </a>
            <a href="#arena" className="button-secondary">
              <Play size={16} /> Explore typing arena
            </a>
          </motion.div>

          <motion.div
            className="hero-note"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span><Check size={14} /> Free to use</span>
            <span><Check size={14} /> No account needed</span>
            <span><Check size={14} /> Beginner friendly</span>
          </motion.div>
        </div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.92, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          <div className="visual-glow" />

          <div className="typing-window glass-panel">
            <div className="window-topbar">
              <div className="window-dots"><i /><i /><i /></div>
              <span className="window-label">TYPEUP / PRACTICE</span>
              <span className="live-indicator"><span /> LIVE</span>
            </div>

            <div className="typing-content">
              <div className="typing-label">
                <span>YOUR DAILY PRACTICE</span>
                <span className="practice-time"><Clock3 size={13} /> 01:00</span>
              </div>

              <div className="typing-sentence">
                {typingText.split('').map((char, index) => (
                  <span
                    key={`${char}-${index}`}
                    className={index < 10 ? 'typed-char' : index === 10 ? 'current-char' : ''}
                  >
                    {char}
                  </span>
                ))}
              </div>

              <div className="typing-cursor-line">
                <span className="cursor-line" />
                <span>Keep your eyes on the screen</span>
              </div>

              <div className="typing-stats">
                <div>
                  <strong>60</strong>
                  <span>WPM</span>
                </div>
                <div>
                  <strong>98<span className="stat-unit">%</span></strong>
                  <span>ACCURACY</span>
                </div>
                <div>
                  <strong>01:00</strong>
                  <span>TIME LEFT</span>
                </div>
              </div>
            </div>

            <div className="keyboard-preview">
              {['Q W E R T Y U I O P', 'A S D F G H J K L', 'Z X C V B N M'].map((line, row) => (
                <div className="key-row" key={row}>
                  {line.split(' ').map((key) => (
                    <span
                      key={key}
                      className={`keyboard-key ${
                        ['F', 'J', 'D', 'K'].includes(key) ? 'key-highlight' : ''
                      }`}
                    >
                      {key}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <motion.div
            className="floating-card floating-speed glass-panel"
            animate={{ y: [0, -9, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="floating-icon"><Zap size={16} /></span>
            <div><strong>60 WPM</strong><small>Keep improving</small></div>
          </motion.div>

          <motion.div
            className="floating-card floating-streak glass-panel"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="floating-icon streak-icon"><Flame size={17} /></span>
            <div><strong>Day 07</strong><small>Your journey</small></div>
          </motion.div>
        </motion.div>
      </section>

      <section className="trust-strip">
        <span>ONE KEYBOARD</span>
        <span className="strip-line" />
        <span>TEN FINGERS</span>
        <span className="strip-line" />
        <span>ENDLESS POSSIBILITIES</span>
      </section>

      <section className="features-section section-wrap" id="features">
        <div className="section-heading">
          <span className="section-kicker">THE TYPEUP METHOD</span>
          <h2>Typing is a skill.<br /><span className="gradient-text">Let's build it right.</span></h2>
          <p>Not just another typing test. A better way to learn, practise and improve.</p>
        </div>

        <div className="feature-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.article
                className="feature-card glass-panel"
                key={feature.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
              >
                <div className="feature-top">
                  <span className="feature-icon"><Icon size={21} /></span>
                  <span className="feature-number">{feature.number}</span>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <span className="feature-arrow"><ArrowUpRight size={18} /></span>
              </motion.article>
            )
          })}
        </div>
      </section>

      <section className="academy-section section-wrap" id="academy">
        <div className="academy-copy">
          <span className="section-kicker">YOUR FIRST 30 DAYS</span>
          <h2>Small steps.<br /><span className="gradient-text">Real progress.</span></h2>
          <p>
            No guesswork. Follow a guided learning path that takes you from
            your first home-row exercise to confident touch typing.
          </p>
          <a href="/dashboard" className="button-primary">
            Enter the academy <ArrowRight size={18} />
          </a>
          <div className="academy-meta">
            <span><Clock3 size={15} /> 30 minutes a day</span>
            <span><Command size={15} /> 30 guided lessons</span>
          </div>
        </div>

        <div className="academy-roadmap glass-panel">
          <div className="roadmap-header">
            <div>
              <span className="roadmap-kicker">LEARNING PATH</span>
              <h3>Your 30-day roadmap</h3>
            </div>
            <span className="roadmap-count">30 DAYS</span>
          </div>
          <div className="roadmap-list">
            {academyDays.map((day, index) => (
              <div className="roadmap-item" key={day.range}>
                <div className={`roadmap-marker ${index === 0 ? 'marker-active' : ''}`}>
                  {index === 0 ? <Play size={12} fill="currentColor" /> : <span>0{index + 1}</span>}
                </div>
                <div className="roadmap-text">
                  <span>{`DAYS ${day.range}`}</span>
                  <strong>{day.title}</strong>
                  <small>{day.detail}</small>
                </div>
                <ArrowUpRight className="roadmap-arrow" size={17} />
              </div>
            ))}
          </div>
          <div className="roadmap-footer">
            <Sparkles size={15} /> One day at a time. One skill for life.
          </div>
        </div>
      </section>

      <section className="arena-section section-wrap" id="arena">
        <div className="arena-card glass-panel">
          <div className="arena-copy">
            <span className="section-kicker">READY WHEN YOU ARE</span>
            <h2>Enter the <span className="gradient-text">typing arena.</span></h2>
            <p>
              Put your skills to the test. Challenge your speed, sharpen your
              accuracy and discover what your fingers can really do.
            </p>
            <a href="/arena" className="button-primary">
              Explore the arena <ArrowRight size={18} />
            </a>
          </div>
          <div className="arena-art">
            <div className="arena-orbit orbit-one" />
            <div className="arena-orbit orbit-two" />
            <div className="arena-center">
              <MousePointer2 size={30} />
              <span>TYPE</span>
              <strong>FASTER.</strong>
            </div>
            <div className="arena-tag tag-one"><Zap size={14} /> SPEED</div>
            <div className="arena-tag tag-two"><Target size={14} /> ACCURACY</div>
          </div>
        </div>
      </section>

      <section className="closing-section section-wrap" id="about">
        <span className="section-kicker">THE FIRST KEY IS YOURS</span>
        <h2>Ready to find your <span className="gradient-text">flow?</span></h2>
        <p>Start for free. Learn at your own pace. Get better every day.</p>
        <a href="/dashboard" className="button-primary">
          Get started with TYPEUP <ArrowRight size={18} />
        </a>
      </section>

      <footer className="footer">
        <a className="brand footer-brand" href="#home">
          <span className="brand-mark"><Keyboard size={18} /></span>
          <span>type<span className="brand-accent">up</span><small>.</small></span>
        </a>
        <span>Learn. Practice. Improve.</span>
        <span>Made for every keystroke. © 2026 TYPEUP</span>
      </footer>
    </main>
  )
}

function App() {
  return (
    <Suspense
      fallback={
        <div className="page-loading">
          Loading TYPEUP...
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/learn/day/:dayId" element={<Lesson />} />
        <Route path="/arena" element={<TypingArena />} />
        <Route path="/history" element={<History />} />
        <Route path="*" element={<HomePage />} />
        <Route path="/finger-lab" element={<FingerLab />} />
        <Route path="/games" element={<Games />} />
<Route path="/games/:gameId" element={<Games />} />
        <Route path="/game-history" element={<GameHistory />} />
      </Routes>
    </Suspense>
  )
}
export default App
