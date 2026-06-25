const express = require('express')
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const Profile = require('../models/Profile')
const fallbackProfile = require('../data/fallback-profile.json')

const router = express.Router()

const FALLBACK_PATH = path.join(__dirname, '../data/fallback-profile.json')

function isDbConnected() {
  return mongoose.connection.readyState === 1
}

function readFallbackProfile() {
  try {
    if (fs.existsSync(FALLBACK_PATH)) {
      const raw = fs.readFileSync(FALLBACK_PATH, 'utf8')
      return JSON.parse(raw)
    }
  } catch (err) {
    console.error('Failed to read local fallback profile file:', err)
  }
  return fallbackProfile
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

// GET /api/profile — returns the current profile.
router.get('/', async (req, res) => {
  try {
    if (isDbConnected()) {
      const profile = await Profile.findOne().sort({ createdAt: 1 })
      if (profile) {
        return res.json(profile)
      }
    }
    return res.json(readFallbackProfile())
  } catch (error) {
    console.error('Error fetching profile:', error)
    return res.json(readFallbackProfile())
  }
})

// PUT /api/profile — updates the profile.
router.put('/', verifyAdmin, async (req, res) => {
  try {
    const update = req.body

    if (isDbConnected()) {
      const existing = await Profile.findOne().sort({ createdAt: 1 })
      let profile
      if (existing) {
        Object.assign(existing, update)
        profile = await existing.save()
      } else {
        profile = await Profile.create(update)
      }
      return res.json(profile)
    } else {
      // Dynamic local persistence fallback
      const profileData = readFallbackProfile()
      Object.assign(profileData, update)
      fs.writeFileSync(FALLBACK_PATH, JSON.stringify(profileData, null, 2), 'utf8')
      return res.json(profileData)
    }
  } catch (error) {
    console.error('Error updating profile:', error)
    return res.status(400).json({ error: 'Could not update profile. Check the data shape.' })
  }
})

module.exports = router

