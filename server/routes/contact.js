const express = require('express')
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const Message = require('../models/Message')

const router = express.Router()
const MESSAGES_PATH = path.join(__dirname, '../data/messages.json')

function isDbConnected() {
  return mongoose.connection.readyState === 1
}

function readLocalMessages() {
  try {
    if (fs.existsSync(MESSAGES_PATH)) {
      const raw = fs.readFileSync(MESSAGES_PATH, 'utf8')
      return JSON.parse(raw)
    }
  } catch (err) {
    console.error('Failed to read local messages:', err)
  }
  return []
}

function writeLocalMessages(messages) {
  try {
    fs.writeFileSync(MESSAGES_PATH, JSON.stringify(messages, null, 2), 'utf8')
  } catch (err) {
    console.error('Failed to write local messages:', err)
  }
}

// Authentication middleware checking x-admin-password
function verifyAdmin(req, res, next) {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  const providedPassword = req.headers['x-admin-password']
  if (providedPassword !== adminPassword) {
    return res.status(401).json({ error: 'Unauthorized: Invalid admin password.' })
  }
  next()
}

// POST /api/contact — saves a message from the contact form.
router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body || {}

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' })
  }

  if (isDbConnected()) {
    try {
      const saved = await Message.create({ name, email, subject, message })
      return res.status(201).json({ success: true, id: saved._id })
    } catch (error) {
      console.error('Error saving message:', error)
      return res.status(500).json({ error: 'Could not save your message. Please try again.' })
    }
  } else {
    // Dynamic local fallback storage
    try {
      const messages = readLocalMessages()
      const newMessage = {
        _id: 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        name,
        email,
        subject,
        message,
        createdAt: new Date().toISOString()
      }
      messages.unshift(newMessage)
      writeLocalMessages(messages)
      return res.status(201).json({ success: true, id: newMessage._id, local: true })
    } catch (error) {
      console.error('Error saving local message:', error)
      return res.status(500).json({ error: 'Could not save message locally.' })
    }
  }
})

// GET /api/contact — lists saved messages (for you to read later).
router.get('/', verifyAdmin, async (req, res) => {
  if (isDbConnected()) {
    try {
      const messages = await Message.find().sort({ createdAt: -1 })
      return res.json(messages)
    } catch (error) {
      console.error('Error fetching messages:', error)
      return res.status(500).json({ error: 'Could not fetch messages.' })
    }
  } else {
    return res.json(readLocalMessages())
  }
})

// DELETE /api/contact/:id — deletes a message.
router.delete('/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params

  if (isDbConnected()) {
    try {
      const deleted = await Message.findByIdAndDelete(id)
      if (!deleted) {
        return res.status(404).json({ error: 'Message not found.' })
      }
      return res.json({ success: true })
    } catch (error) {
      console.error('Error deleting message:', error)
      return res.status(500).json({ error: 'Could not delete message.' })
    }
  } else {
    try {
      const messages = readLocalMessages()
      const filtered = messages.filter((m) => m._id !== id)
      if (filtered.length === messages.length) {
        return res.status(404).json({ error: 'Message not found.' })
      }
      writeLocalMessages(filtered)
      return res.json({ success: true })
    } catch (error) {
      console.error('Error deleting local message:', error)
      return res.status(500).json({ error: 'Could not delete message.' })
    }
  }
})

module.exports = router

