const express = require('express');
const router = express.Router();

// Import the Multer upload middleware
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

// Import Controllers
const { 
  getListings, 
  getListingById, 
  createListing, 
  updateListing, 
  deleteListing 
} = require('../controllers/marketplaceController');

// Note: These routes are public to easily test via Postman while building.
// When your team builds User Authentication, drop your `protect` middleware in to secure POST/PUT/DELETE.

router.route('/')
  .get(getListings) 
  // Now explicitly protected so only verified Seller Accounts can Post Ads
  .post(protect, upload.array('images', 5), createListing); 

router.route('/:id')
  .get(getListingById)
  .put(protect, updateListing)
  .delete(protect, deleteListing);

module.exports = router;
