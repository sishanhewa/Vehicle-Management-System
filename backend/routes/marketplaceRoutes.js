const express = require('express');
const router = express.Router();

// Import the Multer upload middleware
const upload = require('../middleware/uploadMiddleware');

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
  // Expects 'images' field in FormData. Allows up to 5 images per upload.
  .post(upload.array('images', 5), createListing); 

router.route('/:id')
  .get(getListingById)
  .put(updateListing)
  .delete(deleteListing);

module.exports = router;
