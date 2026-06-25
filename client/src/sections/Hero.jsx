import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiMail, FiArrowDown } from 'react-icons/fi'

const TERMINAL_LINES = [
  { prompt: '$', text: 'whoami' },
  { prompt: '>', text: 'akanksha_chaurasia', isOutput: true },
  { prompt: '$', text: 'cat role.txt' },
  { prompt: '>', text: 'MERN Stack Developer · MCA student, Lucknow', isOutput: true },
  { prompt: '$', text: './run --mode=build' },
  { prompt: '>', text: 'compiling resume → portfolio... done.', isOutput: true }
]

function TerminalLine({ line, onDone, startDelay }) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), startDelay)
    return () => clearTimeout(startTimer)
  }, [startDelay])

  useEffect(() => {
    if (!started) return
    if (line.isOutput) {
      // Output lines appear instantly (like a program printing a result)
      setDisplayed(line.text)
      const t = setTimeout(onDone, 220)
      return () => clearTimeout(t)
    }

    // Typed lines animate character by character
    let i = 0
    const interval = setInterval(() => {
      i += 1
      setDisplayed(line.text.slice(0, i))
      if (i >= line.text.length) {
        clearInterval(interval)
        setTimeout(onDone, 260)
      }
    }, 38)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started])

  return (
    <div className={`term-line ${line.isOutput ? 'is-output' : ''}`}>
      <span className="term-prompt">{line.prompt}</span>
      <span>{displayed}</span>
    </div>
  )
}

export default function Hero({ profile }) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [finished, setFinished] = useState(false)
  const photoInputRef = useRef(null)
  const [photoUrl, setPhotoUrl] = useState(profile?.photoUrl || '')

  useEffect(() => {
    setPhotoUrl(profile?.photoUrl || '')
  }, [profile?.photoUrl])

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPhotoUrl(reader.result)
    reader.readAsDataURL(file)
  }

  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="terminal-card" role="img" aria-label="Animated terminal introduction">
            <div className="terminal-bar">
              <span className="dot dot-red" />
              <span className="dot dot-amber" />
              <span className="dot dot-green" />
              <span className="terminal-title">akanksha@portfolio:~</span>
            </div>
            <div className="terminal-body">
              {TERMINAL_LINES.slice(0, visibleCount + 1).map((line, idx) => (
                <TerminalLine
                  key={idx}
                  line={line}
                  startDelay={idx === visibleCount ? 0 : 0}
                  onDone={() => {
                    if (idx === visibleCount && idx < TERMINAL_LINES.length - 1) {
                      setVisibleCount((c) => c + 1)
                    } else if (idx === TERMINAL_LINES.length - 1) {
                      setFinished(true)
                    }
                  }}
                />
              ))}
              {!finished && <span className="term-cursor" aria-hidden="true">▌</span>}
            </div>
          </div>

          <motion.h1
            className="hero-name"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            {profile?.name || 'Akanksha Chaurasia'}
          </motion.h1>

          <motion.p
            className="hero-tagline"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            {profile?.tagline || 'Building systems that read, score, and respond.'}
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
          >
            <a href="#projects" className="btn btn-primary">
              See my work
            </a>
            <a href="#contact" className="btn btn-ghost">
              Get in touch
            </a>
          </motion.div>

          <motion.div
            className="hero-socials"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.6 }}
          >
            {profile?.github && (
              <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                <FiGithub />
              </a>
            )}
            {profile?.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <FiLinkedin />
              </a>
            )}
            {profile?.email && (
              <a href={`mailto:${profile.email}`} aria-label="Email">
                <FiMail />
              </a>
            )}
          </motion.div>
        </div>

        <motion.div
          className="hero-photo-wrap"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          <button
            className="scan-frame"
            onClick={() => photoInputRef.current?.click()}
            aria-label="Change profile photo"
            title="Click to change photo"
          >
            {photoUrl ? (
              <img src={photoUrl} alt={profile?.name || 'Profile'} />
            ) : (
              <div className="scan-placeholder">
                <span>{(profile?.name || 'AC').split(' ').map((w) => w[0]).join('').slice(0, 2)}</span>
              </div>
            )}
            <span className="scan-line" aria-hidden="true" />
            <span className="scan-hint">Click to change photo</span>
          </button>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            hidden
          />
        </motion.div>
      </div>

      <a href="#about" className="scroll-cue" aria-label="Scroll to about section">
        <FiArrowDown />
      </a>
    </section>
  )
}
