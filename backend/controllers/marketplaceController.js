const VehicleListing = require('../models/VehicleListing');

// @desc    Get all available vehicle listings
// @route   GET /api/marketplace
// @access  Public
const getListings = async (req, res) => {
  try {
    // Advanced 8-Field Query Filtering Logic
    const { 
      make, model, location, condition, fuelType, transmission, 
      yearMin, yearMax, minPrice, maxPrice, bodyType, sellerId
    } = req.query;
    
    // Base query only fetches Available vehicles
    let query = { status: 'Available' };

    // Dynamically append filters if user searches them
    if (sellerId) query.sellerId = sellerId;
    if (make && make !== 'Any Make') query.make = new RegExp(make, 'i');
    if (model) query.model = new RegExp(model, 'i');
    if (location && location !== 'Any City') query.location = location;
    if (condition && condition !== 'Any Condition') query.condition = condition;
    if (fuelType && fuelType !== 'Any Fuel') query.fuelType = fuelType;
    if (transmission && transmission !== 'Any Gear') query.transmission = transmission;
    if (bodyType && bodyType !== 'Any Type') query.bodyType = bodyType;

    // Numerical Range Interception
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (yearMin || yearMax) {
      query.year = {};
      if (yearMin) query.year.$gte = Number(yearMin);
      if (yearMax) query.year.$lte = Number(yearMax);
    }

    const listings = await VehicleListing.find(query)
      .sort({ createdAt: -1 })
      .populate('sellerId', 'name phone'); 
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get listings for the logged in user (Seller Dashboard)
// @route   GET /api/marketplace/my-listings
// @access  Private
const getMyListings = async (req, res) => {
  try {
    const listings = await VehicleListing.find({ sellerId: req.user._id }).sort({ createdAt: -1 });
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
// @access  Private (JWT Required)
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
// @access  Private (JWT Required)
const updateListing = async (req, res) => {
  try {
    const listing = await VehicleListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    // Validate Seller Ownership Strictly
    if (listing.sellerId.toString() !== req.user._id.toString()) {
      return res.status(401).json({message: 'Not authorized to edit this ad'});
    }

    // Extract updated fields from req.body
    const updateData = { ...req.body };

    // Numerical conversion (FormData sends everything as strings)
    if (updateData.year) updateData.year = Number(updateData.year);
    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.mileage) updateData.mileage = Number(updateData.mileage);
    if (updateData.engineCapacity) updateData.engineCapacity = Number(updateData.engineCapacity);
    if (updateData.isNegotiable !== undefined) {
      updateData.isNegotiable = updateData.isNegotiable === 'true' || updateData.isNegotiable === true;
    }

    // Handle new image uploads if provided
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => `/uploads/${file.filename}`);
    }

    Object.assign(listing, updateData);
    const updatedListing = await listing.save();
    res.status(200).json(updatedListing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a vehicle listing
// @route   DELETE /api/marketplace/:id
// @access  Private (JWT Required)
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

module.exports = { getListings, getListingById, createListing, updateListing, deleteListing, getMyListings };
