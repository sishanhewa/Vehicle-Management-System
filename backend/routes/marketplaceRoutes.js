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
  deleteListing,
  getMyListings
} = require('../controllers/marketplaceController');

// Note: These routes are public to easily test via Postman while building.
// When your team builds User Authentication, drop your `protect` middleware in to secure POST/PUT/DELETE.

router.route('/')
  .get(getListings) 
  .post(protect, upload.array('images', 5), createListing); 

// Ad Management for Seller Dashboard
router.get('/my-listings', protect, getMyListings);

router.route('/:id')
  .get(getListingById)
  .put(protect, updateListing)
  .delete(protect, deleteListing);

module.exports = router;
