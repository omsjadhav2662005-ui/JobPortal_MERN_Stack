const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');

const applyToJob = async (req, res, next) => {
  try {
    const { jobId, coverNote } = req.body;
    const job = await Job.findById(jobId);
    if (!job || !job.isActive) { res.status(404); throw new Error('Job not found or no longer active'); }
    const user = await User.findById(req.user._id);
    if (!user.resume?.path) { res.status(400); throw new Error('Upload a resume before applying'); }
    if (await Application.findOne({ job: jobId, applicant: req.user._id })) {
      res.status(400); throw new Error('Already applied to this job');
    }
    const application = await Application.create({
      job: jobId, applicant: req.user._id,
      resumeName: user.resume.name, resumePath: user.resume.path,
      coverNote: coverNote || '',
      statusHistory: [{ status: 'Applied', note: 'Application submitted' }]
    });
    await Job.findByIdAndUpdate(jobId, { $inc: { applicationCount: 1 } });
    if (!user.appliedJobs.some(j => j.toString() === jobId)) user.appliedJobs.push(jobId);
    user.notifications.unshift({ message: `Applied to ${job.title} at ${job.company}`, type: 'application', link: '/dashboard' });
    await user.save();
    // Notify employer
    if (job.postedBy) {
      const employer = await User.findById(job.postedBy);
      if (employer) {
        employer.notifications.unshift({ message: `New application for ${job.title} from ${user.name}`, type: 'application', link: '/dashboard' });
        await employer.save();
      }
    }
    res.status(201).json(application);
  } catch (e) { next(e); }
};

const getMyApplications = async (req, res, next) => {
  try {
    const apps = await Application.find({ applicant: req.user._id })
      .populate('job', 'title company location type salary category isActive createdAt')
      .sort('-createdAt');
    res.json(apps);
  } catch (e) { next(e); }
};

const getJobApplications = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) { res.status(404); throw new Error('Job not found'); }
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403); throw new Error('Not authorized');
    }
    const apps = await Application.find({ job: req.params.jobId })
      .populate('applicant','name email profilePicture headline skills resume location connections')
      .sort('-createdAt');
    res.json(apps);
  } catch (e) { next(e); }
};

const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, note, interviewDate, employerNote } = req.body;
    const valid = ['Applied','Shortlisted','Interview','Rejected','Hired'];
    if (!valid.includes(status)) { res.status(400); throw new Error('Invalid status'); }
    const app = await Application.findById(req.params.id).populate('job');
    if (!app) { res.status(404); throw new Error('Application not found'); }
    if (app.job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403); throw new Error('Not authorized');
    }
    app.status = status;
    app.statusHistory.push({ status, note: note || '', changedAt: new Date() });
    if (interviewDate) app.interviewDate = new Date(interviewDate);
    if (employerNote !== undefined) app.employerNote = employerNote;
    await app.save();
    const applicant = await User.findById(app.applicant);
    if (applicant) {
      applicant.notifications.unshift({
        message: `Your application for "${app.job.title}" at ${app.job.company} is now: ${status}`,
        type: 'application', link: '/dashboard'
      });
      await applicant.save();
    }
    res.json(app);
  } catch (e) { next(e); }
};

const withdrawApplication = async (req, res, next) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) { res.status(404); throw new Error('Application not found'); }
    if (app.applicant.toString() !== req.user._id.toString()) { res.status(403); throw new Error('Not authorized'); }
    if (app.status !== 'Applied') { res.status(400); throw new Error('Cannot withdraw after shortlisting'); }
    await app.deleteOne();
    await User.findByIdAndUpdate(req.user._id, { $pull: { appliedJobs: app.job } });
    await Job.findByIdAndUpdate(app.job, { $inc: { applicationCount: -1 } });
    res.json({ message: 'Application withdrawn' });
  } catch (e) { next(e); }
};

module.exports = { applyToJob, getMyApplications, getJobApplications, updateApplicationStatus, withdrawApplication };
