import { motion } from 'framer-motion'
import { FiGithub, FiExternalLink } from 'react-icons/fi'

export default function Projects({ profile }) {
  const projects = profile?.projects || []

  return (
    <section className="section" id="projects">
      <div className="container">
        <motion.div
          className="section-head"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <p className="eyebrow">03 — Projects</p>
          <h2>Things I've built and shipped.</h2>
          <p>Each one started as a question — could this parse a resume, could this hear me, could this run a hospital floor on fewer spreadsheets.</p>
        </motion.div>

        <div className="project-list">
          {projects.map((project, i) => (
            <motion.article
              className={`project-card ${project.featured ? 'is-featured' : ''}`}
              key={project.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: (i % 2) * 0.08 }}
            >
              <div className="project-card-glow" aria-hidden="true" />
              <div className="project-card-inner">
                <div className="project-card-top">
                  {project.featured && <span className="featured-tag">Flagship</span>}
                  {project.period && <span className="project-period">{project.period}</span>}
                </div>

                <h3>{project.title}</h3>

                <ul className="project-description">
                  {project.description.map((line, idx) => (
                    <li key={idx}>{line}</li>
                  ))}
                </ul>

                <div className="project-tech-row">
                  {project.techStack.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>

                <div className="project-links">
                  {project.codeUrl && project.codeUrl !== '#' ? (
                    <a href={project.codeUrl} target="_blank" rel="noreferrer">
                      <FiGithub /> Code
                    </a>
                  ) : (
                    <span className="link-placeholder">
                      <FiGithub /> Code link coming soon
                    </span>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer">
                      <FiExternalLink /> Live
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
