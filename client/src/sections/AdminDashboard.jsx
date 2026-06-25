import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiLock,
  FiLogOut,
  FiCheckCircle,
  FiAlertTriangle,
  FiTrash2,
  FiPlus,
  FiX,
  FiSave,
  FiFolder,
  FiBriefcase,
  FiBookOpen,
  FiSliders,
  FiMail,
  FiInfo,
  FiArrowLeft,
  FiMoon,
  FiSun
} from 'react-icons/fi'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function AdminDashboard({ profile: initialProfile, theme, toggleTheme }) {
  const [password, setPassword] = useState(localStorage.getItem('admin-password') || '')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [passwordInput, setPasswordInput] = useState('')

  const [activeTab, setActiveTab] = useState('messages') // messages | general | skills | projects | experience
  const [messages, setMessages] = useState([])
  const [profile, setProfile] = useState(initialProfile || null)
  const [dbStatus, setDbStatus] = useState({ connected: false, mode: 'Offline Fallback' })

  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' })
  const [saving, setSaving] = useState(false)

  // Notification helper
  const showNotify = (message, type = 'success') => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }))
    }, 3500)
  }

  // Load database connection status
  const checkDbStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/api/health`)
      if (res.ok) {
        const data = await res.json()
        setDbStatus({
          connected: data.dbConnected,
          mode: data.dbConnected ? 'MongoDB (Cloud)' : 'Local JSON Fallback'
        })
      }
    } catch (err) {
      setDbStatus({ connected: false, mode: 'Local Server Offline' })
    }
  }

  // Verify stored password or input password
  const attemptLogin = async (pwToTry, isStored = false) => {
    if (!pwToTry) return
    setLoading(true)
    setLoginError('')
    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        headers: { 'x-admin-password': pwToTry }
      })
      
      if (response.ok) {
        const msgs = await response.json()
        setMessages(msgs)
        setPassword(pwToTry)
        localStorage.setItem('admin-password', pwToTry)
        setIsLoggedIn(true)
        showNotify('Successfully authenticated.', 'success')
      } else {
        const errData = await response.json().catch(() => ({}))
        setLoginError(errData.error || 'Authentication failed. Incorrect password.')
        if (isStored) {
          localStorage.removeItem('admin-password')
          setPassword('')
        }
      }
    } catch (err) {
      setLoginError('Could not reach the server. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  // Fetch fresh profile data
  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/api/profile`)
      if (res.ok) {
        const data = await res.json()
        setProfile(data)
      }
    } catch (err) {
      console.error('Error fetching profile:', err)
    }
  }

  useEffect(() => {
    checkDbStatus()
    if (password) {
      attemptLogin(password, true)
    }
    fetchProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    attemptLogin(passwordInput)
  }

  const handleLogout = () => {
    localStorage.removeItem('admin-password')
    setPassword('')
    setIsLoggedIn(false)
    setMessages([])
    showNotify('Logged out successfully.', 'info')
  }

  // Delete a message
  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return
    try {
      const res = await fetch(`${API_URL}/api/contact/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': password }
      })
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m._id !== id))
        showNotify('Message deleted.', 'success')
      } else {
        const err = await res.json()
        showNotify(err.error || 'Failed to delete message.', 'error')
      }
    } catch (err) {
      showNotify('Server error. Could not delete message.', 'error')
    }
  }

  // Save profile helper
  const handleSaveProfile = async (updatedFields) => {
    setSaving(true)
    try {
      const res = await fetch(`${API_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password
        },
        body: JSON.stringify(updatedFields)
      })
      if (res.ok) {
        const data = await res.json()
        setProfile(data)
        showNotify('Profile updated successfully!', 'success')
      } else {
        const err = await res.json()
        showNotify(err.error || 'Failed to save changes.', 'error')
      }
    } catch (err) {
      showNotify('Connection error. Could not save changes.', 'error')
    } finally {
      setSaving(false)
    }
  }

  // Form Handlers
  const handleGeneralSubmit = (e) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    const data = {
      name: fd.get('name'),
      title: fd.get('title'),
      tagline: fd.get('tagline'),
      bio: fd.get('bio'),
      location: fd.get('location'),
      email: fd.get('email'),
      phone: fd.get('phone'),
      github: fd.get('github'),
      linkedin: fd.get('linkedin'),
      photoUrl: fd.get('photoUrl')
    }
    handleSaveProfile(data)
  }

  // Skill Management
  const [editingSkills, setEditingSkills] = useState([])
  useEffect(() => {
    if (profile?.skillGroups) {
      setEditingSkills(JSON.parse(JSON.stringify(profile.skillGroups)))
    }
  }, [profile])

  const handleSaveSkills = () => {
    handleSaveProfile({ skillGroups: editingSkills })
  }

  // Project Management
  const [editingProjects, setEditingProjects] = useState([])
  const [activeProjectIdx, setActiveProjectIdx] = useState(null)
  useEffect(() => {
    if (profile?.projects) {
      setEditingProjects(JSON.parse(JSON.stringify(profile.projects)))
    }
  }, [profile])

  const handleSaveProjects = () => {
    handleSaveProfile({ projects: editingProjects })
    setActiveProjectIdx(null)
  }

  // Experience & Education Management
  const [editingExp, setEditingExp] = useState([])
  const [editingEdu, setEditingEdu] = useState([])
  const [editingSoc, setEditingSoc] = useState([])
  useEffect(() => {
    if (profile) {
      setEditingExp(JSON.parse(JSON.stringify(profile.experience || [])))
      setEditingEdu(JSON.parse(JSON.stringify(profile.education || [])))
      setEditingSoc(JSON.parse(JSON.stringify(profile.societies || [])))
    }
  }, [profile])

  const handleSaveTimeline = () => {
    handleSaveProfile({
      experience: editingExp,
      education: editingEdu,
      societies: editingSoc
    })
  }

  // RENDER: Login Form
  if (!isLoggedIn) {
    return (
      <div className="admin-login-page">
        <div className="admin-bg-decor" />
        <div className="admin-login-card">
          <div className="login-logo">
            <span className="logo-mark">AC</span>
            <h2>Portfolio Admin Panel</h2>
          </div>
          <p className="login-desc">Enter the administrative password to manage the portfolio content and view form messages.</p>
          
          <form onSubmit={handleLoginSubmit}>
            <div className="form-row">
              <label htmlFor="admin-pass">Access Password</label>
              <div className="password-input-wrap">
                <FiLock className="input-icon" />
                <input
                  id="admin-pass"
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter admin password"
                  required
                />
              </div>
            </div>
            
            {loginError && (
              <div className="login-error">
                <FiAlertTriangle /> {loginError}
              </div>
            )}

            <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <a href="#" className="login-back-link">
            <FiArrowLeft /> Back to Website
          </a>
        </div>
      </div>
    )
  }

  // RENDER: Main Dashboard
  return (
    <div className="admin-dashboard-container">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            className={`admin-toast ${notification.type}`}
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            {notification.type === 'success' ? <FiCheckCircle /> : <FiAlertTriangle />}
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header bar */}
      <header className="admin-header">
        <div className="admin-header-logo">
          <a href="#" className="admin-logo-mark">AC</a>
          <div>
            <h1>Admin Console</h1>
            <div className="db-badge">
              <span className={`badge-dot ${dbStatus.connected ? 'active' : 'fallback'}`} />
              <span>Storage: {dbStatus.mode}</span>
            </div>
          </div>
        </div>

        <div className="admin-header-actions">
          <button className="theme-switch" onClick={toggleTheme}>
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>
          <a href="#" className="btn btn-ghost" title="Exit to portfolio">
            <FiArrowLeft /> Exit Panel
          </a>
          <button onClick={handleLogout} className="btn logout-btn" title="Sign Out">
            <FiLogOut /> Logout
          </button>
        </div>
      </header>

      <div className="admin-layout">
        {/* Sidebar Nav */}
        <aside className="admin-sidebar">
          <nav>
            <button
              className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => setActiveTab('messages')}
            >
              <FiMail />
              <span>Messages ({messages.length})</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              <FiInfo />
              <span>General Info</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'skills' ? 'active' : ''}`}
              onClick={() => setActiveTab('skills')}
            >
              <FiSliders />
              <span>Skills Groups</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              <FiFolder />
              <span>Projects</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'experience' ? 'active' : ''}`}
              onClick={() => setActiveTab('experience')}
            >
              <FiBriefcase />
              <span>Path & Timeline</span>
            </button>
          </nav>
        </aside>

        {/* Tab Content Panel */}
        <main className="admin-content">
          {/* TAB 1: MESSAGES */}
          {activeTab === 'messages' && (
            <div className="tab-pane">
              <div className="pane-head">
                <h2>Contact Form Inbox</h2>
                <p>Messages submitted by users through the contact form are stored here.</p>
              </div>

              {messages.length === 0 ? (
                <div className="empty-state">
                  <FiMail className="empty-icon" />
                  <h3>Your inbox is empty</h3>
                  <p>No messages have been submitted yet.</p>
                </div>
              ) : (
                <div className="messages-list">
                  {messages.map((msg) => (
                    <div className="message-card" key={msg._id}>
                      <div className="message-header">
                        <div>
                          <span className="msg-sender">{msg.name}</span>
                          <a href={`mailto:${msg.email}`} className="msg-email">
                            &lt;{msg.email}&gt;
                          </a>
                        </div>
                        <span className="msg-date">
                          {new Date(msg.createdAt).toLocaleDateString(undefined, {
                            dateStyle: 'medium'
                          })}{' '}
                          {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                            timeStyle: 'short'
                          })}
                        </span>
                      </div>
                      <div className="msg-subject">
                        <strong>Subject:</strong> {msg.subject || '(No Subject)'}
                      </div>
                      <div className="msg-body">{msg.message}</div>
                      <div className="message-actions">
                        <button
                          onClick={() => handleDeleteMessage(msg._id)}
                          className="msg-del-btn"
                          title="Delete message"
                        >
                          <FiTrash2 /> Delete Message
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: GENERAL PROFILE */}
          {activeTab === 'general' && (
            <div className="tab-pane">
              <div className="pane-head">
                <h2>General Information</h2>
                <p>Manage primary bio descriptors, photo URLs, and social links.</p>
              </div>

              <form onSubmit={handleGeneralSubmit} className="admin-form">
                <div className="form-grid">
                  <div className="form-row">
                    <label>Full Name</label>
                    <input name="name" defaultValue={profile?.name || ''} required />
                  </div>
                  <div className="form-row">
                    <label>Professional Title</label>
                    <input name="title" defaultValue={profile?.title || ''} required />
                  </div>
                  <div className="form-row col-span-2">
                    <label>Short Tagline</label>
                    <input name="tagline" defaultValue={profile?.tagline || ''} required />
                  </div>
                  <div className="form-row col-span-2">
                    <label>Detailed Biography</label>
                    <textarea name="bio" rows={5} defaultValue={profile?.bio || ''} required />
                  </div>
                  <div className="form-row">
                    <label>Location</label>
                    <input name="location" defaultValue={profile?.location || ''} />
                  </div>
                  <div className="form-row">
                    <label>Contact Email</label>
                    <input name="email" type="email" defaultValue={profile?.email || ''} />
                  </div>
                  <div className="form-row">
                    <label>Contact Phone</label>
                    <input name="phone" defaultValue={profile?.phone || ''} />
                  </div>
                  <div className="form-row">
                    <label>Profile Picture URL</label>
                    <input name="photoUrl" defaultValue={profile?.photoUrl || ''} placeholder="e.g. data:image/png;base64,... or url" />
                  </div>
                  <div className="form-row">
                    <label>GitHub Profile Link</label>
                    <input name="github" defaultValue={profile?.github || ''} />
                  </div>
                  <div className="form-row">
                    <label>LinkedIn Profile Link</label>
                    <input name="linkedin" defaultValue={profile?.linkedin || ''} />
                  </div>
                </div>

                <div className="form-submit-row">
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    <FiSave /> {saving ? 'Saving...' : 'Save General Info'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: SKILLS GROUPS */}
          {activeTab === 'skills' && (
            <div className="tab-pane">
              <div className="pane-head">
                <h2>Skills &amp; Technology Stack</h2>
                <p>Organize your technical toolbox into categories and chips.</p>
              </div>

              <div className="skills-editor">
                {editingSkills.map((group, groupIdx) => (
                  <div className="skills-group-edit-card" key={groupIdx}>
                    <div className="group-edit-header">
                      <input
                        value={group.label}
                        onChange={(e) => {
                          const val = e.target.value
                          setEditingSkills((prev) => {
                            const copy = [...prev]
                            copy[groupIdx].label = val
                            return copy
                          })
                        }}
                        className="group-title-input"
                        placeholder="Category Name"
                        required
                      />
                      <button
                        onClick={() => {
                          setEditingSkills((prev) => prev.filter((_, idx) => idx !== groupIdx))
                        }}
                        className="group-delete-btn"
                        title="Delete category"
                      >
                        <FiTrash2 /> Remove Category
                      </button>
                    </div>

                    <div className="chips-editor">
                      <label>Skills Chips (Comma separated or add individually)</label>
                      <div className="skill-tags-list">
                        {group.items.map((item, itemIdx) => (
                          <span className="skill-editor-tag" key={itemIdx}>
                            <span>{item}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingSkills((prev) => {
                                  const copy = [...prev]
                                  copy[groupIdx].items = copy[groupIdx].items.filter((_, idx) => idx !== itemIdx)
                                  return copy
                                })
                              }}
                            >
                              <FiX />
                            </button>
                          </span>
                        ))}
                      </div>

                      <div className="add-tag-row">
                        <input
                          id={`new-tag-${groupIdx}`}
                          type="text"
                          placeholder="Add new skill tag"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              const val = e.target.value.trim()
                              if (!val) return
                              setEditingSkills((prev) => {
                                const copy = [...prev]
                                if (!copy[groupIdx].items.includes(val)) {
                                  copy[groupIdx].items.push(val)
                                }
                                return copy
                              })
                              e.target.value = ''
                            }
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn-ghost tag-add-btn"
                          onClick={() => {
                            const inp = document.getElementById(`new-tag-${groupIdx}`)
                            const val = inp?.value.trim()
                            if (!val) return
                            setEditingSkills((prev) => {
                              const copy = [...prev]
                              if (!copy[groupIdx].items.includes(val)) {
                                copy[groupIdx].items.push(val)
                              }
                              return copy
                            })
                            inp.value = ''
                          }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="btn btn-ghost add-group-btn"
                  onClick={() => {
                    setEditingSkills((prev) => [
                      ...prev,
                      { label: 'New Skills Category', items: [] }
                    ])
                  }}
                >
                  <FiPlus /> Add New Category
                </button>

                <div className="form-submit-row">
                  <button onClick={handleSaveSkills} className="btn btn-primary" disabled={saving}>
                    <FiSave /> {saving ? 'Saving...' : 'Save Skills Grid'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="tab-pane">
              <div className="pane-head">
                <h2>Portfolio Projects</h2>
                <p>Manage and configure the projects showcased in your portfolio.</p>
              </div>

              <div className="projects-editor-grid">
                {/* Left Side: Projects List */}
                <div className="projects-list-sidebar">
                  {editingProjects.map((project, idx) => (
                    <button
                      className={`project-sidebar-item ${activeProjectIdx === idx ? 'active' : ''}`}
                      key={idx}
                      onClick={() => setActiveProjectIdx(idx)}
                    >
                      <div className="project-item-meta">
                        <h4>{project.title || 'Untitled Project'}</h4>
                        <span>{project.period || 'No Date'}</span>
                      </div>
                      {project.featured && <span className="featured-badge">Flagship</span>}
                    </button>
                  ))}

                  <button
                    className="btn btn-ghost add-project-sidebar-btn"
                    onClick={() => {
                      const newProj = {
                        title: 'New Project Title',
                        period: 'June 2026',
                        techStack: ['React', 'Node'],
                        description: ['Add description point here.'],
                        codeUrl: '#',
                        liveUrl: '',
                        featured: false
                      }
                      setEditingProjects((prev) => [...prev, newProj])
                      setActiveProjectIdx(editingProjects.length)
                    }}
                  >
                    <FiPlus /> Add Project
                  </button>
                </div>

                {/* Right Side: Active Project Form */}
                <div className="project-edit-form-wrap">
                  {activeProjectIdx === null ? (
                    <div className="empty-project-prompt">
                      <FiFolder className="prompt-icon" />
                      <h3>Select a project to edit</h3>
                      <p>Click a project on the sidebar, or create a new one to begin editing.</p>
                    </div>
                  ) : (
                    <div className="project-form-card">
                      <div className="form-header-row">
                        <h3>Edit Project Details</h3>
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this project?')) {
                              setEditingProjects((prev) => prev.filter((_, i) => i !== activeProjectIdx))
                              setActiveProjectIdx(null)
                            }
                          }}
                          className="msg-del-btn"
                        >
                          <FiTrash2 /> Delete
                        </button>
                      </div>

                      <div className="admin-form">
                        <div className="form-grid">
                          <div className="form-row">
                            <label>Project Title</label>
                            <input
                              value={editingProjects[activeProjectIdx].title}
                              onChange={(e) => {
                                const val = e.target.value
                                setEditingProjects((prev) => {
                                  const copy = [...prev]
                                  copy[activeProjectIdx].title = val
                                  return copy
                                })
                              }}
                              required
                            />
                          </div>
                          <div className="form-row">
                            <label>Development Period</label>
                            <input
                              value={editingProjects[activeProjectIdx].period}
                              onChange={(e) => {
                                const val = e.target.value
                                setEditingProjects((prev) => {
                                  const copy = [...prev]
                                  copy[activeProjectIdx].period = val
                                  return copy
                                })
                              }}
                              placeholder="e.g. June 2026 – Present"
                            />
                          </div>
                          <div className="form-row">
                            <label>Repository Link (Code)</label>
                            <input
                              value={editingProjects[activeProjectIdx].codeUrl}
                              onChange={(e) => {
                                const val = e.target.value
                                setEditingProjects((prev) => {
                                  const copy = [...prev]
                                  copy[activeProjectIdx].codeUrl = val
                                  return copy
                                })
                              }}
                            />
                          </div>
                          <div className="form-row">
                            <label>Live Deployment Link</label>
                            <input
                              value={editingProjects[activeProjectIdx].liveUrl}
                              onChange={(e) => {
                                const val = e.target.value
                                setEditingProjects((prev) => {
                                  const copy = [...prev]
                                  copy[activeProjectIdx].liveUrl = val
                                  return copy
                                })
                              }}
                            />
                          </div>
                          <div className="form-row col-span-2">
                            <label>Tech Stack (Comma-separated tags)</label>
                            <input
                              value={editingProjects[activeProjectIdx].techStack.join(', ')}
                              onChange={(e) => {
                                const val = e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                                setEditingProjects((prev) => {
                                  const copy = [...prev]
                                  copy[activeProjectIdx].techStack = val
                                  return copy
                                })
                              }}
                              placeholder="React, Express, Node, MongoDB"
                            />
                          </div>
                          <div className="form-row col-span-2">
                            <label>Description Bullet Points (One per line)</label>
                            <textarea
                              rows={5}
                              value={editingProjects[activeProjectIdx].description.join('\n')}
                              onChange={(e) => {
                                const val = e.target.value.split('\n').filter(Boolean)
                                setEditingProjects((prev) => {
                                  const copy = [...prev]
                                  copy[activeProjectIdx].description = val
                                  return copy
                                })
                              }}
                              placeholder="Built a full-stack job portal..."
                            />
                          </div>
                          <div className="form-row checkbox-row">
                            <label className="checkbox-container">
                              <input
                                type="checkbox"
                                checked={editingProjects[activeProjectIdx].featured}
                                onChange={(e) => {
                                  const val = e.target.checked
                                  setEditingProjects((prev) => {
                                    const copy = [...prev]
                                    copy[activeProjectIdx].featured = val
                                    return copy
                                  })
                                }}
                              />
                              <span className="checkmark" />
                              Highlight as "Flagship" Project (Featured)
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-submit-row" style={{ marginTop: 24 }}>
                <button onClick={handleSaveProjects} className="btn btn-primary" disabled={saving}>
                  <FiSave /> {saving ? 'Saving...' : 'Save Projects List'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: EXPERIENCE & EDUCATION */}
          {activeTab === 'experience' && (
            <div className="tab-pane">
              <div className="pane-head">
                <h2>Path, Education &amp; Leadership</h2>
                <p>Manage timeline nodes, school records, and society listings.</p>
              </div>

              <div className="timeline-editors-grid">
                {/* 5.1 Experience Section */}
                <div className="editor-group-card">
                  <div className="group-card-header">
                    <h3>Work Experience</h3>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        setEditingExp((prev) => [
                          ...prev,
                          { role: 'New Role', org: 'Organization Name', period: 'Date range', location: '', bullets: ['Description bullet'] }
                        ])
                      }}
                    >
                      <FiPlus /> Add Job
                    </button>
                  </div>

                  {editingExp.map((exp, idx) => (
                    <div className="inner-timeline-edit-card" key={idx}>
                      <div className="card-top-action-bar">
                        <h4>Job #{idx + 1}</h4>
                        <button
                          onClick={() => setEditingExp((prev) => prev.filter((_, i) => i !== idx))}
                          className="msg-del-btn"
                        >
                          <FiTrash2 /> Remove
                        </button>
                      </div>

                      <div className="form-grid-mini">
                        <div className="form-row">
                          <label>Job Role</label>
                          <input
                            value={exp.role}
                            onChange={(e) => {
                              const val = e.target.value
                              setEditingExp((prev) => {
                                const copy = [...prev]
                                copy[idx].role = val
                                return copy
                              })
                            }}
                          />
                        </div>
                        <div className="form-row">
                          <label>Company / Organization</label>
                          <input
                            value={exp.org}
                            onChange={(e) => {
                              const val = e.target.value
                              setEditingExp((prev) => {
                                const copy = [...prev]
                                copy[idx].org = val
                                return copy
                              })
                            }}
                          />
                        </div>
                        <div className="form-row">
                          <label>Time Period</label>
                          <input
                            value={exp.period}
                            onChange={(e) => {
                              const val = e.target.value
                              setEditingExp((prev) => {
                                const copy = [...prev]
                                copy[idx].period = val
                                return copy
                              })
                            }}
                          />
                        </div>
                        <div className="form-row">
                          <label>Location</label>
                          <input
                            value={exp.location || ''}
                            onChange={(e) => {
                              const val = e.target.value
                              setEditingExp((prev) => {
                                const copy = [...prev]
                                copy[idx].location = val
                                return copy
                              })
                            }}
                          />
                        </div>
                        <div className="form-row col-span-2">
                          <label>Bullets (One per line)</label>
                          <textarea
                            rows={3}
                            value={exp.bullets.join('\n')}
                            onChange={(e) => {
                              const val = e.target.value.split('\n').filter(Boolean)
                              setEditingExp((prev) => {
                                const copy = [...prev]
                                copy[idx].bullets = val
                                return copy
                              })
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 5.2 Education Section */}
                <div className="editor-group-card">
                  <div className="group-card-header">
                    <h3>Education</h3>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        setEditingEdu((prev) => [
                          ...prev,
                          { school: 'University Name', degree: 'Degree Name', period: 'Date range', score: '', coursework: [] }
                        ])
                      }}
                    >
                      <FiPlus /> Add Education
                    </button>
                  </div>

                  {editingEdu.map((edu, idx) => (
                    <div className="inner-timeline-edit-card" key={idx}>
                      <div className="card-top-action-bar">
                        <h4>Record #{idx + 1}</h4>
                        <button
                          onClick={() => setEditingEdu((prev) => prev.filter((_, i) => i !== idx))}
                          className="msg-del-btn"
                        >
                          <FiTrash2 /> Remove
                        </button>
                      </div>

                      <div className="form-grid-mini">
                        <div className="form-row">
                          <label>Degree Name</label>
                          <input
                            value={edu.degree}
                            onChange={(e) => {
                              const val = e.target.value
                              setEditingEdu((prev) => {
                                const copy = [...prev]
                                copy[idx].degree = val
                                return copy
                              })
                            }}
                          />
                        </div>
                        <div className="form-row">
                          <label>School / Institution</label>
                          <input
                            value={edu.school}
                            onChange={(e) => {
                              const val = e.target.value
                              setEditingEdu((prev) => {
                                const copy = [...prev]
                                copy[idx].school = val
                                return copy
                              })
                            }}
                          />
                        </div>
                        <div className="form-row">
                          <label>Time Period</label>
                          <input
                            value={edu.period}
                            onChange={(e) => {
                              const val = e.target.value
                              setEditingEdu((prev) => {
                                const copy = [...prev]
                                copy[idx].period = val
                                return copy
                              })
                            }}
                          />
                        </div>
                        <div className="form-row">
                          <label>Score (GPA/CGPA/Percentage)</label>
                          <input
                            value={edu.score || ''}
                            onChange={(e) => {
                              const val = e.target.value
                              setEditingEdu((prev) => {
                                const copy = [...prev]
                                copy[idx].score = val
                                return copy
                              })
                            }}
                          />
                        </div>
                        <div className="form-row col-span-2">
                          <label>Key Coursework (Comma separated)</label>
                          <input
                            value={edu.coursework ? edu.coursework.join(', ') : ''}
                            onChange={(e) => {
                              const val = e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                              setEditingEdu((prev) => {
                                const copy = [...prev]
                                copy[idx].coursework = val
                                return copy
                              })
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 5.3 Leadership / Societies Section */}
                <div className="editor-group-card col-span-2">
                  <div className="group-card-header">
                    <h3>Leadership &amp; Societies</h3>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        setEditingSoc((prev) => [
                          ...prev,
                          { name: 'Society Title', description: 'Description text' }
                        ])
                      }}
                    >
                      <FiPlus /> Add Leadership Node
                    </button>
                  </div>

                  {editingSoc.map((soc, idx) => (
                    <div className="inner-timeline-edit-card" key={idx}>
                      <div className="card-top-action-bar">
                        <h4>Role #{idx + 1}</h4>
                        <button
                          onClick={() => setEditingSoc((prev) => prev.filter((_, i) => i !== idx))}
                          className="msg-del-btn"
                        >
                          <FiTrash2 /> Remove
                        </button>
                      </div>

                      <div className="form-grid-mini">
                        <div className="form-row">
                          <label>Role / Society Name</label>
                          <input
                            value={soc.name}
                            onChange={(e) => {
                              const val = e.target.value
                              setEditingSoc((prev) => {
                                const copy = [...prev]
                                copy[idx].name = val
                                return copy
                              })
                            }}
                          />
                        </div>
                        <div className="form-row">
                          <label>Brief Description</label>
                          <input
                            value={soc.description}
                            onChange={(e) => {
                              const val = e.target.value
                              setEditingSoc((prev) => {
                                const copy = [...prev]
                                copy[idx].description = val
                                return copy
                              })
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-submit-row">
                <button onClick={handleSaveTimeline} className="btn btn-primary" disabled={saving}>
                  <FiSave /> {saving ? 'Saving...' : 'Save Timeline & Path'}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
