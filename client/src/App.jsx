import { useState, useEffect } from 'react'
import { useTheme } from './hooks/useTheme'
import { useProfile } from './hooks/useProfile'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoadingScreen from './components/LoadingScreen'

import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import Projects from './sections/Projects'
import Experience from './sections/Experience'
import Contact from './sections/Contact'
import AdminDashboard from './sections/AdminDashboard'

import './App.css'

function App() {
  const { theme, toggleTheme } = useTheme()
  const { profile, loading, error } = useProfile()
  const [currentHash, setCurrentHash] = useState(window.location.hash)

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash)
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  const isAdminView = currentHash === '#admin'

  if (isAdminView) {
    return (
      <div id="top">
        <AdminDashboard profile={profile} theme={theme} toggleTheme={toggleTheme} />
      </div>
    )
  }

  return (
    <div id="top">
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {error === 'offline' && (
        <div className="offline-banner">
          Showing locally bundled content — the backend isn't reachable right now.
        </div>
      )}

      <main>
        <Hero profile={profile} />
        <About profile={profile} />
        <Skills profile={profile} />
        <Projects profile={profile} />
        <Experience profile={profile} />
        <Contact profile={profile} />
      </main>

      <Footer profile={profile} />
    </div>
  )
}

export default App

