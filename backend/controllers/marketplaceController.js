const VehicleListing = require('../models/VehicleListing');

// @desc    Get all available vehicle listings
// @route   GET /api/marketplace
// @access  Public
const getListings = async (req, res) => {
  try {
    // Advanced Riyasewana Query Filtering Logic
    const { make, location, minPrice, maxPrice } = req.query;
    
    // Base query only fetches Available vehicles
    let query = { status: 'Available' };

    // Dynamically append filters if user searches them
    if (make) query.make = new RegExp(make, 'i'); // Case-insensitive Make Search
    if (location && location !== 'All') query.location = location;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const listings = await VehicleListing.find(query)
      .sort({ createdAt: -1 })
      .populate('sellerId', 'name phone'); // Attach Seller contact securely
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
    const listing = await VehicleListing.findById(req.params.id)
      .populate('sellerId', 'name phone email'); // Inject contact details
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
    const { 
      title, make, model, year, price, mileage, description, condition,
      transmission, fuelType, engineCapacity, bodyType, location, isNegotiable 
    } = req.body;
    
    // Extract uploaded image filenames from the Multer middleware
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => `/uploads/${file.filename}`);
    }

    const listing = new VehicleListing({
      title, make, model, year, price, mileage, description, condition, images,
      transmission, fuelType, engineCapacity, bodyType, location,
      isNegotiable: isNegotiable === 'true' || isNegotiable === true,
      sellerId: req.user._id // Automatically bind ad to logged in Seller
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

    // Validate Seller Ownership Strictly
    if (listing.sellerId.toString() !== req.user._id.toString()) {
      return res.status(401).json({message: 'Not authorized to edit this App'});
    }

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

    // Validate Seller Ownership Strictly
    if (listing.sellerId.toString() !== req.user._id.toString()) {
      return res.status(401).json({message: 'Not authorized to delete this Ad'});
    }

    await listing.deleteOne();
    res.status(200).json({ message: 'Listing removed successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getListings, getListingById, createListing, updateListing, deleteListing };
