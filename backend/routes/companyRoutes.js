const express = require('express');
const router = express.Router();
const {
  getCompanies,
  getCompanyByName,
  updateCompany,
} = require('../controllers/companyController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getCompanies);
router.get('/:name', getCompanyByName);
router.put('/:name', protect, updateCompany);

module.exports = router;