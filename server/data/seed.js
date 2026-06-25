/**
 * Run this once to populate the database with the initial profile data,
 * pulled from your resume. After this, edit the data through the
 * /api/profile PUT endpoint (or directly in the DB) — you won't need
 * to re-run this script or redeploy to change anything.
 *
 * Usage:
 *   npm run seed
 */
require('dotenv').config()
const mongoose = require('mongoose')
const Profile = require('../models/Profile')

const seedProfile = {
  name: 'Akanksha Chaurasia',
  title: 'MERN Stack Developer',
  tagline: 'Building systems that read, score, and respond.',
  bio:
    "I'm an MCA student in Lucknow who got hooked on full-stack development by building things that make a decision — a job portal that scores resumes against job listings, a chatbot that listens and responds, a system that reduces a hospital's spreadsheet chaos into one clean application. I work mainly in the MERN stack (MongoDB, Express, React, Node), with three years of Java/OOP underneath it, and I'm currently looking for a full-stack internship where I can keep building things that do more than just look good.",
  location: 'Lucknow, Uttar Pradesh',
  email: 'chaurasiaakanksha64@gmail.com',
  phone: '+91 7275251067',
  github: 'https://github.com/AkankshaChaurasia',
  linkedin: 'https://linkedin.com/in/akankshachaurasia',
  photoUrl: '',

  skillGroups: [
    {
      label: 'MERN / Web',
      items: [
        'React.js',
        'Node.js',
        'Express.js',
        'MongoDB',
        'REST APIs',
        'JavaScript',
        'TypeScript',
        'Tailwind CSS',
        'HTML5',
        'CSS3'
      ]
    },
    {
      label: 'Languages',
      items: ['Java', 'C/C++', 'JavaScript', 'Python', 'TypeScript']
    },
    {
      label: 'Tools & Platforms',
      items: [
        'Git/GitHub',
        'VS Code',
        'Docker',
        'Postman',
        'MySQL',
        'Bash',
        'Jupyter Lab',
        'Google Colab'
      ]
    },
    {
      label: 'Other',
      items: ['Data Structures & Algorithms', 'OOP Design', 'Kaggle']
    }
  ],

  projects: [
    {
      title: 'HirePulse — Job Portal Application',
      period: 'June 2026 – Present',
      techStack: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'REST API', 'JWT Auth'],
      description: [
        'Built a full-stack job portal that lets users upload their résumé and receive AI-driven analysis matching them to the most relevant job and internship opportunities — remote, hybrid, or onsite — across India.',
        'Designed RESTful APIs with Express.js and Node.js for CRUD operations against a MongoDB database with Mongoose schemas, secured with JWT authentication and role-based access for job seekers and recruiters.',
        'Implemented résumé parsing and keyword/skill-matching logic to automatically score and rank opportunities by relevance, surfaced in a responsive React.js + Tailwind CSS UI with filters for location, work mode, and role type.'
      ],
      codeUrl: '#',
      liveUrl: '',
      featured: true
    },
    {
      title: 'Personal Portfolio Website',
      period: '',
      techStack: ['React.js', 'JavaScript', 'Tailwind CSS', 'HTML5', 'CSS3'],
      description: [
        'Designed and built a fully responsive personal portfolio using React.js, showcasing projects, skills, and experience through a clean, component-based UI.',
        'Styled with Tailwind CSS for a mobile-first layout, with smooth scroll navigation and reusable UI components.',
        'Deployed for public access, optimizing load performance and ensuring cross-browser compatibility.'
      ],
      codeUrl: '#',
      liveUrl: '',
      featured: false
    },
    {
      title: 'Voice-Activated Python Chatbot (Siri Clone)',
      period: 'Apr 2026 – Present',
      techStack: ['Python', 'SpeechRecognition', 'Pyttsx3', 'NLP', 'Web APIs'],
      description: [
        'Built a voice-activated virtual assistant in Python integrating speech-to-text and text-to-speech for real-time conversational interaction.',
        'Integrated external web APIs to extend assistant functionality (search, information retrieval), applying basic NLP for intent recognition.'
      ],
      codeUrl: '#',
      liveUrl: '',
      featured: false
    },
    {
      title: 'Hospital Management System',
      period: 'Jan 2025 – Jun 2025',
      techStack: ['Java', 'MySQL', 'OOP'],
      description: [
        'Led development of a full-scale hospital management application using Java for core object-oriented business logic and MySQL for secure relational data storage.'
      ],
      codeUrl: '#',
      liveUrl: '',
      featured: false
    }
  ],

  experience: [
    {
      role: 'Excel Skills Job Simulation',
      org: 'JPMorgan Chase & Co. (via Forage)',
      period: 'Sep 2024',
      location: 'Virtual',
      bullets: [
        'Completed a virtual job simulation replicating real-world financial analyst tasks.',
        'Structured and analyzed large datasets to uncover business insights, financial trends, and operational efficiencies.',
        'Prepared data-driven summaries and visual reports in a professional, corporate-ready format.'
      ]
    },
    {
      role: 'Summer Training: Remote Sensing & GIS',
      org: 'Indian Space Academy',
      period: 'Jul 2025 – Aug 2025',
      location: '',
      bullets: [
        'Completed an intensive training program on satellite data acquisition, image processing, and geospatial analysis.',
        'Used GIS software to manipulate vector and raster data and produce high-accuracy thematic maps.',
        'Applied remote sensing methods to analyze environmental change and support data-driven decisions.'
      ]
    },
    {
      role: 'C++ and Data Structures Internship',
      org: 'Internship Studio',
      period: 'Apr 2024 – May 2024',
      location: 'Remote',
      bullets: [
        'Completed a dual training-and-internship program in advanced C++ and algorithmic problem-solving.',
        'Implemented linear and non-linear data structures and applied OOP design patterns for modular, reusable code.'
      ]
    }
  ],

  education: [
    {
      school: 'Institute of Engineering and Technology, Lucknow',
      degree: 'Master of Computer Applications',
      period: 'Expected Jul 2027',
      location: 'Lucknow, Uttar Pradesh',
      score: 'SGPA: 8.3 / 10.0',
      coursework: [
        'Data Structures',
        'DBMS',
        'Operating Systems',
        'Computer Networks',
        'Cyber Security',
        'Graph Theory'
      ]
    }
  ],

  societies: [
    {
      name: 'Parmarth Social Club, IET Lucknow',
      description:
        'Managed classroom decorum and daily operations for a high-volume learning environment of 150+ students.'
    }
  ]
}

async function seed() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error('MONGODB_URI is not set. Add it to your .env file before seeding.')
    process.exit(1)
  }

  await mongoose.connect(uri)
  console.log('Connected to MongoDB.')

  await Profile.deleteMany({})
  await Profile.create(seedProfile)

  console.log('Profile seeded successfully.')
  await mongoose.disconnect()
}

seed().catch((error) => {
  console.error('Seeding failed:', error)
  process.exit(1)
})
