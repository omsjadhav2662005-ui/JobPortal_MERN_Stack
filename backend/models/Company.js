const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name:      { type: String, required: true, unique: true },
  founded:   String,
  employees: String,
  website:   String,
  industry:  String,
  headquarters: String,
  benefits:  [String],
  tagline:   String,
  about:     String,
  logo:      String,
  coverImage:String,
  socialLinks: { linkedin: String, twitter: String, github: String },
  reviews: [{
    reviewerName: String,
    reviewerId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating:       { type: Number, min: 1, max: 5 },
    title:        String,
    comment:      String,
    pros:         String,
    cons:         String,
    anonymous:    { type: Boolean, default: false },
    recommend:    { type: Boolean, default: true },
    date:         { type: Date, default: Date.now }
  }],
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
