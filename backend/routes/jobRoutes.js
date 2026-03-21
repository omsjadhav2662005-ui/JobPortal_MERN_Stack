const r = require('express').Router();
const { createJob, getJobs, getJobById, getMyJobs, updateJob, deleteJob, getSimilarJobs } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');
r.route('/').get(getJobs).post(protect, createJob);
r.get('/myjobs', protect, getMyJobs);
r.get('/:id/similar', getSimilarJobs);
r.route('/:id').get(getJobById).put(protect, updateJob).delete(protect, deleteJob);
module.exports = r;
