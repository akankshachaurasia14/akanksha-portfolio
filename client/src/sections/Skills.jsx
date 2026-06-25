import { motion } from 'framer-motion'

export default function Skills({ profile }) {
  const groups = profile?.skillGroups || []

  return (
    <section className="section" id="skills">
      <div className="container">
        <motion.div
          className="section-head"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <p className="eyebrow">02 — Stack</p>
          <h2>What I work with.</h2>
          <p>Grouped the way I actually reach for them on a project, not ranked by years.</p>
        </motion.div>

        <div className="skills-grid">
          {groups.map((group, gi) => (
            <motion.div
              className="skill-group"
              key={group.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: gi * 0.08 }}
            >
              <p className="skill-group-label">{group.label}</p>
              <div className="skill-chip-row">
                {group.items.map((item) => (
                  <span className="skill-chip" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
