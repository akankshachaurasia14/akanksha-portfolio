const mongoose = require('mongoose')

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    period: { type: String, default: '' },
    techStack: [{ type: String }],
    description: [{ type: String }],
    codeUrl: { type: String, default: '#' },
    liveUrl: { type: String, default: '' },
    featured: { type: Boolean, default: false }
  },
  { _id: false }
)

const ExperienceSchema = new mongoose.Schema(
  {
    role: { type: String, required: true },
    org: { type: String, required: true },
    period: { type: String, default: '' },
    location: { type: String, default: '' },
    bullets: [{ type: String }]
  },
  { _id: false }
)

const EducationSchema = new mongoose.Schema(
  {
    school: { type: String, required: true },
    degree: { type: String, required: true },
    period: { type: String, default: '' },
    location: { type: String, default: '' },
    score: { type: String, default: '' },
    coursework: [{ type: String }]
  },
  { _id: false }
)

const SkillGroupSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    items: [{ type: String }]
  },
  { _id: false }
)

const ProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, default: 'Akanksha Chaurasia' },
    title: { type: String, default: 'MERN Stack Developer' },
    tagline: { type: String, default: '' },
    bio: { type: String, default: '' },
    location: { type: String, default: 'Lucknow, Uttar Pradesh' },
    email: { type: String, default: 'chaurasiaakanksha64@gmail.com' },
    phone: { type: String, default: '+91 7275251067' },
    github: { type: String, default: 'https://github.com/AkankshaChaurasia' },
    linkedin: { type: String, default: 'https://linkedin.com/in/akankshachaurasia' },
    photoUrl: { type: String, default: '' },
    skillGroups: [SkillGroupSchema],
    projects: [ProjectSchema],
    experience: [ExperienceSchema],
    education: [EducationSchema],
    societies: [
      {
        name: { type: String },
        description: { type: String },
        _id: false
      }
    ]
  },
  { timestamps: true }
)

module.exports = mongoose.model('Profile', ProfileSchema)
