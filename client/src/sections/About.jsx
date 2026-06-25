import { motion } from 'framer-motion'

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6 }
}

export default function About({ profile }) {
  return (
    <section className="section" id="about">
      <div className="container">
        <motion.div className="section-head" {...fadeUp}>
          <p className="eyebrow">01 — About</p>
          <h2>A little about how I build.</h2>
        </motion.div>

        <div className="about-grid">
          <motion.p className="about-bio" {...fadeUp}>
            {profile?.bio}
          </motion.p>

          <motion.div className="about-facts" {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }}>
            <div className="fact-row">
              <span className="fact-label">Location</span>
              <span className="fact-value">{profile?.location}</span>
            </div>
            <div className="fact-row">
              <span className="fact-label">Focus</span>
              <span className="fact-value">MERN Stack · AI-assisted tools</span>
            </div>
            <div className="fact-row">
              <span className="fact-label">Education</span>
              <span className="fact-value">
                {profile?.education?.[0]?.degree} — {profile?.education?.[0]?.period}
              </span>
            </div>
            <div className="fact-row">
              <span className="fact-label">Status</span>
              <span className="fact-value status-live">
                <span className="status-dot" /> Open to internships
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
