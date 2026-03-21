const Company = require('../models/Company');
const Job = require('../models/Job');

const getCompanies = async (req, res, next) => {
  try {
    const search = req.query.search;
    const filter = search ? { name: { $regex: search, $options: 'i' } } : {};
    const companies = await Company.find(filter).sort({ name: 1 });
    // Add job count for each
    const withCounts = await Promise.all(companies.map(async c => {
      const jobCount = await Job.countDocuments({ company: c.name, isActive: true });
      return { ...c.toObject(), jobCount };
    }));
    res.json(withCounts);
  } catch (e) { next(e); }
};

const getCompanyByName = async (req, res, next) => {
  try {
    let company = await Company.findOne({ name: decodeURIComponent(req.params.name) });
    if (!company) company = await Company.create({ name: decodeURIComponent(req.params.name) });
    const jobCount = await Job.countDocuments({ company: company.name, isActive: true });
    res.json({ ...company.toObject(), jobCount });
  } catch (e) { next(e); }
};

const updateCompany = async (req, res, next) => {
  try {
    let company = await Company.findOne({ name: decodeURIComponent(req.params.name) });
    if (!company) company = await Company.create({ name: decodeURIComponent(req.params.name) });
    const fields = ['founded','employees','website','industry','headquarters','benefits','tagline','about','logo','coverImage','socialLinks'];
    fields.forEach(f => { if (req.body[f] !== undefined) company[f] = req.body[f]; });
    if (req.body.review) {
      company.reviews.push({ ...req.body.review, reviewerId: req.user._id, reviewerName: req.user.name });
    }
    res.json(await company.save());
  } catch (e) { next(e); }
};

module.exports = { getCompanies, getCompanyByName, updateCompany };
