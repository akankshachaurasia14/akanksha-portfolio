import { FiLock } from 'react-icons/fi'

export default function Footer({ profile }) {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>© {new Date().getFullYear()} {profile?.name || 'Akanksha Chaurasia'}. Built with React, Express, and MongoDB.</p>
        <div className="footer-links">
          <a href="#admin" className="admin-trigger-link" title="Admin Console">
            <FiLock /> Admin
          </a>
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  )
}

