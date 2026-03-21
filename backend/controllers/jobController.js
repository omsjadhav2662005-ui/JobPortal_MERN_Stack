const Job = require('../models/Job');
const Application = require('../models/Application');

const createJob = async (req, res, next) => {
  try {
    const { title, company, location, type, salary, salaryMin, salaryMax, description,
            requirements, responsibilities, skills, companyDesc, category, experienceLevel, deadline } = req.body;
    if (!title || !company || !location || !description) { res.status(400); throw new Error('Title, company, location and description required'); }
    const job = await Job.create({
      title, company, location, type, salary, salaryMin, salaryMax, description,
      requirements: requirements || [], responsibilities: responsibilities || [],
      skills: skills || [], companyDesc, category, experienceLevel, deadline,
      postedBy: req.user._id,
    });
    res.status(201).json(job);
  } catch (e) { next(e); }
};

const getJobs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip  = (page - 1) * limit;
    const filter = { isActive: true };
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { company: { $regex: req.query.search, $options: 'i' } },
        { location: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }
    if (req.query.type && req.query.type !== 'All') filter.type = req.query.type;
    if (req.query.category && req.query.category !== 'All') filter.category = req.query.category;
    if (req.query.level && req.query.level !== 'All') filter.experienceLevel = req.query.level;
    if (req.query.location) filter.location = { $regex: req.query.location, $options: 'i' };
    if (req.query.salary) { filter.salaryMin = { $lte: parseInt(req.query.salary) }; }

    const sort = req.query.sort === 'popular' ? { applicationCount: -1, views: -1 }
               : req.query.sort === 'salary'   ? { salaryMax: -1 }
               : { createdAt: -1 };

    const [jobs, total] = await Promise.all([
      Job.find(filter).populate('postedBy','name email profilePicture').sort(sort).skip(skip).limit(limit),
      Job.countDocuments(filter)
    ]);
    res.json({ jobs, total, page, pages: Math.ceil(total / limit) });
  } catch (e) { next(e); }
};

const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy','name email profilePicture headline');
    if (!job) { res.status(404); throw new Error('Job not found'); }
    await Job.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.json(job);
  } catch (e) { next(e); }
};

const getMyJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    const jobsWithCount = await Promise.all(jobs.map(async job => {
      const count = await Application.countDocuments({ job: job._id });
      return { ...job.toObject(), applicationCount: count };
    }));
    res.json(jobsWithCount);
  } catch (e) { next(e); }
};

const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) { res.status(404); throw new Error('Job not found'); }
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403); throw new Error('Not authorized to edit this job');
    }
    const fields = ['title','company','location','type','salary','salaryMin','salaryMax',
      'description','requirements','responsibilities','skills','companyDesc','category','experienceLevel','deadline','isActive'];
    fields.forEach(f => { if (req.body[f] !== undefined) job[f] = req.body[f]; });
    res.json(await job.save());
  } catch (e) { next(e); }
};

const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) { res.status(404); throw new Error('Job not found'); }
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403); throw new Error('Not authorized to delete this job');
    }
    await Application.deleteMany({ job: job._id });
    await job.deleteOne();
    res.json({ message: 'Job and all applications removed' });
  } catch (e) { next(e); }
};

const getSimilarJobs = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) { res.status(404); throw new Error('Job not found'); }
    const similar = await Job.find({
      _id: { $ne: job._id }, isActive: true,
      $or: [{ category: job.category }, { type: job.type }, { company: job.company }]
    }).limit(4).select('title company location type salary createdAt');
    res.json(similar);
  } catch (e) { next(e); }
};

module.exports = { createJob, getJobs, getJobById, getMyJobs, updateJob, deleteJob, getSimilarJobs };
