import { motion } from 'framer-motion'

export default function Experience({ profile }) {
  const experience = profile?.experience || []
  const education = profile?.education || []
  const societies = profile?.societies || []

  return (
    <section className="section" id="experience">
      <div className="container">
        <motion.div
          className="section-head"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <p className="eyebrow">04 — Path</p>
          <h2>Experience &amp; education.</h2>
        </motion.div>

        <div className="timeline">
          {experience.map((item, i) => (
            <motion.div
              className="timeline-item"
              key={item.role + item.org}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div className="timeline-marker" />
              <div className="timeline-content">
                <div className="timeline-top-row">
                  <h3>{item.role}</h3>
                  <span className="timeline-period">{item.period}</span>
                </div>
                <p className="timeline-org">
                  {item.org}
                  {item.location ? ` · ${item.location}` : ''}
                </p>
                <ul>
                  {item.bullets.map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="edu-society-grid">
          <motion.div
            className="edu-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55 }}
          >
            <p className="eyebrow" style={{ marginBottom: 14 }}>Education</p>
            {education.map((edu) => (
              <div key={edu.school}>
                <h3>{edu.degree}</h3>
                <p className="timeline-org">{edu.school}</p>
                <div className="timeline-top-row" style={{ marginTop: 6 }}>
                  <span className="timeline-period">{edu.period}</span>
                  {edu.score && <span className="edu-score">{edu.score}</span>}
                </div>
                {edu.coursework?.length > 0 && (
                  <div className="skill-chip-row" style={{ marginTop: 14 }}>
                    {edu.coursework.map((course) => (
                      <span className="skill-chip" key={course}>
                        {course}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </motion.div>

          {societies.length > 0 && (
            <motion.div
              className="edu-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: 0.1 }}
            >
              <p className="eyebrow" style={{ marginBottom: 14 }}>Leadership</p>
              {societies.map((s) => (
                <div key={s.name}>
                  <h3>{s.name}</h3>
                  <p className="timeline-org" style={{ marginTop: 10 }}>
                    {s.description}
                  </p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
