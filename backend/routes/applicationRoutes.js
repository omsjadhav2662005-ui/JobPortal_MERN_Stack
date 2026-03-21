const r = require('express').Router();
const { applyToJob, getMyApplications, getJobApplications, updateApplicationStatus, withdrawApplication } = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
r.post('/', protect, applyToJob);
r.get('/my', protect, getMyApplications);
r.get('/job/:jobId', protect, getJobApplications);
r.put('/:id/status', protect, updateApplicationStatus);
r.delete('/:id', protect, withdrawApplication);
module.exports = r;
