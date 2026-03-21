const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title:          { type: String, required: true, trim: true },
  company:        { type: String, required: true, trim: true },
  location:       { type: String, required: true },
  type:           { type: String, enum: ['Full Time','Part Time','Remote','Internship','Contract'], default: 'Full Time' },
  salary:         { type: String, default: '' },
  salaryMin:      { type: Number },
  salaryMax:      { type: Number },
  description:    { type: String, required: true },
  requirements:   [{ type: String }],
  responsibilities:[{ type: String }],
  skills:         [{ type: String }],
  companyDesc:    { type: String, default: '' },
  companyLogo:    { type: String, default: '' },
  category:       { type: String, enum: ['Technology','Design','Marketing','Finance','Operations','Sales','HR','Other'], default: 'Technology' },
  experienceLevel:{ type: String, enum: ['Entry Level','Mid Level','Senior Level','Lead','Manager'], default: 'Mid Level' },
  deadline:       { type: Date },
  isActive:       { type: Boolean, default: true },
  views:          { type: Number, default: 0 },
  applicationCount:{ type: Number, default: 0 },
  postedBy:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

jobSchema.index({ title: 'text', company: 'text', description: 'text', location: 'text' });

module.exports = mongoose.model('Job', jobSchema);
