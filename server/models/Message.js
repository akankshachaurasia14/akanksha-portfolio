const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, default: '' },
    message: { type: String, required: true },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Message', MessageSchema)
