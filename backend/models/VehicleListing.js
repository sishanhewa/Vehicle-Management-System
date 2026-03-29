const mongoose = require('mongoose');

const vehicleListingSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true // Now fully enforced using JWT token payloads
  },
  title: { type: String, required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  mileage: { type: Number, required: true },
  transmission: { type: String, enum: ['Manual', 'Automatic', 'Tiptronic'], required: true },
  fuelType: { type: String, enum: ['Petrol', 'Diesel', 'Hybrid', 'Electric'], required: true },
  engineCapacity: { type: Number, required: true },
  bodyType: { type: String, required: true },
  location: { type: String, required: true }, // e.g. Colombo, Kandy
  isNegotiable: { type: Boolean, default: false },
  description: { type: String },
  images: [{ type: String }],
  condition: { 
    type: String, 
    enum: ['New', 'Used', 'Reconditioned'], 
    default: 'Used' 
  },
  status: { 
    type: String, 
    enum: ['Available', 'Sold'], 
    default: 'Available' 
  },
}, { timestamps: true });

module.exports = mongoose.model('VehicleListing', vehicleListingSchema);
