const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:           { type: String, required: true, trim: true },
  email:          { type: String, required: true, unique: true, lowercase: true },
  password:       { type: String, required: true },
  role:           { type: String, enum: ['jobseeker','employer','admin'], default: 'jobseeker' },
  profilePicture: { type: String, default: '' },
  headline:       { type: String, default: '' },
  about:          { type: String, default: '' },
  phone:          { type: String, default: '' },
  location:       { type: String, default: '' },
  skills:         [{ type: String }],
  certifications: [{ name: String, issuer: String, year: String, credentialUrl: String }],
  socialLinks:    { portfolio: String, linkedin: String, github: String, twitter: String },
  education:      [{ degree: String, institution: String, year: String, description: String }],
  experience:     [{ title: String, company: String, duration: String, description: String, current: Boolean }],
  resume:         { name: String, path: String },
  appliedJobs:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  savedJobs:      [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  connections:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  connectionRequests: [{
    from:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending','accepted','rejected'], default: 'pending' },
    sentAt: { type: Date, default: Date.now }
  }],
  notifications: [{
    message: String,
    type:    { type: String, enum: ['info','connection','application','message','job'], default: 'info' },
    link:    String,
    read:    { type: Boolean, default: false },
    time:    { type: Date, default: Date.now }
  }],
  isVerified:   { type: Boolean, default: false },
  lastActive:   { type: Date, default: Date.now },
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.matchPassword = function(p) { return bcrypt.compare(p, this.password); };

module.exports = mongoose.model('User', userSchema);
