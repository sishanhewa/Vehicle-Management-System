const VehicleListing = require('../models/VehicleListing');

// @desc    Get all available vehicle listings
// @route   GET /api/marketplace
// @access  Public
const getListings = async (req, res) => {
  try {
    const listings = await VehicleListing.find({ status: 'Available' }).sort({ createdAt: -1 });
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single listing details
// @route   GET /api/marketplace/:id
// @access  Public
const getListingById = async (req, res) => {
  try {
    const listing = await VehicleListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new vehicle listing
// @route   POST /api/marketplace
// @access  Public (Will be Private later)
const createListing = async (req, res) => {
  try {
    const { title, make, model, year, price, mileage, description, condition } = req.body;
    
    // Extract uploaded image filenames from the Multer middleware
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => `/uploads/${file.filename}`);
    }

    const listing = new VehicleListing({
      title, make, model, year, price, mileage, description, condition, images,
      // sellerId: req.user._id  // (Disabled until the Authentication module is done)
    });

    const savedListing = await listing.save();
    res.status(201).json(savedListing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a vehicle listing
// @route   PUT /api/marketplace/:id
// @access  Public (Will be Private later)
const updateListing = async (req, res) => {
  try {
    const listing = await VehicleListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    // Example Auth Check for Later:
    // if (listing.sellerId.toString() !== req.user._id.toString()) return res.status(401).json({message: 'Not authorized'});

    Object.assign(listing, req.body);
    const updatedListing = await listing.save();
    res.status(200).json(updatedListing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a vehicle listing
// @route   DELETE /api/marketplace/:id
// @access  Public (Will be Private later)
const deleteListing = async (req, res) => {
  try {
    const listing = await VehicleListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    // Example Auth Check for Later:
    // if (listing.sellerId.toString() !== req.user._id.toString()) return res.status(401).json({message: 'Not authorized'});

    await listing.deleteOne();
    res.status(200).json({ message: 'Listing removed successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getListings, getListingById, createListing, updateListing, deleteListing };
