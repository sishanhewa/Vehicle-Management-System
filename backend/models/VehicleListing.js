const mongoose = require('mongoose');

const vehicleListingSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // Temporarily false so we can test posting listings before the Auth module is built
    required: false
  },
  title: { type: String, required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  mileage: { type: Number, required: true },
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
