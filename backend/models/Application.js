const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job:        { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  applicant:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resumeName: String,
  resumePath: String,
  coverNote:  { type: String, default: '' },
  status:     { type: String, enum: ['Applied','Shortlisted','Interview','Rejected','Hired'], default: 'Applied' },
  statusHistory: [{
    status:  String,
    changedAt: { type: Date, default: Date.now },
    note:    String
  }],
  employerNote: { type: String, default: '' },
  interviewDate: Date,
}, { timestamps: true });

applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });
module.exports = mongoose.model('Application', applicationSchema);
