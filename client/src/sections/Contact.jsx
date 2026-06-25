import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheck, FiAlertCircle } from 'react-icons/fi'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Contact({ profile }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [statusMessage, setStatusMessage] = useState('')

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return

    setStatus('sending')
    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await response.json()

      if (response.ok || response.status === 202) {
        setStatus('success')
        setStatusMessage(
          response.status === 202
            ? "Message captured — the database isn't connected yet, so it's logged server-side for now."
            : "Sent. I'll get back to you soon."
        )
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        throw new Error(data.error || 'Something went wrong.')
      }
    } catch (error) {
      setStatus('error')
      setStatusMessage(
        error.message === 'Failed to fetch'
          ? "Couldn't reach the server. Check that the backend is running and VITE_API_URL is set correctly."
          : error.message
      )
    }
  }

  return (
    <section className="section" id="contact">
      <div className="container">
        <motion.div
          className="section-head"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <p className="eyebrow">05 — Contact</p>
          <h2>Let's talk.</h2>
          <p>Internship opportunities, project collaboration, or just a question about how something here was built — I read every message.</p>
        </motion.div>

        <div className="contact-grid">
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            {profile?.email && (
              <a className="contact-info-row" href={`mailto:${profile.email}`}>
                <FiMail />
                <span>{profile.email}</span>
              </a>
            )}
            {profile?.phone && (
              <a className="contact-info-row" href={`tel:${profile.phone.replace(/\s/g, '')}`}>
                <FiPhone />
                <span>{profile.phone}</span>
              </a>
            )}
            {profile?.location && (
              <div className="contact-info-row">
                <FiMapPin />
                <span>{profile.location}</span>
              </div>
            )}
          </motion.div>

          <motion.form
            className="contact-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            <div className="form-row">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={handleChange('name')}
                placeholder="Your name"
                required
              />
            </div>
            <div className="form-row">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="form-row">
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                type="text"
                value={form.subject}
                onChange={handleChange('subject')}
                placeholder="What's this about?"
              />
            </div>
            <div className="form-row">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                rows={5}
                value={form.message}
                onChange={handleChange('message')}
                placeholder="Tell me a bit about the opportunity or question."
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : (
                <>
                  Send message <FiSend />
                </>
              )}
            </button>

            {status === 'success' && (
              <p className="form-status is-success">
                <FiCheck /> {statusMessage}
              </p>
            )}
            {status === 'error' && (
              <p className="form-status is-error">
                <FiAlertCircle /> {statusMessage}
              </p>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  )
}
